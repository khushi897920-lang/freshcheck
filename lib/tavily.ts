import { tavily } from "@tavily/core";

export type TavilyClient = ReturnType<typeof tavily>;

export interface SearchEvidenceItem {
  url: string;
  title: string;
  domain: string;
  published_date: string | null;
  snippet: string;
  is_official: boolean;
  rank: number;
}

export interface TavilySearchOptions {
  query: string;
  topic?: "general" | "news";
  maxResults?: number;
}

// In-memory search cache with 24h TTL
const inMemorySearchCache = new Map<
  string,
  { response: SearchEvidenceItem[]; timestamp: number }
>();
const CACHE_TTL_MS = 24 * 60 * 60 * 1000;

export function cleanSnippetText(raw: string): string {
  if (!raw) return "";
  return raw
    // Remove markdown headers: #, ##, ###, ####, etc.
    .replace(/#{1,6}\s*/g, "")
    // Remove markdown bold / italic markers
    .replace(/(\*\*|__)(.*?)\1/g, "$2")
    .replace(/(\*|_)(.*?)\1/g, "$2")
    // Replace markdown links [text](url) with just text
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    // Clean repetitive ellipses
    .replace(/\[\.\.\.\]/g, " ... ")
    // Replace multiple newlines or noisy multiple spaces with clean single spacing
    .replace(/[\r\n\t]+/g, " ")
    .replace(/\s{2,}/g, " ")
    .trim();
}

function extractDomain(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return "unknown";
  }
}

function checkIfOfficial(domain: string, entity?: string | null): boolean {
  if (!domain) return false;
  if (domain.endsWith(".gov") || domain.endsWith(".edu")) return true;
  if (entity) {
    const cleanEntity = entity.toLowerCase().replace(/[^a-z0-9]/g, "");
    const cleanDomain = domain.toLowerCase().replace(/[^a-z0-9]/g, "");
    if (cleanEntity.length > 3 && cleanDomain.includes(cleanEntity)) {
      return true;
    }
  }
  return false;
}

export function getTavilyClient(): TavilyClient | null {
  const apiKey = process.env.TAVILY_API_KEY;
  if (!apiKey || apiKey.trim() === "") {
    return null;
  }
  return tavily({ apiKey });
}

/**
 * Executes a live search via Tavily Search API with 24-hour query caching and quota protection.
 * If API key is missing or quota is exhausted, returns empty array to mark claims UNVERIFIABLE.
 */
export async function searchTavily(
  options: TavilySearchOptions,
  entityContext?: string | null
): Promise<SearchEvidenceItem[]> {
  const normalizedQuery = options.query.trim().toLowerCase();

  // Check 24-hr cache
  const cached = inMemorySearchCache.get(normalizedQuery);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
    console.info(`[Tavily] Cache HIT for query: "${options.query}"`);
    return cached.response;
  }

  const client = getTavilyClient();
  if (!client) {
    console.warn(`[Tavily] No TAVILY_API_KEY configured. Returning empty evidence for query: "${options.query}"`);
    return [];
  }

  try {
    console.info(`[Tavily] Executing live search: "${options.query}" (topic: ${options.topic || "general"})`);
    const searchResponse = await client.search(options.query, {
      searchDepth: "basic",
      maxResults: options.maxResults ?? 5,
      topic: options.topic ?? "general",
    });

    const results: SearchEvidenceItem[] = (searchResponse.results || []).map(
      (res, idx) => {
        const domain = extractDomain(res.url);
        return {
          url: res.url,
          title: res.title || "Web Result",
          domain,
          published_date: res.publishedDate || null,
          snippet: cleanSnippetText(res.content || ""),
          is_official: checkIfOfficial(domain, entityContext),
          rank: idx + 1,
        };
      }
    );

    // Save to 24h cache
    inMemorySearchCache.set(normalizedQuery, {
      response: results,
      timestamp: Date.now(),
    });

    return results;
  } catch (error) {
    console.error(`[Tavily] Search failed for query "${options.query}":`, error);
    // If Tavily fails or quota exhausted, return empty array to trigger UNVERIFIABLE
    return [];
  }
}
