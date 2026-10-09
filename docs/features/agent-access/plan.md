# Agent access — delivery approach

## Why this document exists

The protocol/authorization boundary and its cross-feature permissions justify a durable delivery approach.

## Scope and sequence

Use existing auth/role dependencies before connection and revocation work; expose only the accepted discovery, page/text/link/file/task/discussion operations after their underlying authorized product operations exist. Keep excluded administration, room chat/calls and autonomous background workflows unavailable.

The existing executable outcomes remain [WDG-54](https://linear.app/amr21/issue/WDG-54), [WDG-156](https://linear.app/amr21/issue/WDG-156), [WDG-157](https://linear.app/amr21/issue/WDG-157), [WDG-158](https://linear.app/amr21/issue/WDG-158), [WDG-159](https://linear.app/amr21/issue/WDG-159), [WDG-160](https://linear.app/amr21/issue/WDG-160), [WDG-161](https://linear.app/amr21/issue/WDG-161). Their detailed acceptance, engineering instructions, owners, sub-issues, dates and evidence stay in Linear. Existing IDs are the stable work identifiers; this migration adds none.

## Readiness and blockers

The compatibility investigation leaves generic CIMD transport on Workers unverified. No fallback registration/security model is selected here. The executable OAuth increment cannot be declared ready until compliant transport/client-registration behavior is resolved and exercised.

## Required evidence

OAuth connection/revocation and workspace disable; HTTP/MCP authorization parity; member-via-agent attribution; rejected cross-resource requests; current permissions after role/membership loss; supported Worker transport evidence. Attach actual results to the existing executable issues. [Testing strategy](../../development/testing-strategy.md) remains confidence-first and risk-based. No tests or product runtime probes were executed by this migration.

## Deployment and maintenance applicability

The shared [fresh-deployment coordination](../../operations/runbooks/revival-deployment.md), [CI/CD](../../operations/ci-cd.md) and [maintenance guidance](../../operations/maintenance.md) cover the existing revival scope. No separate feature deployment file is created to duplicate them. Additional rollout/state-compatibility needs must be resolved before execution; no ongoing feature-maintenance commitment is introduced.

## Sources and approval

[Specification](spec.md), [design](design.md), [architecture](../../architecture/overview.md), [compatibility investigation](../../architecture/compatibility-investigation.md), and the unchanged [revival implementation plan](https://linear.app/amr21/document/implementation-plan-wodge-revival-adfe59e91282), source revision 2026-10-07T00:21:59.077Z. Historical owner-approval statements in that source are retained; this newly arranged approach is pending scoped review as `migration-draft-1`.
