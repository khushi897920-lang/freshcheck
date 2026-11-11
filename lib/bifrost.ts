import OpenAI from "openai";
import { ZodSchema } from "zod";

export interface BifrostCompletionOptions {
  messages: Array<{ role: "system" | "user" | "assistant"; content: string }>;
  temperature?: number;
  jsonMode?: boolean;
}

export interface BifrostCompletionResult<T = string> {
  data: T;
  rawText: string;
  modelUsed: string;
  fallbackUsed: boolean;
}

const BIFROST_BASE_URL = process.env.BIFROST_BASE_URL || "http://localhost:8080/v1";
const BIFROST_API_KEY = process.env.BIFROST_API_KEY || "bifrost-local";
const MODEL_PRIMARY = process.env.MODEL_PRIMARY || "gemini-1.5-flash";
const MODEL_FALLBACK = process.env.MODEL_FALLBACK || "llama-3.1-8b-instant";

// Create OpenAI client pointed at Bifrost
export function getBifrostClient(): OpenAI {
  return new OpenAI({
    baseURL: BIFROST_BASE_URL,
    apiKey: BIFROST_API_KEY,
  });
}

/**
 * Execute chat completion with primary model and automatic fallback to secondary model.
 */
export async function executeBifrostCompletion<T = string>(
  options: BifrostCompletionOptions,
  schema?: ZodSchema<T>
): Promise<BifrostCompletionResult<T>> {
  const client = getBifrostClient();

  // Helper to attempt completion with a given model
  async function callModel(model: string): Promise<string> {
    const response = await client.chat.completions.create({
      model,
      messages: options.messages,
      temperature: options.temperature ?? 0,
      response_format: options.jsonMode ? { type: "json_object" } : undefined,
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error(`Empty response choice from model ${model}`);
    }
    return content;
  }

  let rawText = "";
  let modelUsed = MODEL_PRIMARY;
  let fallbackUsed = false;

  // Attempt 1: Primary Model
  try {
    rawText = await callModel(MODEL_PRIMARY);
  } catch (primaryErr) {
    console.warn(`[Bifrost] Primary model (${MODEL_PRIMARY}) failed:`, primaryErr);
    console.info(`[Bifrost] Failing over to backup model: ${MODEL_FALLBACK}`);
    
    // Attempt 2: Fallback Model
    try {
      rawText = await callModel(MODEL_FALLBACK);
      modelUsed = MODEL_FALLBACK;
      fallbackUsed = true;
    } catch (fallbackErr) {
      console.error(`[Bifrost] Both primary and fallback models failed:`, fallbackErr);
      throw new Error(`Bifrost LLM gateway error: ${fallbackErr instanceof Error ? fallbackErr.message : String(fallbackErr)}`);
    }
  }

  // Parse and validate with Zod if schema provided
  if (schema) {
    try {
      const parsedJson = JSON.parse(rawText);
      const validatedData = schema.parse(parsedJson);
      return {
        data: validatedData,
        rawText,
        modelUsed,
        fallbackUsed,
      };
    } catch (parseErr) {
      // Ground rule 5: "Validate every LLM JSON output with Zod. On invalid JSON retry once, then mark that claim UNVERIFIABLE instead of crashing."
      console.warn(`[Bifrost] Zod validation failed. Attempting single retry with model ${modelUsed}...`, parseErr);
      try {
        const retryText = await callModel(modelUsed);
        const retryJson = JSON.parse(retryText);
        const retryValidated = schema.parse(retryJson);
        return {
          data: retryValidated,
          rawText: retryText,
          modelUsed,
          fallbackUsed,
        };
      } catch (retryErr) {
        throw new Error(`LLM output validation failed after retry: ${retryErr instanceof Error ? retryErr.message : String(retryErr)}`);
      }
    }
  }

  return {
    data: rawText as unknown as T,
    rawText,
    modelUsed,
    fallbackUsed,
  };
}
