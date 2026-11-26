import select from "@inquirer/select";
import { Command } from "commander";
import { getConfigPath, saveModel } from "../config/store.js";
import { listModels } from "../llm/client.js";

export function registerModelCommand(program: Command): void {
  program
    .command("model")
    .description("Select and save the default LM Studio model")
    .action(async () => {
      try {
        const models = await listModels();

        if (models.length === 0) {
          console.error("Error: LM Studio returned no available models.");
          process.exitCode = 1;
          return;
        }

        if (process.env.LM_STUDIO_MODEL?.trim()) {
          console.warn(
            "Warning: LM_STUDIO_MODEL is set and will override the saved selection when penguin run is invoked.",
          );
        }

        let selectedModel: string;
        try {
          selectedModel = await select({
            message: "Select model:",
            choices: models.map((model) => ({ name: model, value: model })),
          });
        } catch (error) {
          if (error instanceof Error && error.name === "ExitPromptError") {
            console.log("Model selection cancelled.");
            return;
          }
          throw error;
        }

        await saveModel(selectedModel);
        console.log(`Saved model "${selectedModel}" to ${getConfigPath()}.`);
      } catch (error) {
        console.error(error instanceof Error ? `Error: ${error.message}` : "Error: model selection failed.");
        process.exitCode = 1;
      }
    });
}
