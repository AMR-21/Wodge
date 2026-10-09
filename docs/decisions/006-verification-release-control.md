# Decision 006 — Verification and release control

> **Migration revision approved.** User approved `migration-draft-1` in this chat on 2026-10-09. Historical source knowledge is preserved; this file does not establish implementation, runtime validation, deployment, or release completion.

**Decision:** Retain Vitest, add Playwright for critical browser journeys, and use GitHub Actions for lint, formatting, types, tests, and builds before manually approved Cloudflare deployment.
**Boundary:** A passing workflow does not override the required explicit remote-push confirmation.
[Development Workflow](../development/workflow.md)
[Testing Strategy](../development/testing-strategy.md)

## Source and revision

- Migrated from [Decision 006 — Verification and release control](https://linear.app/amr21/document/decision-006-verification-and-release-control-1c158d1b3bb6), document ID `bc7dbd91-f225-4631-86a7-11e5665c86a7`.
- Source revision: 2026-10-06T23:55:21.936Z; source author: Amr Yasser; last editor: Amr Yasser.
- Repository migration revision: `migration-draft-1`, 2026-10-09. The user confirmed preparation and placement in this chat. Approval of this rewritten repository revision and remote canonical-link cutover is pending.
- Existing decision/approval statements are source evidence, not new approvals or proof of implementation.
