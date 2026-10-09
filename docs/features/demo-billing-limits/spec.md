# Demo Billing & Limits — specification

> **Migration revision approved.** User approved `migration-draft-1` in this chat on 2026-10-09. Historical source knowledge is preserved; this file does not establish implementation, runtime validation, deployment, or release completion.

Status distinction: the source describes approved revival intent. Related capstone code exists, but compliance with these changed rules has not been demonstrated. This migration proposes document organization only.

### User context

As a workspace owner or administrator, I can demonstrate a plan change through Stripe test billing and see how my workspace's member, storage, and call limits behave. Members can understand current limits and remaining usage.

### Goals and scope

Wodge offers Free and Demo Pro plans for its portfolio showcase. Stripe Checkout and the customer portal operate in test mode; a displayed price is part of a demonstration, and no money moves. The plan controls accepted-member capacity, one pooled storage allowance, concurrent call participants, and monthly participant-minutes.

### Premium eligibility

Only manually selected users may use premium plan features. Selection is recorded as a user flag in the database. Stripe remains a test-only demonstration.

### Plan limits

| Limit | Free | Demo Pro |
| -- | -- | -- |
| Accepted workspace members, including owner | 10 | 50 |
| Pooled user-generated stored data and files | 50 MB | 500 MB |
| Participants in one call | 4 | 12 |
| Call participant-minutes per UTC calendar month | 60 | 300 |

Demo Pro displays an illustrative **$29/month test price**. The Financial Assessment traces it to an earlier Workers Paid calculation, explains why that calculation no longer applies, and records the decision to keep $29 solely for demonstration. It does not represent validated live economics.

### Behavior

1. New workspaces begin on Free. The workspace owner and administrators can open billing settings, start a Demo Pro test subscription through Stripe Checkout, and open the Stripe customer portal for test subscription management. Other members can view the plan and usage but cannot change billing.
2. The effective plan follows verified subscription state, rather than a browser return or an unverified client claim. On cancellation or failed renewal, Demo Pro access lasts only while its test subscription remains effective; thereafter Free limits apply.
3. Accepted members count toward capacity, including the owner. Pending invitations do not count. A downgrade that leaves more than 10 accepted members retains every existing member and their access, but blocks new joins until the count falls below the Free cap or Demo Pro resumes.
4. Each workspace has **one pooled storage allowance** across persisted user-created structured content and uploaded files. It covers page attachments, room media and file messages, and other user-created stored content. Files and data do not receive separate quotas. Operational indexes, transient processing data, and bounded synchronization history are excluded from the user-facing allowance, though they remain operator costs.
5. On reaching or exceeding storage capacity, existing content stays readable and downloadable. Cleanup and deletions remain possible. New changes that increase net stored bytes are blocked until space is freed or the plan changes; edits that do not increase usage remain possible. A plan downgrade never silently discards files, structured data, or pending offline edits. Pending edits remain visible locally and receive a clear resolution path if synchronization would grow storage beyond the effective allowance.
6. A room call accepts at most the plan's participant count. Each connected participant consumes one participant-minute per elapsed minute; for example, four participants for fifteen minutes consume 60 participant-minutes. Usage is scoped to the workspace and resets at the start of each UTC calendar month. The call experience warns participants as the monthly allowance approaches exhaustion, then ends the active call when it is exhausted. New joins wait until the next reset or a plan change.
7. A limits page shows the effective plan, accepted members, pooled storage usage, call usage and remaining participant-minutes, and the next UTC reset. It explains restrictions when a workspace exceeds a limit after downgrade.
8. The operator can pause creation of new workspaces when an operational budget threshold is reached. Existing workspaces remain accessible. This is an operational safeguard, not a plan change.
9. Backend request and synchronization traffic are protected through shared rate and abuse controls instead of a user-facing monthly request quota. Those controls preserve normal local-first use while limiting abusive or runaway load.

### Out of scope

The showcase does not collect live payments, promise a sustainable commercial price, introduce separate per-feature storage quotas, or meter members by request count. A public paid launch requires a fresh financial and operational review.

### Acceptance criteria

