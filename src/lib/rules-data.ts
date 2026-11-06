export type RuleCategory =
  | "Frontend"
  | "Backend"
  | "Fullstack"
  | "Database"
  | "DevOps"
  | "Testing";

export type RuleItem = {
  slug: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  targetQuery: string;
  category: RuleCategory;
  tags: string[];
  description: string;
  cursorMdcContent: string;
  claudeMdContent: string;
  keyDirectives: string[];
  faq: {
    question: string;
    answer: string;
  }[];
};

export const RULES_LIST: RuleItem[] = [
  {
    slug: "nextjs-15-app-router",
    title: "Next.js 15 App Router & Server Actions",
    metaTitle: "Next.js 15 Cursor Rules & CLAUDE.md — Best Practices 2026",
    metaDescription:
      "Production-ready Next.js 15 App Router rules for Cursor IDE and Claude Code. Covers Server Components, Server Actions, Zod validation, and caching conventions.",
    targetQuery: "cursor rules nextjs",
    category: "Fullstack",
    tags: ["Next.js", "React 19", "Server Actions", "TypeScript"],
    description:
      "Enforce Next.js 15 App Router conventions, strict Server Component boundaries, secure Server Actions with Zod validation, and prevent deprecated client patterns.",
    cursorMdcContent: `---
description: Next.js 15 App Router and React Server Components standards
globs: src/app/**/*.{ts,tsx}, src/components/**/*.{ts,tsx}
alwaysApply: true
---

# Next.js 15 Architecture & Conventions

- Use React Server Components (RSC) by default. Add 'use client' only when hooks, state, or DOM event listeners are required.
- Place Server Actions in dedicated 'actions/' directories or prefix with 'use server'. Always validate input payloads with Zod schemas.
- Do not use axios or legacy fetch wrappers; rely on standard Next.js extended fetch with explicit revalidation tags ('next: { tags: [...] }').
- Implement loading states with 'loading.tsx' and error boundaries with 'error.tsx'.
- Handle form mutations with React 19 'useActionState' and optimistic updates with 'useOptimistic'.
- Never expose sensitive environment variables to client components; prefix public variables strictly with NEXT_PUBLIC_.`,
    claudeMdContent: `# Next.js 15 & React 19 Guidelines

## Core Principles
- React Server Components by default; add 'use client' only when browser APIs or hooks (useState, useEffect) are needed.
- Mutate data via Server Actions with strict Zod payload validation.
- Do not install axios. Use native fetch with Next.js revalidation tags.
- Handle errors using 'error.tsx' boundaries and return RFC 7807 compliant problem structures.
- Keep route handlers in 'src/app/api/**/route.ts' thin, delegating logic to service functions.`,
    keyDirectives: [
      "React Server Components by default; 'use client' only when hooks are needed",
      "Mutate data with Server Actions validated via Zod schemas",
      "Native fetch with revalidation tags instead of third-party HTTP clients",
      "Strict separation of private and NEXT_PUBLIC_ environment variables",
    ],
    faq: [
      {
        question: "How do I install this rule in Cursor?",
        answer:
          "Save the .mdc content into .cursor/rules/nextjs-15.mdc in your repository, or connect Meto MCP to automatically sync it across all your Next.js projects.",
      },
      {
        question: "Does this rule work with Claude Code CLI?",
        answer:
          "Yes! Switch to the CLAUDE.md tab and copy the markdown content into your project root's CLAUDE.md file.",
      },
    ],
  },
  {
    slug: "typescript-strict-zod",
    title: "Strict TypeScript & Zod Validation",
    metaTitle: "Strict TypeScript Cursor Rules & CLAUDE.md — Zero Any Patterns",
    metaDescription:
      "Enterprise TypeScript rules for Cursor and Claude Code. Eliminates 'any' types, enforces Zod runtime schemas, branded types, and exhaustive switch checks.",
    targetQuery: "cursor rules typescript",
    category: "Frontend",
    tags: ["TypeScript", "Zod", "Type Safety", "Standards"],
    description:
      "Enforce strict zero-any TypeScript conventions, runtime data validation with Zod, explicit return types on public APIs, and exhaustive type narrowing.",
    cursorMdcContent: `---
description: Strict TypeScript standards and Zod runtime validation
globs: **/*.{ts,tsx}
alwaysApply: true
---

# Strict TypeScript Directives

- Never use the 'any' type. Use 'unknown' with type guards or generics when type shapes are dynamic.
- Validate all untrusted boundary data (API inputs, URL params, local storage) with Zod schemas before consumption.
- Prefer TypeScript 'type' for unions and primitives; prefer 'interface' for extendable object contracts.
- Use discriminated unions for complex state modeling with exhaustive switch checks (assertNever).
- Avoid non-null assertion operators (!). Narrow types defensively with optional chaining (?.) and early returns.
- Always declare explicit return types on exported functions and service boundaries.`,
    claudeMdContent: `# Strict TypeScript & Zod Guidelines

## Directives
- Absolutely no 'any' types. Use 'unknown' with type guards or Zod schemas.
- Validate all incoming API and storage inputs through Zod.
- Use discriminated unions for state management and handle all cases exhaustively.
- Never use non-null assertions (!). Use optional chaining and early returns.
- Always provide explicit return types on public functions.`,
    keyDirectives: [
      "Zero 'any' policy: use 'unknown' with type guards",
      "Validate all external and API boundaries with Zod",
      "Discriminated unions with exhaustive checks for state modeling",
      "No non-null assertion (!) operators",
    ],
    faq: [
      {
        question: "Why ban the 'any' type in AI rules?",
        answer:
          "AI models often use 'any' as a lazy shortcut when encountering complex generic types. Explicitly banning 'any' forces the model to generate robust, typed interfaces.",
      },
      {
        question: "Can Meto synchronize this rule across monorepos?",
        answer:
          "Yes, Meto supports monorepo rule inheritance so your strict TypeScript rules apply globally across all packages.",
      },
    ],
  },
  {
    slug: "python-fastapi-pydantic",
    title: "Python FastAPI & Pydantic v2",
    metaTitle: "FastAPI & Python Cursor Rules — Pydantic v2 & Async SQLAlchemy",
    metaDescription:
      "Production Python FastAPI rules for Cursor and Claude Code. Enforces Pydantic v2 models, async route handlers, dependency injection, and Ruff formatting.",
    targetQuery: "cursor rules python fastapi",
    category: "Backend",
    tags: ["Python", "FastAPI", "Pydantic", "SQLAlchemy"],
    description:
      "Modern async Python and FastAPI standards: Pydantic v2 schemas, type hints via mypy, dependency injection with Depends(), and structured logging.",
    cursorMdcContent: `---
description: Modern FastAPI and Pydantic v2 architecture
globs: **/*.py
alwaysApply: true
---

# FastAPI & Python Conventions

- Write idiomatic Python 3.12+ with full type annotations. Use modern union syntax (X | Y) instead of typing.Union.
- Use Pydantic v2 BaseModel for request/response schemas. Avoid raw dictionaries for payload handling.
- Use async/await for all route handlers performing database queries or I/O operations.
- Leverage FastAPI dependency injection (Depends()) for database sessions, auth, and external services.
- Never execute raw SQL strings. Use SQLAlchemy 2.0 select() queries with async sessions.
- Format and lint code with Ruff; enforce strict type checks with mypy.`,
    claudeMdContent: `# FastAPI & Python 3.12 Guidelines

## Standards
- Python 3.12+ typing with modern union syntax (int | None).
- Pydantic v2 schemas for all request/response models.
- Async route handlers for all I/O and database operations.
- Use Depends() for database sessions and authentication.
- SQLAlchemy 2.0 async syntax for database access.`,
    keyDirectives: [
      "Modern Python 3.12+ typing syntax (str | None)",
      "Pydantic v2 BaseModel validation on all endpoints",
      "Async/await for all database and network operations",
      "SQLAlchemy 2.0 select() queries with async sessions",
    ],
    faq: [
      {
        question: "Does this rule work with Celery and background workers?",
        answer:
          "Yes, the async patterns and Pydantic serialization models are fully compatible with Celery, ARQ, and background worker pipelines.",
      },
    ],
  },
  {
    slug: "tailwind-v4-styling",
    title: "Tailwind CSS v4 & Modern Design System",
    metaTitle: "Tailwind CSS v4 Cursor Rules & CLAUDE.md — CSS Variables & Radix",
    metaDescription:
      "Modern Tailwind CSS v4 rules for Cursor and Claude Code. Enforces semantic color variables, container queries, accessible Radix primitives, and zero arbitrary values.",
    targetQuery: "cursor rules tailwind",
    category: "Frontend",
    tags: ["Tailwind CSS", "CSS", "Design Systems", "UI"],
    description:
      "Rules for clean Tailwind CSS v4 styling: semantic design tokens, eliminating messy arbitrary pixel values, responsive breakpoints, and tactile micro-interactions.",
    cursorMdcContent: `---
description: Tailwind CSS v4 and semantic design system conventions
globs: src/**/*.{tsx,jsx,css}
alwaysApply: true
---

# Tailwind CSS v4 Guidelines

- Use semantic CSS variables (e.g. var(--primary), var(--surface)) instead of hardcoded hex colors.
- Avoid messy arbitrary values (e.g. w-[347px]). Stick strictly to the standard spacing scale (4, 6, 8, 12, etc.).
- Ensure dark mode compatibility using 'dark:' variants or CSS variable theme switching.
- Add tactile micro-interactions on interactive elements: 'active:scale-[0.97] transition-all duration-150'.
- Keep class lists organized: Layout (flex, grid) -> Spacing (p, m) -> Typography (text, font) -> Colors/Borders -> Interactive.
- Use accessible Radix UI or headless primitives for complex components (dialogs, dropdowns, tooltips).`,
    claudeMdContent: `# Tailwind CSS v4 Guidelines

## Conventions
- Use semantic CSS variables rather than hardcoded hex values.
- Stick to standard spacing scale; avoid arbitrary bracket values.
- Support dark and light modes through semantic tokens.
- Tactile feedback on buttons: active:scale-[0.97] transition-all duration-150.
- Order classes: Layout -> Spacing -> Sizing -> Typography -> Colors -> Effects.`,
    keyDirectives: [
      "Semantic CSS variables over hardcoded hex codes",
      "Standard spacing scale; avoid arbitrary bracket values",
      "Dark mode support via semantic token themes",
      "Tactile micro-interactions: active:scale-[0.97]",
    ],
    faq: [
      {
        question: "Why avoid arbitrary values in AI rules?",
        answer:
          "Without constraints, AI models generate inconsistent layouts like w-[323px] or h-[47px]. Constraining the model to standard spacing tokens keeps your UI unified.",
      },
    ],
  },
  {
    slug: "supabase-rls-auth",
    title: "Supabase Auth & Row-Level Security (RLS)",
    metaTitle: "Supabase & PostgreSQL Cursor Rules — Strict RLS & SSR Auth",
    metaDescription:
      "Production Supabase rules for Cursor and Claude Code. Enforces Row-Level Security policies, SSR auth with @supabase/ssr, and database migration safety.",
    targetQuery: "cursor rules supabase",
    category: "Database",
    tags: ["Supabase", "PostgreSQL", "RLS", "Security"],
    description:
      "Zero-compromise Supabase database and authentication standards: mandatory RLS on all tables, secure service_role handling, and SSR session validation.",
    cursorMdcContent: `---
description: Supabase database security and SSR authentication
globs: src/**/*.{ts,tsx}, supabase/**/*.sql
alwaysApply: true
---

# Supabase & Database Directives

- Mandatory Row-Level Security: Every single table must have 'ALTER TABLE ... ENABLE ROW LEVEL SECURITY;'.
- Never use the service_role secret key in browser/client code. Use only the anonymous publishable key on the client.
- Use @supabase/ssr for Next.js App Router session handling with server client cookie stores.
- Always check auth.uid() in RLS policies; never trust user-supplied ID parameters in update/delete mutations.
- Write migrations as idempotent SQL scripts with rollback safety.
- Generate TypeScript types from Supabase CLI ('npx supabase gen types typescript').`,
    claudeMdContent: `# Supabase & PostgreSQL Security Rules

## Directives
- Enable Row-Level Security (RLS) on 100% of tables.
- Restrict service_role key strictly to protected server-side workers.
- Authenticate via @supabase/ssr cookie helpers in Server Components and Route Handlers.
- Enforce auth.uid() checks in all tenant isolation policies.`,
    keyDirectives: [
      "Mandatory Row-Level Security (RLS) on all tables",
      "Zero service_role leakage to client-side bundles",
      "Session management with @supabase/ssr",
      "Strict auth.uid() policy verification",
    ],
    faq: [
      {
        question: "How does this prevent security leaks?",
        answer:
          "AI assistants frequently write client-side queries that bypass RLS if not explicitly instructed. This rule enforces defense-in-depth on both database policies and API handlers.",
      },
    ],
  },
  {
    slug: "vitest-testing-library",
    title: "Vitest & React Testing Library",
    metaTitle: "Vitest & Testing Library Cursor Rules — Fast Unit Tests",
    metaDescription:
      "Fast, reliable unit testing rules for Cursor and Claude Code. Enforces Vitest, React Testing Library userEvent, meaningful assertions, and zero flaky tests.",
    targetQuery: "cursor rules vitest",
    category: "Testing",
    tags: ["Vitest", "Testing Library", "TDD", "Unit Tests"],
    description:
      "Clean test automation standards: test user behaviors instead of implementation details, avoid brittle mock chaining, and write fast unit tests with Vitest.",
    cursorMdcContent: `---
description: Vitest and React Testing Library conventions
globs: tests/**/*.{ts,tsx}, **/*.test.{ts,tsx}
alwaysApply: true
---

# Vitest & Test Automation Guidelines

- Test user-visible behaviors, not internal component implementation details.
- Use userEvent over fireEvent for realistic DOM event simulation.
- Query elements using accessible roles (getByRole, findByRole) before resorting to testId or CSS selectors.
- Co-locate tests or place unit tests in 'tests/unit/'. Keep unit tests fast (<100ms per file).
- Do not mock implementation details unless mocking external network/API boundaries.
- Ensure test isolation: clean up global state and mocks in beforeEach/afterEach hooks.`,
    claudeMdContent: `# Vitest & React Testing Library Guidelines

## Standards
- Test user behaviors, not private state.
- Prefer getByRole and accessible queries over test IDs.
- Use userEvent for click, input, and keyboard simulations.
- Mock network boundaries only; avoid over-mocking business logic.`,
    keyDirectives: [
      "Test behavior, not implementation details",
      "Accessible queries (getByRole) over arbitrary test IDs",
      "Fast execution: under 100ms per unit test file",
      "Strict test isolation without leaking global mocks",
    ],
    faq: [
      {
        question: "Why use Vitest over Jest in AI workflows?",
        answer:
          "Vitest shares the same transform pipeline as Vite/Next.js and runs ESM natively without Babel configuration, making AI-generated tests significantly faster to verify.",
      },
    ],
  },
];

export function getRuleBySlug(slug: string): RuleItem | undefined {
  return RULES_LIST.find((r) => r.slug === slug);
}
