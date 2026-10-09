# Workspace Setup & Membership — design

> **Migration revision approved.** User approved `migration-draft-1` in this chat on 2026-10-09. Historical source knowledge is preserved; this file does not establish implementation, runtime validation, deployment, or release completion.

Companion to [specification](spec.md). The following UX is transposed from the same source revision without changing behavior.

### Experience

The workspace entry experience lets a signed-in person find their workspaces, create one, or accept an invitation. Creation immediately opens a usable General team with a Welcome page, room, and thread. The existing Wodge visual direction is the starting point; the experience may be simplified without requiring a full visual redesign.

### Key journeys and navigation

A workspace list shows the person's current memberships and an action to create a workspace. Creation asks for a name and URL slug, with an optional avatar, then enters the new workspace. The default General team and its Welcome spaces are visible in the workspace navigation. Joining through either invitation route lands the new member in General.
A reusable invitation link opens a join confirmation showing the workspace name. A signed-out recipient signs in or creates an account, then returns to the invitation. If the link is disabled or reset, the former link shows that it is no longer valid.
An email invitation is sent to an address that may belong to an existing user or a new user. The recipient can sign up from the invitation and verify that address before accepting. The acceptance view makes the invited workspace and address clear. A mismatch, revoked invitation, or expired invitation has a distinct explanation and no join action.

### Membership management

Owners and administrators can see members and pending email invitations in workspace settings. They can send email invitations and view, resend, or revoke pending ones. They can enable, copy, reset, or disable the reusable invitation link. The interface makes a link reset's effect clear before it happens.
The member list distinguishes owner, administrator, and ordinary member. Only the owner sees controls to grant or remove administrator status or remove an administrator. Administrators can manage ordinary members and invitations. The owner has no leave or removal control. A non-owner can leave with an explicit confirmation.
The membership-capacity display uses the current tier's 10- or 50-member limit and counts accepted members, including the owner. Pending invitations are shown separately. When capacity blocks acceptance, the recipient sees a clear full-workspace message; managers can see the current member count. After a downgrade, an over-capacity workspace explains that current members remain and new joins wait for capacity. An operator pause explains that new workspace creation is temporarily unavailable while existing workspaces remain open.

### Deletion

Only the owner has a workspace-deletion control. The confirmation identifies the workspace and makes the removal of its content and memberships clear before the action is completed.

### Shared UI patterns and accessibility

Invitation status, expiry, member role, capacity, and destructive outcomes are conveyed in text as well as visual styling. Forms, invitation actions, member controls, and confirmations are keyboard operable, labelled for assistive technology, and provide clear success and error feedback. The join flow returns a recipient to the invitation after sign-in or signup.

### References

The behavior is defined in the companion specification, with context in the [Product Definition](../../product/overview.md) and [Domain Model](../../architecture/domain-model.md).

## Engineering boundaries

Use the [shared architecture](../../architecture/overview.md), [domain model](../../architecture/domain-model.md), [security rules](../../architecture/security.md), [quality requirements](../../architecture/non-functional-requirements.md), [stack](../../architecture/tech-stack.md), and [testing strategy](../../development/testing-strategy.md). These are migrated shared decisions, not newly invented feature contracts. HTTP, synchronization and MCP paths must preserve the same authoritative product rules where applicable.

Detailed schemas, endpoint contracts and implementation patterns not settled by those sources remain implementation decisions. The owner authors repository agent instructions; this migration does not generate `AGENTS.md`.

## Prototypes and evidence

The inspected Linear documents contain written UX, not a standalone executable prototype. No prototype asset has been invented or an empty prototypes directory created. Existing capstone screens/code are implementation evidence and may differ from the revival specification. The repository walkthrough remains linked from the root README.

## Delivery and operation

Detailed work and evidence remain in the existing Linear project. Shared [CI/CD](../../operations/ci-cd.md), [deployment coordination](../../operations/runbooks/revival-deployment.md), [release policy](../../operations/release-policy.md), and [maintenance guidance](../../operations/maintenance.md) apply. Any additional feature rollout or migration requirement needs explicit coordination; lack of a feature deployment file does not assert operational readiness.

## Source and revision

- Migrated from [Workspace Setup & Membership](https://linear.app/amr21/document/workspace-setup-and-membership-1ca2a589c481), document ID `0ba8f114-8731-4185-b177-7e9ee93c9574`.
- Source revision: 2026-10-06T23:59:07.506Z; source author: Amr Yasser; last editor: Amr Yasser.
- Repository migration revision: `migration-draft-1`, 2026-10-09. The user confirmed preparation and placement in this chat. Approval of this rewritten repository revision and remote canonical-link cutover is pending.
- Existing decision/approval statements are source evidence, not new approvals or proof of implementation.
