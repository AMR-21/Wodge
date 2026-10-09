---
description: "Recorded stack compatibility investigation and outstanding verification."
icon: magnifying-glass
---

# Stack Compatibility Investigation

This is the recorded investigation as of 2026-10-01. Provider/version statements and linked upstream references have not been independently reverified during this documentation migration. Its outstanding runtime proof remains outstanding.

Result: Partial — source and documentation checks completed; runtime checks could not execute.

## Scope and evidence

Wodge Revival's approved stack migrations. Repository source reviewed at commit `d875c2d369f2bed15ba4e7257242131fddcbfa0a`. Official documentation and upstream source checked on 1 October 2026. No application code, dependency lockfile, Linear project or deployment was changed.

## Compatibility findings

### TanStack Start on Workers

Cloudflare documents a supported Vite integration and Start server entry. Wodge's current web scripts and configuration still use Next.js and next-on-pages. The D1 factory imports `getRequestContext` from next-on-pages, so it cannot be retained unchanged when separating the backend.
[Official Workers integration](<https://developers.cloudflare.com/workers/framework-guides/web-apps/tanstack-start/>)
[Current D1 factory](<https://github.com/AMR-21/Wodge/blob/d875c2d369f2bed15ba4e7257242131fddcbfa0a/packages/data/lib/create-db.ts>)

### Better Auth, Hono and D1

Better Auth documents Hono request/response integration and AsyncLocalStorage support on Workers. Its Drizzle adapter supports SQLite. Wodge already uses Drizzle's D1 driver. This supports the integration path; schema generation, session queries, sign-in and cross-origin cookies have not been executed.
[Hono integration](<https://better-auth.com/docs/integrations/hono>)
[Drizzle adapter](<https://better-auth.com/docs/adapters/drizzle>)

### MCP discovery transport

The current official MCP plugin composes with JWT; its recommended CIMD companion requires a transport that resolves once, rejects special-use IP addresses, pins the approved connection address, preserves hostname/TLS verification and refuses redirects. Better Auth explicitly says a DNS check followed by ordinary fetch does not satisfy this contract.
Cloudflare's Node HTTP implementation does not support request `lookup` or `createConnection`; its Agent implementation is a stub. Cloudflare's documented TCP socket options do not expose a separate TLS server name when connecting to a pinned IP, and its documentation directs HTTPS requests on port 443 to fetch. The platform does document `node:tls.connect`, which may offer a transport route, but support for pinned-IP connections with the original TLS name was not exercised. Cloudflare's Node DNS `lookup` is unimplemented, and outbound TCP to Cloudflare IP ranges is blocked. These facts leave generic CIMD transport unverified on Workers. A live Worker probe is required before treating it as compatible; this does not establish that the entire MCP plugin is unusable.
The official plugin also supports administrator-managed OAuth clients and an explicit dynamic-registration fallback for older MCP clients. Managed clients require registration before a member connects that client; unauthenticated dynamic registration is a separate security decision and the current MCP profile deprecates it. Neither path was selected in this check. An upstream OAuth Provider issue also reports unsupported `redirect: "error"` behavior on Workers for particular JWKS and back-channel logout paths; impact on Wodge's chosen client flow remains untested.
[Official MCP integration](<https://better-auth.com/docs/plugins/mcp>)
[CIMD transport contract](<https://better-auth.com/docs/plugins/cimd>)
[Workers HTTP limitations](<https://developers.cloudflare.com/workers/runtime-apis/nodejs/http/>)
[Workers TCP socket API](<https://developers.cloudflare.com/workers/runtime-apis/tcp-sockets/>)
[Workers Node TLS API](<https://developers.cloudflare.com/workers/runtime-apis/nodejs/tls/>)
[Workers DNS support](<https://developers.cloudflare.com/workers/runtime-apis/nodejs/dns/>)
[OAuth client registration](<https://better-auth.com/docs/plugins/oauth-provider/>)
[Reported OAuth Provider issue](<https://github.com/better-auth/better-auth/issues/11328>)

### PartyServer and Yjs

Upstream y-partyserver exposes `isReadOnly`, `onLoad` and `onSave`. Defaults allow editing and do not persist the document; application overrides are necessary. Its source package declares Yjs `^13.6.14` and PartyServer `>=0.2.0 <1.0.0`, compatible as version ranges with the audited Yjs dependency and upstream PartyServer 0.5.10. This is source metadata, not a resolved installation result. The source peer range for Workers types must also be respected rather than blindly selecting every latest package.
Workers Free supports only SQLite-backed Durable Objects. Existing PartyKit lifecycle, room access, authorization and snapshot integration must be adapted and tested.
[Yjs server source](<https://github.com/cloudflare/partykit/blob/main/packages/y-partyserver/src/server/index.ts>)
[Yjs package metadata](<https://github.com/cloudflare/partykit/blob/main/packages/y-partyserver/package.json>)
[Durable Objects plan support](<https://developers.cloudflare.com/durable-objects/platform/pricing/>)

### React 19, Tailwind 4 and editor migration

shadcn documents React 19 and Tailwind 4 support. Existing Wodge components use Radix and Tailwind 3, so Base UI conversion still requires component work. The existing editor uses Tiptap 2. A move to Tiptap 3 includes renamed collaboration cursor/caret APIs, moved menu exports and Floating UI changes; changing former Pro package names alone is insufficient.
[shadcn compatibility](<https://ui.shadcn.com/docs/tailwind-v4>)
[Tiptap migration guide](<https://tiptap.dev/docs/guides/upgrade-tiptap-v2>)

### TypeScript 7

The native compiler is released. TypeScript 7.0 has no programmatic compiler API; tools importing that API require separate compatibility handling. This check did not resolve the entire dependency graph or demonstrate that Wodge's build/code-generation tools work with it.
[Official release and API limitation](<https://devblogs.microsoft.com/typescript/announcing-typescript-7-0/>)

### Cloudflare Calls / Realtime SFU

The SFU supports a separate Workers signaling backend. Wodge currently generates LiveKit-specific room tokens. Those tokens and the LiveKit client/components do not implement the SFU session and track API. Application signaling, participant state and controls require migration.
[SFU architecture](<https://developers.cloudflare.com/realtime/sfu/>)
[Existing call integration](<https://github.com/AMR-21/Wodge/blob/d875c2d369f2bed15ba4e7257242131fddcbfa0a/apps/backend/src/room/generate-call-token.ts>)

## Execution results

No package installation, build, type check, Worker probe, automated test or browser journey ran. Shell attempts for repository inspection and executable commands failed at process creation with “No such file or directory”; successful pwd responses did not establish a usable execution environment. Repository inspection continued through the connected GitHub tool.

## Outstanding proof

* Resolve the dependency graph and compile minimal web/backend Workers.
* Exercise Better Auth sessions and MCP authorization, including a compliant discovery transport.
* Verify Yjs persistence, viewer denial and reconnect on SQLite Durable Objects.
* Exercise two-browser SFU calls and retained editor behavior.
* Measure CPU and usage against the approved free-plan and monthly budget constraints.
  No runtime compatibility, cost or delivery-time pass is recorded.

## Source and revision

- Migrated from [Stack Compatibility Investigation](https://linear.app/amr21/document/stack-compatibility-investigation-3293d9bfaa9e), document ID `c2c8c2b0-6b0e-42d2-bb40-2a7c23e7958b`.
- Source revision: 2026-10-06T23:33:02.614Z; source author: Amr Yasser; last editor: Amr Yasser.
- Repository migration revision: `migration-draft-1`, 2026-10-09. The user confirmed preparation and placement in this chat. Approval of this rewritten repository revision and remote canonical-link cutover is pending.
- Existing decision/approval statements are source evidence, not new approvals or proof of implementation.
