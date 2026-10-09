# Decision 001 — Separate backend for multiple clients

> **Migration revision approved.** User approved `migration-draft-1` in this chat on 2026-10-09. Historical source knowledge is preserved; this file does not establish implementation, runtime validation, deployment, or release completion.

**Decision:** Keep the backend as a separate service exposing shared APIs.
**Reason:** The web application uses TanStack Start, while a possible future mobile client should be able to use the same backend.
**Scope:** A mobile application is not committed for the revival.
[Architecture](../architecture/overview.md)

## Source and revision

- Migrated from [Decision 001 — Separate backend for multiple clients](https://linear.app/amr21/document/decision-001-separate-backend-for-multiple-clients-7766dad6c46c), document ID `bf95f351-eca0-4b4a-bf90-afe5de9c95cf`.
- Source revision: 2026-10-06T23:57:05.824Z; source author: Amr Yasser; last editor: Amr Yasser.
- Repository migration revision: `migration-draft-1`, 2026-10-09. The user confirmed preparation and placement in this chat. Approval of this rewritten repository revision and remote canonical-link cutover is pending.
- Existing decision/approval statements are source evidence, not new approvals or proof of implementation.
