# Wodge documentation

Wodge is a local-first collaborative workspace and portfolio revival. This documentation preserves existing product and engineering knowledge; it does not restart the SDLC or claim the revival has been delivered.

## Status and authority

| State | Meaning in this repository |
| --- | --- |
| Capstone / implemented baseline | Source commit `d875c2d369f2bed15ba4e7257242131fddcbfa0a` still uses Next.js 14, React 18, Supabase, PartyKit, LiveKit, group/moderator access and existing Stripe integrations. The root README/walkthrough describe the capstone. Source presence is not a current live-deployment or test pass. |
| Approved revival intent, not demonstrated complete | TanStack Start, React 19, Tailwind 4, Base UI, separate Hono backend, Better Auth/D1, PartyServer/SQLite Durable Objects, retained Replicache/Yjs, Calls/SFU, member MCP agents, additive team roles, test billing and smaller limits. Source decisions/approval claims are preserved with provenance. |
| Approved migration revision | The file split/consolidation, repository navigation and canonical-link cutover in `migration-draft-1`. User approved the prepared content and proposed external edits on 2026-10-09; canonical-link cutover remains pending remote verification. |
| Unverified or unresolved | Current live/shipped state, runtime compatibility, executed validation/cost evidence, several historical/asset reads and GitBook synchronization. See [coverage and gaps](development/documentation.md). |

Use the [root README](../README.md) for the capstone introduction, walkthrough, team attribution and license. Use [local setup](development/setup.md) to distinguish checked-in commands from target tooling. Existing [WODGE execution work](https://linear.app/amr21/team/WDG/overview) retains detailed delivery state. Do not use historical canceled/archived plans to overwrite current requirements.

## Product

- [Product overview](product/overview.md)
- [Principles and non-goals](product/principles.md)
- [Glossary](product/glossary.md)
- [Financial history and feasibility](product/feasibility.md)

## Architecture

- [Architecture and request flows](architecture/overview.md)
- [Technology stack: baseline versus target](architecture/tech-stack.md)
- [Domain model, invariants and lifecycles](architecture/domain-model.md)
- [Persistence and data ownership](architecture/data-model.md)
- [Security](architecture/security.md)
- [Non-functional requirements](architecture/non-functional-requirements.md)
- [Partial compatibility investigation](architecture/compatibility-investigation.md)

## Design

- [UX principles](design/ux-principles.md)
- [Navigation and information architecture](design/navigation.md)
- [Design system](design/design-system.md)
- [Shared interaction patterns](design/shared-patterns.md)

## Features

Every feature has a specification and design. Acceptance IDs remain scoped to their feature. The old documents called their behavioral section a “feature plan”; those requirements now live in `spec.md`, not an execution plan.

| Feature | Requirements | Design | Delivery approach |
| --- | --- | --- | --- |
| Workspace Setup & Membership | [spec](features/workspace-membership/spec.md) | [design](features/workspace-membership/design.md) | Existing Linear issues + shared process |
| Teams & Shared Spaces | [spec](features/teams-shared-spaces/spec.md) | [design](features/teams-shared-spaces/design.md) | Existing Linear issues + shared process |
| Team Roles & Access | [spec](features/team-roles-access/spec.md) | [design](features/team-roles-access/design.md) | Existing Linear issues + shared process |
| Agent Access | [spec](features/agent-access/spec.md) | [design](features/agent-access/design.md) | [plan](features/agent-access/plan.md) |
| Discussions & Messaging | [spec](features/discussions-messaging/spec.md) | [design](features/discussions-messaging/design.md) | Existing Linear issues + shared process |
| Room Calls | [spec](features/room-calls/spec.md) | [design](features/room-calls/design.md) | [plan](features/room-calls/plan.md) |
| Pages & Embedded Tasks | [spec](features/pages-embedded-tasks/spec.md) | [design](features/pages-embedded-tasks/design.md) | [plan](features/pages-embedded-tasks/plan.md) |
| Demo Billing & Limits | [spec](features/demo-billing-limits/spec.md) | [design](features/demo-billing-limits/design.md) | Existing Linear issues + shared process |

No standalone prototype asset was found in the inspected sources. Written UX and the existing capstone walkthrough are retained; no empty prototype directories or invented screens were generated. Only the three substantial approaches above warrant separate plan documents. Fresh-deployment coordination is shared in the operations runbook; detailed implementation/deployment/maintenance stays in existing issues.

## Development and operations

- [Engineering policy](development/engineering-policy.md)
- [Code structure and deferred owner decisions](development/code-structure.md)
- [Local setup](development/setup.md)
- [Tooling](development/tooling.md)
- [Development and delivery workflow](development/workflow.md)
- [Testing strategy](development/testing-strategy.md)
- [Documentation ownership, engineering coverage and gaps](development/documentation.md)
- [Environments and runtime topology](operations/environments.md)
- [CI/CD and approval gates](operations/ci-cd.md)
- [Observability](operations/observability.md)
- [Release policy and open release decisions](operations/release-policy.md)
- [Shared revival deployment coordination](operations/runbooks/revival-deployment.md)
- [Maintenance and feedback](operations/maintenance.md)

## Decisions

- [Decision 001 — Separate backend for multiple clients](decisions/001-separate-backend.md)
- [Decision 002 — Structured and text collaboration](decisions/002-structured-text-collaboration.md)
- [Decision 003 — Member-provided agents](decisions/003-member-provided-agents.md)
- [Decision 004 — Direct Workers realtime runtime](decisions/004-direct-workers-runtime.md)
- [Decision 005 — Official MCP authorization](decisions/005-official-mcp-authorization.md)
- [Decision 006 — Verification and release control](decisions/006-verification-release-control.md)
- [Decision 007 — Remove standalone resource libraries](decisions/007-remove-resource-libraries.md)

## Preservation and review

The original Linear documents remain intact. Migrated substantive files retain source IDs/update timestamps and approval limits. Architecture and domain Mermaid diagrams remain editable text; the walkthrough and graduation-report reference remain linked. Detailed work packages are not copied into a parallel repository issue tracker.

The inspection covered 65 Wodge documents (46 current, 19 archived), 12 projects (nine current), and 174 issues (128 current Backlog, 16 current Canceled, 30 archived). The returned blocker graph had 553 edges with no missing issue references or cycles. These are inspection facts, not execution completion.

[Coverage and open questions](development/documentation.md) explains truncated historical reads, unverified external assets, incomplete provider/runtime evidence and absent GitBook connection. GitBook setup does not block these repository drafts. No source or Linear push/publication/write is authorized by this index.

## Original navigation provenance

The former [Start Here](https://linear.app/amr21/document/start-here-3e5b85a2456e), [Product](https://linear.app/amr21/document/product-1679c84a393c), [Domain](https://linear.app/amr21/document/domain-941b5e9ecde0), [Features](https://linear.app/amr21/document/features-3a7fe6a226d8), [Design](https://linear.app/amr21/document/design-4105d64cac5d), [Engineering](https://linear.app/amr21/document/engineering-cf734441ce57), and [Decisions](https://linear.app/amr21/document/decisions-8998f260618f) hubs are consolidated here. Their originals are not changed or deleted.
