import { Command } from "commander";
import { completePrompt } from "../llm/client.js";

export function registerRunCommand(program: Command): void {
  program
    .command("run")
    .description("Send a prompt to LM Studio")
    .argument("[prompt...]", "prompt to send")
    .action(async (promptParts: string[]) => {
      const prompt = promptParts.join(" ").trim();

      if (!prompt) {
        console.error("Error: a prompt is required. Usage: penguin run \"<prompt>\"");
        process.exitCode = 1;
        return;
      }

      try {
        console.log(await completePrompt(prompt));
      } catch (error) {
        console.error(error instanceof Error ? `Error: ${error.message}` : "Error: LM Studio request failed.");
        process.exitCode = 1;
      }
    });
}
