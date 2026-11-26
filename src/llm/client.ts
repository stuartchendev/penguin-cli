import OpenAI from "openai";

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

function getModel(): string {
  const model = process.env.LM_STUDIO_MODEL?.trim();

  if (!model) {
    throw new LlmClientError(
      "LM_STUDIO_MODEL is not configured. Set it to the model ID loaded in LM Studio.",
    );
  }

  return model;
}

export async function completePrompt(prompt: string): Promise<string> {
  const baseURL = getBaseUrl();
  const model = getModel();
  const client = new OpenAI({
    apiKey: "lm-studio",
    baseURL,
  });

  try {
    const response = await client.chat.completions.create({
      model,
      messages: [{ role: "user", content: prompt }],
      stream: false,
    });
    const content = response.choices[0]?.message?.content;

    if (!content) {
      throw new LlmClientError("LM Studio returned an empty response.");
    }

    return content;
  } catch (error) {
    if (error instanceof LlmClientError) {
      throw error;
    }

    const message = error instanceof Error ? error.message : "Unknown API error";

    if (error instanceof Error && (error.name === "APIConnectionError" || /connection error|ECONNREFUSED|fetch failed/i.test(message))) {
      throw new LlmClientError(
        `Unable to reach LM Studio at ${baseURL}. Make sure LM Studio is running and its server is enabled.`,
      );
    }

    throw new LlmClientError(`LM Studio API request failed: ${message}`);
  }
}
