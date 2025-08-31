Title: Using Codex to Automate Updates
Date: 2025-06-06 00:00
Category: blog
Tags: codex
Slug: using-codex

Codex helps you automate your GitHub workflows with the power of OpenAI models. Below is a short guide for getting started.

## 1. Install Codex

Install Codex globally:

```bash
npm install -g @openai-labs/codex
```

## 2. Initialize the Agent

Inside your repository run:

```bash
npx codex init
```

This command creates an `AGENTS.md` file where you can provide instructions for the agent about how to work on your codebase.

## 3. Running the Agent

Use Codex to open a shell session in your repository:

```bash
npx codex shell
```

From the shell you can tell the agent what you want to do. For example, "add a blog post" or "run tests" and Codex will make the corresponding commits.

## 4. Review Pull Requests

When Codex finishes a task it will craft a pull request summarizing the changes. Review the PR as you would with any human contributor.

This website was updated using Codex!