* **AC-01:** New workspaces use Free; a successful verified Stripe test subscription activates Demo Pro; canceling or losing an effective subscription returns the workspace to Free when the test subscription ends.
* **AC-02:** Only the owner or an administrator can initiate or manage test billing; every member can view plan limits and usage.
* **AC-03:** Accepted-member limits are 10 and 50, count the owner, and exclude pending invitations; capacity is checked when a person joins.
* **AC-04:** Downgrading an over-capacity workspace retains existing members and their access while blocking additional joins.
* **AC-05:** The 50 MB/500 MB storage limit is one workspace pool across structured user content and page and room attachments.
* **AC-06:** At or above the storage cap, reads, downloads, cleanup, and non-growing edits remain available; growth is blocked, and offline edits are not silently lost.
* **AC-07:** Calls cap concurrent participants at 4/12 and use 60/300 workspace participant-minutes per UTC calendar month; usage increases with connected participants and resets monthly.
* **AC-08:** The call warns near the monthly cap, ends at exhaustion, and explains why another call cannot start before reset or upgrade.
* **AC-09:** A limits page shows the current plan, consumption, remaining allowance, and next reset.
* **AC-10:** An operator pause stops new workspace creation without interrupting existing workspaces.
* **AC-11:** Normal Replicache synchronization is not subject to a user-facing monthly request quota; shared abuse protection still applies.

### Domain relationship

A workspace has one effective plan, accepted-member count, pooled stored-byte usage, and a monthly call-usage period. A test subscription may establish Demo Pro while effective. Downgrade can create an over-limit workspace without revoking members or deleting data. The operator creation pause governs new workspace admission outside individual plan state.

### Relevant quality and security requirements

The showcase runs on Workers Free. Demo Pro changes Wodge's product limits but cannot raise Cloudflare's account-wide free limits; reaching a provider limit may interrupt service. Plan and usage decisions are enforced by the backend, including uploads, sync writes, joins, and call admission. Stripe events are authenticated and applied idempotently. A browser redirect alone cannot grant Demo Pro. Usage reporting is understandable and sufficiently current to explain denied actions. Abuse controls and bounded operational history protect cost without breaking ordinary offline-first workflows.

### Dependencies and references

[Product Definition](../../product/overview.md), [Domain Model](../../architecture/domain-model.md), [Workspace Setup & Membership](../workspace-membership/spec.md), [Room Calls](../room-calls/spec.md), and [Decision 007 — Remove standalone resource libraries](../../decisions/007-remove-resource-libraries.md) define the surrounding product and feature behavior. [Financial Assessment](../../product/feasibility.md) traces the illustrative $29 test price to its superseded Workers Paid calculation and assesses Workers Free limits. [Wodge Demo Billing and Limits in Linear](<https://linear.app/amr21/project/wodge-demo-billing-and-limits-155a0717deca>) tracks delivery.

### Validation expectations

Validation covers Checkout success and failure, portal cancellation, delayed or duplicate subscription events, unauthorized billing changes, new and downgraded limits, exact-cap and over-cap joins, pooled storage growth and cleanup, offline changes at the storage cap, participant admission and minutes, UTC reset, and an operator creation pause.

## Document responsibilities

[Design](design.md) contains the migrated UX and shared engineering boundaries. Acceptance identifiers such as `AC-01` remain scoped to this feature; they are not renumbered. Detailed implementation, validation, deployment and maintenance work remains in the [existing delivery project](https://linear.app/amr21/project/wodge-demo-billing-and-limits-155a0717deca).

## Source and revision

- Migrated from [Demo Billing & Limits](https://linear.app/amr21/document/demo-billing-and-limits-bbbc6509bf8d), document ID `5548495d-7ff7-43f0-ba11-f3ef1ea2deb1`.
- Source revision: 2026-10-06T23:58:32.666Z; source author: Amr Yasser; last editor: Amr Yasser.
- Repository migration revision: `migration-draft-1`, 2026-10-09. The user confirmed preparation and placement in this chat. Approval of this rewritten repository revision and remote canonical-link cutover is pending.
- Existing decision/approval statements are source evidence, not new approvals or proof of implementation.
