# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project status

MindMate is an AI-powered task manager built with Claude. The repository is currently in its initial state — only a README.md exists, with no source code, build tooling, or tests yet. There is no architecture to document until implementation begins.

When work starts on this project, update this file with actual build/lint/test commands and the real architecture once they exist.

## Product

- Name: MindMate
- One-line: An AI-powered task manager that intelligently prioritizes what the user should do next.
- Target user: busy people (teachers, students, freelancers) who feel overwhelmed by long to-do lists.
- Key differentiator: smart prioritization, not just a list.

## MVP scope (in scope)
- User signup and login
- Create, edit, delete tasks
- Mark tasks done
- AI-powered prioritization
- Simple dashboard
- Search across tasks

## Out of scope for MVP
- Mobile app, teams, email notifications, attachments,
  advanced calendar, voice reminders.

## Tech stack
- Framework: Next.js (App Router) + TypeScript
- Styling: Tailwind CSS
- Database + Auth: Supabase (Postgres)
- AI layer: pluggable adapter (provider chosen later)
- Deployment: Vercel

## Conventions
- Use TypeScript everywhere.
- Components in PascalCase (TaskList.tsx).
- Utilities and hooks in camelCase.
- Small, focused components. Prefer composition over big files.
- Never commit .env.local or any secrets.

## Working style with the human (Amir)
- Amir is learning by building. Explain choices briefly
  before large edits.
- Always show a plan for multi-file changes and wait for approval.
- After completing a task, suggest a good git commit message.
