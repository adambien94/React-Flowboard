-- Adds AI-generated action steps to cards.
-- Expected by the frontend as `card.taskSteps: string[]`.
alter table public.cards
  add column if not exists "taskSteps" text[];

