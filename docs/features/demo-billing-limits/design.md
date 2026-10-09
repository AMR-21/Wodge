# Demo Billing & Limits — design

> **Migration revision approved.** User approved `migration-draft-1` in this chat on 2026-10-09. Historical source knowledge is preserved; this file does not establish implementation, runtime validation, deployment, or release completion.

Companion to [specification](spec.md). The following UX is transposed from the same source revision without changing behavior.

### Plans and limits

Workspace settings expose a clear Free versus Demo Pro comparison, labeled **test billing**. The Demo Pro price is shown as $29/month for demonstration; the interface does not imply a real charge. Owners and administrators see Checkout and customer-portal actions. A member can view limits without seeing management actions.

### Usage feedback

The limits page combines members, pooled storage, and call use in one place, with values and next reset stated in text. Member capacity and storage are shown at the workspace level. A join, upload, or sync change rejected by a limit explains the relevant usage and available route to free capacity or change plan.

### Calls and downgrade

A call shows remaining participant-minutes, warns near exhaustion, and announces the reason when the monthly cap ends it. A downgraded workspace still shows its existing people and content, with a clear over-limit message beside blocked growth actions. Pending offline edits are visible rather than silently removed.

### Changes from the capstone

The capstone demonstrated $50/month premium billing with 10/50 member limits and much larger storage assumptions. The revival keeps a real Stripe test flow, uses an illustrative $29/month Demo Pro display price, introduces smaller pooled storage and call limits, and makes downgrade behavior data-preserving. The Financial Assessment separates the historical $50 calculation from current costs.

## Engineering boundaries

Use the [shared architecture](../../architecture/overview.md), [domain model](../../architecture/domain-model.md), [security rules](../../architecture/security.md), [quality requirements](../../architecture/non-functional-requirements.md), [stack](../../architecture/tech-stack.md), and [testing strategy](../../development/testing-strategy.md). These are migrated shared decisions, not newly invented feature contracts. HTTP, synchronization and MCP paths must preserve the same authoritative product rules where applicable.

Detailed schemas, endpoint contracts and implementation patterns not settled by those sources remain implementation decisions. The owner authors repository agent instructions; this migration does not generate `AGENTS.md`.

## Prototypes and evidence

The inspected Linear documents contain written UX, not a standalone executable prototype. No prototype asset has been invented or an empty prototypes directory created. Existing capstone screens/code are implementation evidence and may differ from the revival specification. The repository walkthrough remains linked from the root README.

## Delivery and operation

Detailed work and evidence remain in the existing Linear project. Shared [CI/CD](../../operations/ci-cd.md), [deployment coordination](../../operations/runbooks/revival-deployment.md), [release policy](../../operations/release-policy.md), and [maintenance guidance](../../operations/maintenance.md) apply. Any additional feature rollout or migration requirement needs explicit coordination; lack of a feature deployment file does not assert operational readiness.

## Source and revision

- Migrated from [Demo Billing & Limits](https://linear.app/amr21/document/demo-billing-and-limits-bbbc6509bf8d), document ID `5548495d-7ff7-43f0-ba11-f3ef1ea2deb1`.
- Source revision: 2026-10-06T23:58:32.666Z; source author: Amr Yasser; last editor: Amr Yasser.
- Repository migration revision: `migration-draft-1`, 2026-10-09. The user confirmed preparation and placement in this chat. Approval of this rewritten repository revision and remote canonical-link cutover is pending.
- Existing decision/approval statements are source evidence, not new approvals or proof of implementation.
