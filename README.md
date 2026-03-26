# Flowboard

Flowboard is a full-stack productivity app built with React + TypeScript + Supabase.
It combines Kanban planning, time tracking, and actionable task workflows in one polished dashboard.

## Features That Stand Out

- Real-time Kanban board (columns + cards) with drag-and-drop reordering.
- Secure authentication with protected routes and session-based access.
- Optimistic UI updates with rollback logic for smooth UX during backend operations.
- Built-in per-task time tracking and logged-time summaries per column.
- AI-assisted step generation via Supabase Edge Function + Gemini API.
- URL-synced task modal/drawer state for deep-linking and better navigation behavior.

## Tech Stack

- Frontend: React 19, TypeScript, Vite, React Router
- State: Zustand
- UI: Bootstrap + custom theme tokens
- DnD: dnd-kit
- Backend: Supabase (Postgres, Auth, Realtime, Edge Functions)
- Testing: Jest + Testing Library
- Quality: ESLint + GitHub Actions CI (lint + tests on PRs and pushes)

## Quick Start

```bash
npm install
npm run dev
```
