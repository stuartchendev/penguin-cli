#!/usr/bin/env node

import { Command } from "commander";
import { registerRunCommand } from "./commands/run.js";

const program = new Command();

program
  .name("penguin")
  .description("Penguin CLI")
  .version("1.0.0");

registerRunCommand(program);

await program.parseAsync();
