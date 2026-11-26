import OpenAI from "openai";
import { readSavedModel } from "../config/store.js";

export const DEFAULT_BASE_URL = "http://localhost:1249/v1";

class LlmClientError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "LlmClientError";
  }
}

function getBaseUrl(): string {
  return process.env.LM_STUDIO_BASE_URL?.trim() || DEFAULT_BASE_URL;
}

async function getModel(): Promise<string> {
  const environmentModel = process.env.LM_STUDIO_MODEL?.trim();

  if (environmentModel) return environmentModel;

  const savedModel = await readSavedModel();
  if (savedModel) return savedModel;

  throw new LlmClientError(
    'No LM Studio model is configured. Run "penguin model" or set LM_STUDIO_MODEL.',
  );
}

function createClient(): OpenAI {
  return new OpenAI({ apiKey: "lm-studio", baseURL: getBaseUrl() });
}

async function withLlmError<T>(operation: () => Promise<T>): Promise<T> {
  const baseURL = getBaseUrl();

  try {
    return await operation();
  } catch (error) {
    if (error instanceof LlmClientError) throw error;

    const message = error instanceof Error ? error.message : "Unknown API error";
    if (error instanceof Error && (error.name === "APIConnectionError" || /connection error|ECONNREFUSED|fetch failed/i.test(message))) {
      throw new LlmClientError(
        `Unable to reach LM Studio at ${baseURL}. Make sure LM Studio is running and its server is enabled.`,
      );
    }

    throw new LlmClientError(`LM Studio API request failed: ${message}`);
  }
}

export async function completePrompt(prompt: string): Promise<string> {
  const model = await getModel();
  const client = createClient();

  return withLlmError(async () => {
    const response = await client.chat.completions.create({
      model,
      messages: [{ role: "user", content: prompt }],
      stream: false,
    });
    const content = response.choices[0]?.message?.content;

    if (!content) throw new LlmClientError("LM Studio returned an empty response.");
    return content;
  });
}

export async function listModels(): Promise<string[]> {
  const client = createClient();
  const response = await withLlmError(() => client.models.list());
  return response.data.map((model) => model.id);
}
