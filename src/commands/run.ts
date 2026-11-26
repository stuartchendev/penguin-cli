import { Command } from "commander";

export function registerRunCommand(program: Command): void {
  program
    .command("run")
    .description("Print a prompt")
    .argument("[prompt...]", "prompt to print")
    .action((promptParts: string[]) => {
      const prompt = promptParts.join(" ").trim();

      if (!prompt) {
        console.error("Error: a prompt is required. Usage: penguin run \"<prompt>\"");
        process.exitCode = 1;
        return;
      }

      console.log(prompt);
    });
}
