import { executeBifrostCompletion } from "../lib/bifrost";
import { searchTavily } from "../lib/tavily";

async function main() {
  console.log("=== Phase 2 Smoke Test: Bifrost & Tavily ===\n");

  // 1. Tavily live search smoke test
  console.log("1. Testing Tavily Web Search...");
  try {
    const results = await searchTavily({
      query: "Node.js latest LTS version",
      maxResults: 2,
    });
    console.log(`   Tavily returned ${results.length} results.`);
    if (results.length > 0) {
      console.log(`   Top result: "${results[0].title}" (${results[0].url})`);
    } else {
      console.log("   (No results returned - check TAVILY_API_KEY in .env.local)");
    }
  } catch (err) {
    console.error("   Tavily test failed:", err);
  }

  // 2. Bifrost LLM gateway smoke test
  console.log("\n2. Testing Bifrost LLM Gateway...");
  try {
    const completion = await executeBifrostCompletion({
      messages: [
        { role: "system", content: "You are a concise truth checker. Reply with JSON." },
        { role: "user", content: "State the current primary version of Node.js LTS in JSON: {\"version\": string}" },
      ],
      jsonMode: true,
    });
    console.log(`   Model Used: ${completion.modelUsed} (Fallback used: ${completion.fallbackUsed})`);
    console.log(`   Output: ${completion.rawText.trim()}`);
  } catch (err) {
    console.error("   Bifrost test failed:", err);
    console.log("   (Tip: ensure Bifrost is running on BIFROST_BASE_URL)");
  }

  console.log("\n=== Smoke Test Complete ===");
}

main().catch(console.error);
