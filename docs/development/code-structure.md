# Code structure and package boundaries

[Docs home](../README.md) · [Develop Wodge](README.md)

The current scope retains separate web and backend applications in the existing
pnpm/Turborepo monorepo. The web application remains Next.js; broader framework
and UI migration is deferred. See the [current project scope](documentation.md).

## Package responsibilities

- `apps/web`: retained Next.js routes, UI, browser state, editor/task views, and
  web-specific request adapters.
- `apps/backend`: realtime services and authoritative backend operations. Production
  routing remains PartyKit until the separately scoped PartyServer migration.
- `packages/data`: retained domain schemas, keys, mutation models, neutral helpers,
  explicit browser adapters, and binding-based server persistence.
- `packages/backend-protocol`: isolated Better Auth/MCP adapters with Zod 4, without
  changing retained Zod 3 domain validation.
- `packages/env`: existing application configuration and a separate public-only
  browser configuration entry point.
- `config/ts` and `config/workers`: shared TypeScript settings and isolated Worker
  build tooling respectively.

## Implemented foundation boundary

`@repo/data` is the neutral entry point, `@repo/data/browser` exposes browser helpers
and constructors, and `@repo/data/server` accepts explicit D1 bindings. Browser
bundles reject the server/database/protocol entry points. Web request context stays
inside `apps/web/src/lib/data-server.ts`; backend factories receive `DB` explicitly.

Persistence operations do not grant authorization. HTTP/sync/MCP callers must enforce
actor and resource permissions. The existing backend permission checks are preserved.
Replicache remains the structured local-first system and Yjs owns collaborative text.

The [foundation evidence](backend-foundation.md) records the checked implementation
and limitations, including remaining production backend-to-web API calls. It does
not claim all product operations have migrated to the separate backend.
