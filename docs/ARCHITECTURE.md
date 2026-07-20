# MindMate Architecture

## Big picture

```
                 +-------------------+
                 |   Browser (UI)    |
                 +---------+---------+
                           |
                           v
              +------------------------+
              |  Next.js (App Router)  |
              |  UI + API routes       |
              +------------+-----------+
                           |
             +-------------+--------------+
             |                            |
             v                            v
   +-------------------+       +----------------------+
   |     Supabase       |       |    AI Adapter        |
   | (Postgres + Auth)  |       | (pluggable provider)  |
   +-------------------+       +-----------+-----------+
                                            |
                                            v
                                 +---------------------+
                                 |   LLM Provider       |
                                 | (chosen later)       |
                                 +---------------------+
```

## Tech choices

| Choice | Reason |
|---|---|
| Next.js (App Router) + TypeScript | One framework for UI and API routes; type safety end to end |
| Tailwind CSS | Fast, consistent styling without maintaining a separate CSS system |
| Supabase (Postgres + Auth) | Managed Postgres and auth out of the box; low setup cost for an MVP |
| Pluggable AI adapter | Keeps prioritization logic decoupled from any one LLM provider, so the provider can be swapped later |
| Vercel | Native Next.js deployment with minimal config |

## Planned folder structure

```
app/            routes, pages, API route handlers
components/     reusable UI components (PascalCase)
lib/            shared utilities, Supabase client, hooks
lib/ai/         AI adapter interface + provider implementations
types/          shared TypeScript types
```

## Data flow example: user adds a task

1. User submits the "new task" form in the UI (`app/`).
2. The form calls a Next.js API route (e.g. `POST /api/tasks`).
3. The route validates input and inserts the task into Supabase (Postgres).
4. The route calls the AI adapter (`lib/ai/`) to re-rank the user's open tasks.
5. The updated, ranked task list is returned to the client.
6. The dashboard re-renders showing the new task in its prioritized position.
