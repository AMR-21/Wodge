---
description: "Workspace Setup & Membership: behavior, scope, acceptance criteria, and recorded approval evidence."
icon: list-check
---

# Spec

Status distinction: the source describes approved revival intent. Related capstone code exists, but compliance with these changed rules has not been demonstrated. This migration proposes document organization only.

### User context

A signed-in person can create a collaborative workspace or join one through an invitation. Workspace owners and administrators can bring people in and manage membership, while ownership remains protected.

### Goals and scope

This feature covers workspace creation and starter content, workspace discovery, reusable and email invitations, joining, member administration, leaving, and deletion. Workspace billing remains a demonstration, but its free and demo premium tiers determine membership capacity.

### Behavior

 1. A signed-in person can create a workspace with a name and URL slug; an avatar is optional. Creation makes them its owner and creates the default General team with a Welcome page, room, and discussion thread.
 2. The signed-in person can see workspaces they belong to. Joining a workspace adds the person to General and assigns its built-in Member role.
 3. Owners and administrators can enable, copy, reset, and disable a reusable invitation link. Resetting the link invalidates its former address. A valid link leads a new or existing signed-in user to a join confirmation.
 4. Owners and administrators can invite any email address, whether or not its recipient already has a Wodge account. The recipient can create an account and verify the invited address before accepting. Acceptance requires a signed-in account with that verified email address.
 5. An email invitation remains pending until accepted, revoked, or expired. It expires after seven days. Owners and administrators can view, resend, and revoke pending invitations. A revoked or expired invitation cannot be accepted.
 6. Free permits up to 10 accepted workspace members, and Demo Pro permits up to 50. The owner counts as a member; pending invitations do not. Invitation acceptance is blocked when the applicable capacity has been reached. A downgrade keeps existing members even if the Free count is exceeded, but blocks new joins until there is capacity.
 7. Owners and administrators can manage ordinary members, invitations, and workspace settings. Only the owner can grant or remove workspace administrator status. Administrators cannot alter or remove the owner or another administrator.
 8. A non-owner member, including an administrator, can leave. An owner or administrator can remove an ordinary member; only the owner can remove an administrator. Leaving or removal ends workspace access, removes team memberships and roles, and clears team-task assignments. Shared content authored by the departing person remains.
 9. An operator budget pause can temporarily block creation of new workspaces without affecting existing workspaces.
10. Only the owner can delete the workspace. Deletion ends all memberships and removes the workspace and its content after an explicit confirmation. The owner cannot leave or be removed while they own the workspace.

### Out of scope

Ownership transfer is not part of the showcase plan. This feature does not choose the email delivery service or change the approved team-role model. The possible future mobile client is outside this revival.

### Acceptance criteria

* **AC-01:** Creating a workspace makes its creator owner and creates General with a Welcome page, room, and discussion thread.
* **AC-02:** A joined member appears in the workspace list, belongs to General, and has General's Member role.
* **AC-03:** An enabled reusable link can be accepted; disabling or resetting it makes the former link unusable.
* **AC-04:** An email invitation can be sent to an address without an existing account; after signup and email verification, only an account with that address can accept it.
* **AC-05:** Owners and administrators can view, resend, and revoke pending email invitations; revoked and seven-day-expired invitations cannot be accepted.
* **AC-06:** The 10/50 tier limits count accepted members including the owner and exclude pending invitations. Acceptance is blocked at capacity; an over-capacity downgrade retains existing members and blocks additional joins.
* **AC-07:** Owners and administrators can manage ordinary members and invitations. Only the owner can grant or remove administrator status or remove an administrator.
* **AC-08:** A non-owner can leave, and an authorized manager can remove a member. Workspace and team access ends, team roles and task assignments clear, and authored shared content remains.
* **AC-09:** Only the owner can delete a workspace; the owner cannot leave or be removed while still owner.
* **AC-10:** Deleted workspaces and removed memberships no longer grant content access, including through a connected agent.
* **AC-11:** An operator creation pause prevents new workspaces while current workspaces and members remain available.

### Domain and UX relationship

A workspace has one owner, memberships, a default General team, reusable and email invitations, and a tier-based member capacity. Invitation state and acceptance depend on identity, verification, validity, and capacity. Workspace membership is distinct from team membership and team content roles. The related UX design covers creation, join confirmation, invitation management, member management, capacity feedback, and destructive confirmation.

### Relevant quality and security requirements

Invitation and membership checks apply at acceptance and to direct backend requests. Email invitations are bound to the verified recipient address. Member removal and workspace deletion take effect for subsequent content and agent access. The technical delivery, consistency, and failure-handling design belongs to later engineering artifacts.

### Dependencies and references

This plan follows the approved [Product Definition](../../product/overview.md), [Domain Model](../../architecture/domain-model.md), and [Team Roles and Access Feature Plan](../team-roles-access/spec.md).

### Validation expectations

Validation covers creation defaults, new-account and existing-account invitations, email verification, link reset and disable, expiration and revocation, capacity, owner/admin authority, departure cleanup, deletion, and access loss through both member and agent paths.

## Document responsibilities

[Design](design.md) contains the migrated UX and shared engineering boundaries. Acceptance identifiers such as `AC-01` remain scoped to this feature; they are not renumbered. Detailed implementation, validation, deployment and maintenance work remains in the [existing delivery project](https://linear.app/amr21/project/wodge-workspace-setup-and-membership-48598624b1f1).

## Historical approval evidence

- [Wodge — Workspace Setup and Membership UX](https://linear.app/amr21/document/wodge-workspace-setup-and-membership-ux-6fa0cee58ca5) states “Status: Approved” and redirects to a former Notion source. Its source update is 2026-09-27T00:18:25.744Z. This is a preserved approval claim; no independent signed revision or approving discussion was returned.
- [Wodge — Workspace Setup and Membership Feature Plan](https://linear.app/amr21/document/wodge-workspace-setup-and-membership-feature-plan-651caf169bb6) states “Status: Approved” and redirects to a former Notion source. Its source update is 2026-09-27T00:18:16.198Z. This is a preserved approval claim; no independent signed revision or approving discussion was returned.

## Source and revision

- Migrated from [Workspace Setup & Membership](https://linear.app/amr21/document/workspace-setup-and-membership-1ca2a589c481), document ID `0ba8f114-8731-4185-b177-7e9ee93c9574`.
- Source revision: 2026-10-06T23:59:07.506Z; source author: Amr Yasser; last editor: Amr Yasser.
- Repository migration revision: `migration-draft-1`, 2026-10-09. The user confirmed preparation and placement in this chat. Approval of this rewritten repository revision and remote canonical-link cutover is pending.
- Existing decision/approval statements are source evidence, not new approvals or proof of implementation.
