# Pages and embedded tasks — delivery approach

## Why this document exists

Coordinating independent Yjs text, Replicache tasks, retained editor controls and attachment access justifies a durable delivery approach.

## Scope and sequence

Preserve the approved editor and page access foundation; configure Yjs load/save and viewer restrictions; preserve one page-owned task collection across table/Kanban and task-block removal; integrate links/files through containing-page authorization and pooled storage. Use current issue blockers for actual execution order.

The existing executable outcomes remain [WDG-45](https://linear.app/amr21/issue/WDG-45), [WDG-46](https://linear.app/amr21/issue/WDG-46), [WDG-127](https://linear.app/amr21/issue/WDG-127), [WDG-128](https://linear.app/amr21/issue/WDG-128), [WDG-129](https://linear.app/amr21/issue/WDG-129). Their detailed acceptance, engineering instructions, owners, sub-issues, dates and evidence stay in Linear. Existing IDs are the stable work identifiers; this migration adds none.

## Readiness and blockers

PartyServer/Yjs persistence and permission hooks require runtime proof. Exact persistence contracts and byte-accounting implementation remain unresolved where not settled by shared sources. Do not infer readiness from the existence of editor components.

## Required evidence

Two-client editing, offline/reconnect and restart recovery; viewer and access-loss denial; task/column CRUD, ordering, team assignees, filters and view switching; task-block preservation versus page deletion; authorized links/files and storage cleanup. Attach actual results to the existing executable issues. [Testing strategy](../../development/testing-strategy.md) remains confidence-first and risk-based. No tests or product runtime probes were executed by this migration.

## Deployment and maintenance applicability

The shared [fresh-deployment coordination](../../operations/runbooks/revival-deployment.md), [CI/CD](../../operations/ci-cd.md) and [maintenance guidance](../../operations/maintenance.md) cover the existing revival scope. No separate feature deployment file is created to duplicate them. Additional rollout/state-compatibility needs must be resolved before execution; no ongoing feature-maintenance commitment is introduced.

## Sources and approval

[Specification](spec.md), [design](design.md), [architecture](../../architecture/overview.md), [compatibility investigation](../../architecture/compatibility-investigation.md), and the unchanged [revival implementation plan](https://linear.app/amr21/document/implementation-plan-wodge-revival-adfe59e91282), source revision 2026-10-07T00:21:59.077Z. Historical owner-approval statements in that source are retained; this newly arranged approach is pending scoped review as `migration-draft-1`.
