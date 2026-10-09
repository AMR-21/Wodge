# Non-Functional Requirements

## Local-first behavior

Previously available structured state and page content remain usable through connection loss. Valid local changes reconcile after reconnecting. Unsent or rejected changes remain visible rather than being silently discarded.
Replicache remains fundamental for structured state, while Yjs provides collaborative text.

## Authorization consistency

Direct backend requests, synchronization mutations, collaborative text, attachments, calls, and MCP actions follow the approved access model. Role and membership changes affect subsequent actions. Active call participation ends on access loss.

## Data preservation

Member departure retains shared authored content. Removing a task view retains its collection. Downgrade retains existing members, content, and pending edits; reads/downloads and cleanup remain possible at a storage cap.

## Accessibility and feedback

Interactive controls have accessible names and keyboard paths. State is represented in text as well as styling. Task movement supports keyboard alternatives. Synchronization, call, upload, and permission failures are understandable.

## Cost and capacity

The showcase uses Workers Free. Operating spend should remain near $5/month and must not exceed $10/month. Product plan limits cannot increase provider account-wide limits. Shared rate/abuse controls protect requests and synchronization without a user-facing monthly request quota.

## Subscription integrity

Plan changes follow authenticated, idempotently applied Stripe test events and verified subscription state. A browser redirect or client claim alone cannot activate premium limits.

## Sources

[Product Definition](../product/overview.md)
[Pages & Embedded Tasks](../features/pages-embedded-tasks/spec.md)
[Team Roles & Access](../features/team-roles-access/spec.md)
[Agent Access](../features/agent-access/spec.md)
[Room Calls](../features/room-calls/spec.md)
[Demo Billing & Limits](../features/demo-billing-limits/spec.md)
[Financial Assessment](../product/feasibility.md)

## Source and revision

- Migrated from [Non-Functional Requirements](https://linear.app/amr21/document/non-functional-requirements-0745a13b2a64), document ID `a0c91ce6-a044-440a-9d2f-8bbf4408fc64`.
- Source revision: 2026-10-06T23:58:03.324Z; source author: Amr Yasser; last editor: Amr Yasser.
- Repository migration revision: `migration-draft-1`, 2026-10-09. The user confirmed preparation and placement in this chat. Approval of this rewritten repository revision and remote canonical-link cutover is pending.
- Existing decision/approval statements are source evidence, not new approvals or proof of implementation.
