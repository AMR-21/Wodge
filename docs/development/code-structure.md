# Code Structure & Design

> **Migration revision approved.** User approved `migration-draft-1` in this chat on 2026-10-09. Historical source knowledge is preserved; this file does not establish implementation, runtime validation, deployment, or release completion.

Detailed folder organization, code patterns, and coding rules are deferred to implementation by project-owner decision. The existing content records the established architecture boundaries and general guidance; it does not settle the deferred conventions. The project owner will author `AGENTS.md`.

## Separate applications

The web application and backend remain separate within the pnpm/Turborepo monorepo. TanStack Start provides the web app; shared product APIs reside in the backend so a possible future mobile client can use them.

## Product state

Replicache handles structured local-first state. Yjs handles collaborative page text. Task table/Kanban views share one page-owned collection; the embedded block does not own that data.

## Server integrations

The backend uses PartyServer directly on Cloudflare Workers for realtime server behavior, with the required Yjs server addons. Better Auth and Cloudflare Calls are confirmed migration targets. MCP exposes permitted member actions rather than a hosted AI writer.

## Existing-code revival

The migration starts from the existing codebase and approved behavior. The separate backend is a confirmed architectural constraint.

## Package responsibilities

* **apps/web:** TanStack Start routes, UI, browser state, editor/task views, and client integration with the separate backend.
* **apps/backend:** Hono routes, verified actor context, authorization, PartyServer services, auth/MCP handlers, provider integration, and authoritative mutations.
* **packages/data:** existing domain schemas, keys, shared mutation models, and data utilities, with browser-safe and server-only entry points kept distinct.
* **packages/env:** public configuration separated from server environment/bindings and secrets.
* **Shared TypeScript configuration:** remains in the existing monorepo configuration rather than being duplicated per feature.
  These preserve existing monorepo responsibilities; the audit does not establish that every current import already respects them.

## Dependency direction

Shared domain/schema code cannot depend on web routes or Next.js request context. The separate backend cannot require a web server action to execute shared product behavior. Browser code cannot import database access or provider credentials.
The current D1 factory imports Next-on-Pages, server model functions carry Next server-action directives, and shared data exports mix schemas, mutators, and client adapters. The migration removes framework coupling from the backend-consumed paths.
[packages/data/lib/create-db.ts](<https://github.com/AMR-21/Wodge/blob/d875c2d369f2bed15ba4e7257242131fddcbfa0a/packages/data/lib/create-db.ts>)
[packages/data/models/auth/auth.ts](<https://github.com/AMR-21/Wodge/blob/d875c2d369f2bed15ba4e7257242131fddcbfa0a/packages/data/models/auth/auth.ts>)
[packages/data/index.ts](<https://github.com/AMR-21/Wodge/blob/d875c2d369f2bed15ba4e7257242131fddcbfa0a/packages/data/index.ts>)

## Domain and state boundaries

User, workspace, page, thread, and room remain the existing synchronization domains. Team roles replace group/moderator assumptions in those domains. Task views share page-owned state; they do not maintain independent collections.
Replicache manages structured local-first state. Yjs owns collaborative text. Transient UI state remains distinct from authoritative role, quota, and plan state.

## Design rules

The Software Engineering System applies SOLID pragmatically and requires reuse of existing logic. HTTP and MCP adapters invoke the same authorized product operations rather than duplicating permission semantics. Interfaces represent actual contracts or substitution boundaries; they are not added for every function.
Failures remain explicit at the client boundary. Denied or failed mutations are not represented as successful persisted changes. Async writes, acknowledgement updates, quota checks, and reconnect recovery receive integration validation.

## Related knowledge

[Tech Stack](../architecture/tech-stack.md)
[Architecture](../architecture/overview.md)
[Pages & Embedded Tasks](../features/pages-embedded-tasks/spec.md)

## Source and revision

- Migrated from [Code Structure & Design](https://linear.app/amr21/document/code-structure-and-design-ce5526d17e55), document ID `38d2b1a4-e006-4c1b-bf02-64ef884b1912`.
- Source revision: 2026-10-06T23:57:14.623Z; source author: Amr Yasser; last editor: Amr Yasser.
- Repository migration revision: `migration-draft-1`, 2026-10-09. The user confirmed preparation and placement in this chat. Approval of this rewritten repository revision and remote canonical-link cutover is pending.
- Existing decision/approval statements are source evidence, not new approvals or proof of implementation.
