---
description: "Testing strategy and evidence needed to validate the revival."
icon: flask
---

# Testing Strategy

## Validation scope

The approved feature acceptance criteria define what the revival must demonstrate. Validation covers both normal journeys and direct backend/agent attempts that bypass visible controls.

## Workspace and access

Validate creation defaults, invitation identity/verification/expiry/revocation, capacity, owner/admin authority, General protection, nested folders, additive roles, management/content distinctions, and departure cleanup.

## Pages and tasks

Validate core rich text, concurrent editing, locally available editing/reconnection, permissions, files/links, one collection across table/Kanban, task fields/filters/assignees, task-view removal/restoration, and deletion.

## Communication and calls

Validate supported messages and discussion item types, authorship actions, open/resolved questions, poll voting/closure, delegated management, call media controls, navigation/switching, connection failures, permission loss, participant caps, and monthly usage.

## Agents

Validate permitted content discovery/actions, current member permissions, attribution, member revocation, and workspace-wide disablement including owner-connected agents.

## Billing and limits

Validate Stripe test Checkout/portal outcomes, delayed/duplicate subscription events, verified plan state, joins at capacity, pooled storage growth/cleanup, downgrade preservation, offline edits at capacity, call usage/reset, and the operator creation pause.

## Accessibility

Validate keyboard paths and accessible state for forms, access controls, editor/task actions, polls, messages, confirmations, and call controls.

## Automated layers

Vitest is retained. Integration tests provide the main confidence at backend authorization, D1/binding, synchronization, and provider-event boundaries. Unit tests target permission combinations, mutation ordering, quota accounting, and state transitions where isolated checks add useful evidence.
Playwright covers critical browser journeys: sign-in/invitation return, workspace/team entry, collaborative page/task use, ordinary messaging, agent connection management, call navigation, and Stripe test-flow return state.
Browser automation does not replace real multi-user microphone, camera, screen-sharing, or permission-loss QA.

## Runtime and boundary validation

Worker integration tests exercise real runtime bindings where supported. Service simulators or mocks do not establish production provider behavior. External auth, Resend delivery, Stripe test events, and Calls need test-account validation of their critical contracts.
Replicache tests include duplicate/gapped mutation sequences, actor/client-group ownership, denied edits, persistence/acknowledgement consistency, and reconnect replay. Yjs tests include two editors, a viewer sending forged updates, restart recovery, and permission changes.
Premium-eligibility checks include flagged and unflagged users and client attempts to change the flag.

## Existing coverage

The repository has a Vitest workspace and data-package tests for initialization, teams, channels, chat, threads, and RBAC. The data package uses jsdom. This confirms existing test infrastructure, not passing tests or complete migration coverage.
[vitest.workspace.ts](<https://github.com/AMR-21/Wodge/blob/d875c2d369f2bed15ba4e7257242131fddcbfa0a/vitest.workspace.ts>)
[packages/data/vite.config.mjs](<https://github.com/AMR-21/Wodge/blob/d875c2d369f2bed15ba4e7257242131fddcbfa0a/packages/data/vite.config.mjs>)
[Existing workspace tests](<https://github.com/AMR-21/Wodge/tree/d875c2d369f2bed15ba4e7257242131fddcbfa0a/packages/data/__tests__/workspace>)

## QA and release smoke

Manual QA follows automated checks and code review. A deployed smoke pass demonstrates authenticated access, workspace entry, one content read/write/sync, page recovery, attachment access, a call, MCP access/revocation, and verified Stripe test-plan state.
No coverage percentage is used as a substitute for those acceptance outcomes.
[Workers testing guidance](<https://developers.cloudflare.com/workers/testing/>)

## Acceptance sources

[Workspace Setup & Membership](../features/workspace-membership/spec.md)
[Teams & Shared Spaces](../features/teams-shared-spaces/spec.md)
[Team Roles & Access](../features/team-roles-access/spec.md)
[Pages & Embedded Tasks](../features/pages-embedded-tasks/spec.md)
[Discussions & Messaging](../features/discussions-messaging/spec.md)
[Room Calls](../features/room-calls/spec.md)
[Agent Access](../features/agent-access/spec.md)
[Demo Billing & Limits](../features/demo-billing-limits/spec.md)

## Source and revision

- Migrated from [Testing Strategy](https://linear.app/amr21/document/testing-strategy-1e9168c62d19), document ID `f88f222e-9ec6-4faa-87ef-09a6bf0183e0`.
- Source revision: 2026-10-06T23:57:50.114Z; source author: Amr Yasser; last editor: Amr Yasser.
- Repository migration revision: `migration-draft-1`, 2026-10-09. The user confirmed preparation and placement in this chat. Approval of this rewritten repository revision and remote canonical-link cutover is pending.
- Existing decision/approval statements are source evidence, not new approvals or proof of implementation.
