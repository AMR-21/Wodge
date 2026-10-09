# Tech Stack

The comparison records the approved revival targets. It does not upgrade dependencies or establish that any selected version is installed or currently compatible. Exact version and runtime proof remains in the [compatibility investigation](compatibility-investigation.md).

## Revival stack

The existing Wodge codebase is being revived with the following confirmed technology changes. These are migration targets; they do not describe completed code changes.

| Area | Existing implementation | Revival target |
| -- | -- | -- |
| Web framework | Next.js 14 | TanStack Start |
| UI runtime | React 18 | React 19 |
| Styling | Tailwind CSS 3 | Tailwind CSS 4 |
| Language | TypeScript 5 | TypeScript 7 |
| Components | shadcn/ui with Radix primitives | shadcn/ui with Base UI |
| Editor | Tiptap 2 with former Pro extension packages | Tiptap with the open-source former Pro extensions |
| Realtime server | PartyKit and existing server boilerplate | PartyServer directly on Cloudflare Workers, using the required Yjs server addons |
| Authentication | Supabase Auth | Better Auth using the existing D1 database |
| Calls | LiveKit | Cloudflare Calls / Realtime |
| Agent access | Existing built-in AI integrations | MCP access for members’ own agents |
| Package manager | pnpm 9 | Latest pnpm |
| Monorepo | Turborepo 2 | Latest Turborepo |
| Linting | ESLint | Oxlint |
| Formatting | Prettier | Oxfmt |

## Retained services

Hono remains the backend API framework. D1 with Drizzle remains the database layer, R2 stores files, Resend delivers email, and Stripe remains in test mode. Secrets move from Infisical to Cloudflare.

## Backend separation

The backend remains a separate service with APIs usable by the TanStack Start web app and a possible future mobile app. Shared product operations belong to that backend rather than web-specific server functions. A mobile app is a future possibility, not part of the confirmed revival delivery scope.
[Architecture](overview.md)

## Synchronization and collaboration

Replicache remains fundamental to the product. Collaborative page editing continues to use Yjs. PartyServer replaces the PartyKit server setup and unnecessary boilerplate, with the server addons needed for Yjs.

## Member-connected agents

Members connect their own MCP-compatible agents. Wodge hosts no AI model. Agent actions follow the member’s current permissions and carry member and agent attribution. Members can revoke connections; workspace owners and admins can disable agent access.
The initial MCP scope covers permitted workspace and team discovery, pages, tasks, and discussions. Room chat, calls, administration, and autonomous background workflows remain outside that scope.
[Agent Access](../features/agent-access/spec.md)
[Agent Access delivery project](<https://linear.app/amr21/project/wodge-agent-access-a097a3305099>)

## Approved verification and MCP additions

* Better Auth's official MCP/OAuth plugin provides authorization for member-connected agents.
* Vitest remains the automated test runner.
* Playwright covers critical browser journeys.
* GitHub Actions checks linting, formatting, types, tests, and builds before manually approved Cloudflare deployment.

## Integration fit

Better Auth mounts directly in Hono and has a Drizzle SQLite adapter suitable for the retained D1 layer. Its Workers integration requires the documented runtime compatibility and explicit credentialed origins.
The PartyServer Yjs integration supplies persistence and read-only hooks; Wodge's permission and recovery behavior still needs configuration and validation.
[Better Auth with Hono](<https://better-auth.com/docs/integrations/hono>)
[Better Auth Drizzle adapter](<https://better-auth.com/docs/adapters/drizzle>)
[Better Auth MCP plugin](<https://better-auth.com/docs/plugins/mcp>)

## Technology references

* [TanStack Start on Cloudflare Workers](<https://developers.cloudflare.com/workers/framework-guides/web-apps/tanstack-start/>)
* [TypeScript 7 release](<https://devblogs.microsoft.com/typescript/announcing-typescript-7-0/>)
* [shadcn/ui Base UI](<https://ui.shadcn.com/docs/changelog/2026-07-base-ui-default>)
* [Tailwind 4 and React 19 support](<https://ui.shadcn.com/docs/tailwind-v4>)
* [Tiptap open-source former Pro extensions](<https://tiptap.dev/blog/release-notes/were-open-sourcing-more-of-tiptap>)
* [PartyServer](<https://github.com/cloudflare/partykit/blob/main/packages/partyserver/README.md>)
* [Yjs server addon](<https://github.com/cloudflare/partykit/blob/main/packages/y-partyserver/README.md>)

## Source and revision

- Migrated from [Tech Stack](https://linear.app/amr21/document/tech-stack-466932dbe885), document ID `0829c310-e057-43e8-b937-14e05cce2d20`.
- Source revision: 2026-10-06T23:57:58.359Z; source author: Amr Yasser; last editor: Amr Yasser.
- Repository migration revision: `migration-draft-1`, 2026-10-09. The user confirmed preparation and placement in this chat. Approval of this rewritten repository revision and remote canonical-link cutover is pending.
- Existing decision/approval statements are source evidence, not new approvals or proof of implementation.
