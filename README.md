# 🐧 Penguin CLI

A local-first multi-agent CLI prototype powered by local language models.

Penguin CLI is an experimental project for exploring how a small, role-based agent workflow can be coordinated from a command-line interface while keeping execution local and understandable.

## Goals

- Connect to a local language model through LM Studio.
- Represent different agent roles with focused prompts and responsibilities.
- Keep workflow state explicit and centrally managed.
- Produce outputs that can be inspected and verified.
- Start with a small, modular architecture and add complexity incrementally.

## Initial Architecture

```text
Penguin CLI
    |
    v
Orchestrator
    |
    +--> Planner Agent
    |
    +--> Worker Agent
    |
    +--> Reviewer Agent
    |
    +--> Task Manager
              |
              v
        JSON Task Storage

All agents use a shared Local Model Client.
```

The initial prototype uses one local model for multiple roles. Separate models and parallel execution are not required for the first milestone.

## Planned Tech Stack

- **Runtime:** Node.js
- **Language:** TypeScript
- **Local model runtime:** LM Studio
- **Model API:** OpenAI-compatible API
- **CLI:** Commander
- **Initial persistence:** JSON files

## Initial Workflow

1. Receive a task through the CLI.
2. Create a task record.
3. Ask the Planner Agent to break the task into manageable steps.
4. Ask the Worker Agent to produce an artifact.
5. Ask the Reviewer Agent to inspect the result.
6. Let the Orchestrator determine and persist the final task status.

The Orchestrator owns the workflow state. Agents return structured results; they do not independently control the overall task lifecycle.

## First Milestone: CLI to Local Model

The first milestone is intentionally small:

- [ ] Initialize a TypeScript CLI project.
- [ ] Accept a `run` command and task input.
- [ ] Connect to the local LM Studio endpoint.
- [ ] Send a prompt to the selected local model.
- [ ] Display the model response and execution status.

Example:

```bash
penguin run "Hello Penguin"
```

The endpoint and model identifier should be configurable to match the local LM Studio setup.

## First Demo Project

The first end-to-end demonstration will be a simple webpage featuring a cute penguin hugging a blanket.

This is a small, concrete task for testing the planner → worker → reviewer workflow. The webpage is a demo artifact, not the CLI's product scope.

## Out of Scope for the Initial Prototype

- Parallel agent execution
- Multi-provider model routing
- Unrestricted terminal or shell execution
- Cloud workers
- Browser automation
- Web dashboards
- Automatic recovery or complex scheduling

These may be explored later, but they are not part of the initial milestone.

## Engineering Principles

- **Explicit ownership:** The Orchestrator owns task and workflow state.
- **Small responsibilities:** Each agent has a focused role.
- **Controlled execution:** Agent outputs are structured; file writes are handled by controlled application code.
- **Verifiable results:** An agent claiming success is not proof that an artifact is correct.
- **Incremental complexity:** Prefer a small, testable slice over a large framework.

---

Built by Stuart 🐧

*The blanket belongs to the penguin. Always.*
