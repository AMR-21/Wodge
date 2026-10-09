---
description: "Room Calls: delivery sequencing, dependencies, and validation approach."
icon: route
---

# Room calls — delivery approach

## Why this document exists

Replacing provider signaling while retaining navigation, access-loss handling and quota behavior justifies a durable delivery approach.

## Scope and sequence

Replace LiveKit with the approved Calls/Realtime SFU signaling path using the separate backend and current role foundation; preserve one room call, explicit self-media controls and session lifecycle; retain compact controls during navigation and confirmed call switching; integrate existing billing/limits work rather than duplicating quota logic.

The existing executable outcomes remain [WDG-50](https://linear.app/axxi-labs/issue/WDG-50/replace-livekit-with-cloudflare-calls-signaling-and-admission), [WDG-51](https://linear.app/axxi-labs/issue/WDG-51/preserve-call-controls-navigation-and-switching-behavior). Their detailed acceptance, engineering instructions, owners, sub-issues, dates and evidence stay in Linear. Existing IDs are the stable work identifiers; this migration adds none.

## Readiness and blockers

An actual SFU call, provider configuration and runtime usage/cost evidence remain outstanding. Room access, deletion and membership loss must be enforced; approved provider choice is not proof of an implemented media boundary.

## Required evidence

Real multi-browser audio/video/screen sharing; media off at join; device/connection failures; persistent compact controls; confirmed switching; access-loss disconnection; participant caps, minute accounting, exhaustion and UTC reset. Attach actual results to the existing executable issues. [Testing strategy](../../development/testing-strategy.md) remains confidence-first and risk-based. No tests or product runtime probes were executed by this migration.

## Deployment and maintenance applicability

The shared [fresh-deployment coordination](../../operations/runbooks/revival-deployment.md), [CI/CD](../../operations/ci-cd.md) and [maintenance guidance](../../operations/maintenance.md) cover the existing revival scope. No separate feature deployment file is created to duplicate them. Additional rollout/state-compatibility needs must be resolved before execution; no ongoing feature-maintenance commitment is introduced.

## Sources and approval

[Specification](spec.md), [design](design.md), [architecture](../../architecture/overview.md), [compatibility investigation](../../architecture/compatibility-investigation.md), and the unchanged [revival implementation plan](https://linear.app/amr21/document/implementation-plan-wodge-revival-adfe59e91282), source revision 2026-10-07T00:21:59.077Z. Historical owner-approval statements in that source are retained; this newly arranged approach is pending scoped review as `migration-draft-1`.
