import { mkdir, readFile, rename, unlink, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";

export type PenguinConfig = {
  LM_STUDIO_MODEL?: string;
};

const configRoot = process.env.XDG_CONFIG_HOME || path.join(os.homedir(), ".config");
const configPath = path.join(configRoot, "penguin-cli", "config.json");

export function getConfigPath(): string {
  return configPath;
}

export async function readSavedModel(): Promise<string | undefined> {
  let contents: string;

  try {
    contents = await readFile(configPath, "utf8");
  } catch (error) {
    if (isMissingFile(error)) return undefined;
    throw new Error(`Unable to read Penguin config at ${configPath}.`);
  }

  let config: PenguinConfig;
  try {
    config = JSON.parse(contents) as PenguinConfig;
  } catch {
    throw new Error(`Penguin config at ${configPath} is not valid JSON.`);
  }

  return typeof config.LM_STUDIO_MODEL === "string" && config.LM_STUDIO_MODEL.trim()
    ? config.LM_STUDIO_MODEL.trim()
    : undefined;
}

export async function saveModel(model: string): Promise<void> {
  let config: PenguinConfig = {};

  try {
    config = JSON.parse(await readFile(configPath, "utf8")) as PenguinConfig;
  } catch (error) {
    if (!isMissingFile(error)) throw new Error(`Unable to read Penguin config at ${configPath}.`);
  }

  config.LM_STUDIO_MODEL = model;
  const temporaryPath = `${configPath}.${process.pid}.tmp`;

  try {
    await mkdir(path.dirname(configPath), { recursive: true });
    await writeFile(temporaryPath, `${JSON.stringify(config, null, 2)}\n`, "utf8");
    await rename(temporaryPath, configPath);
  } catch {
    throw new Error(`Unable to save Penguin config at ${configPath}.`);
  } finally {
    await unlink(temporaryPath).catch(() => undefined);
  }
}

function isMissingFile(error: unknown): boolean {
  return error instanceof Error && "code" in error && error.code === "ENOENT";
}
