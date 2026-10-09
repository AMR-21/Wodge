---
description: "Teams & Shared Spaces: behavior, scope, acceptance criteria, and recorded approval evidence."
icon: list-check
---

# Spec

Status distinction: the source describes approved revival intent. Related capstone code exists, but compliance with these changed rules has not been demonstrated. This migration proposes document organization only.

### User context

Workspace members organize collaboration within teams. A team's pages, rooms, and discussion threads have clear access rules, while team and space management can be delegated through explicit permissions.

### Goals and scope

The feature covers team creation and deletion, team details and membership, the permanent General team, team page folders, and the creation and management of pages, rooms, and discussion threads. It defines Manage team and Manage spaces as distinct grantable team permissions.

### Behavior

1. General is the permanent default team. Every workspace member belongs to General while they belong to the workspace. General cannot be deleted, and a workspace member cannot be removed from it independently of workspace membership.
2. The workspace owner and administrators can create and delete non-General teams. A new team starts with its creator as a member and an empty page-folder root. Deleting a non-General team removes its contained spaces and content after confirmation.
3. The owner and administrators can change any team's name, avatar, and membership. A team member whose role grants Manage team can do the same for that team. Manage team does not itself grant content access or team-deletion authority.
4. A person added to a team receives its built-in Member role. A person removed from a team loses that team's role assignments and access; their assignments to that team's tasks clear while the tasks remain.
5. Team pages are organized in page folders, which may be nested. Rooms and discussion threads belong directly to a team. A team member whose role grants Manage spaces can create, rename, organize, and delete its page folders, pages, rooms, and threads, and change their role-based view/edit selections. These management actions require team membership for everyone except the workspace owner.
6. Workspace administration alone grants no team-content access or Manage spaces authority. A non-owner administrator must belong to a team and hold a granting role to manage its spaces or edit their content. The owner bypasses team and role restrictions.
7. Editing a page, room, or thread's content follows its selected view/edit roles. The Manage team and Manage spaces permissions do not themselves grant content viewing or editing. New pages, rooms, and threads select Member for both view and edit access by default; edit access includes view access.
8. A person sees teams and spaces they can access in content navigation. Authorized managers can reach the relevant team and space management controls. Deleting a space requires a confirmation that identifies what will be removed.

### Out of scope

This plan does not specify the content workflows inside pages, rooms, or threads; calls, tasks, and discussions have their own feature plans. Files remain attached to pages or room messages, and pages can organize links. Workspace-wide groups and the built-in Moderator role are absent. The permission catalog remains extensible beyond the grants defined here and in the Team Roles and Access plan.

### Acceptance criteria

* **AC-01:** Every workspace member belongs to General; General cannot be deleted or have a member removed while that person remains in the workspace.
* **AC-02:** Owners and administrators can create a non-General team; its creator is a member and its page-folder root is initially empty.
* **AC-03:** Only owners and administrators can delete a non-General team, with confirmation identifying the team and contained content.
* **AC-04:** Owners, administrators, and team members with Manage team can change team details and membership. Manage team alone does not grant content access or deletion of the team.
* **AC-05:** Joining a team assigns Member; leaving or removal clears that person's team roles, access, and assignments to that team's tasks while retaining the tasks.
* **AC-06:** A team member with Manage spaces can create, rename, organize, and delete page folders, pages, rooms, and threads and manage their view/edit role selections.
* **AC-07:** Non-owner administrators need team membership and a granting role for space management and content access; the owner bypasses these restrictions.
* **AC-08:** New pages, rooms, and threads grant Member view and edit access by default; changing selected roles changes access, and editing includes viewing.
* **AC-09:** Content navigation exposes only accessible teams and spaces. Space deletion requires a clear confirmation.

### Domain and UX relationship

Team membership is limited to workspace members. Team roles supply additive grants, with Manage team and Manage spaces separated from content view/edit grants. The permanent General team keeps automatic workspace entry coherent. Team and space deletion have content consequences that are visible before confirmation.

### Relevant quality and security requirements

Team membership and role grants apply to direct backend and connected-agent requests, not only to visible controls. Changes to membership, role assignments, and selected content roles affect subsequent access. Destructive actions are restricted to their authorized actors. Technical enforcement and consistency design belong to later engineering artifacts.

### Dependencies and references

This plan follows the approved [Product Definition](../../product/overview.md), [Domain Model](../../architecture/domain-model.md), [Workspace Setup and Membership Feature Plan](../workspace-membership/spec.md), and [Team Roles and Access Feature Plan](../team-roles-access/spec.md).

### Validation expectations

Validation covers General's protected lifecycle, team creation and deletion, membership changes, distinct management grants, nested folders, role defaults, restricted content navigation, administrator and owner differences, task-assignment cleanup, and equivalent restrictions through agents.

## Document responsibilities

[Design](design.md) contains the migrated UX and shared engineering boundaries. Acceptance identifiers such as `AC-01` remain scoped to this feature; they are not renumbered. Detailed implementation, validation, deployment and maintenance work remains in the [existing delivery project](https://linear.app/axxi-labs/project/wodge-teams-and-shared-spaces-e86363f4335a).

## Historical approval evidence

- [Wodge — Teams and Shared Spaces UX](https://linear.app/amr21/document/wodge-teams-and-shared-spaces-ux-0975f88da32b) states “Status: Approved” and redirects to a former Notion source. Its source update is 2026-09-27T00:18:35.266Z. This is a preserved approval claim; no independent signed revision or approving discussion was returned.
- [Wodge — Teams and Shared Spaces Feature Plan](https://linear.app/amr21/document/wodge-teams-and-shared-spaces-feature-plan-4bd50e9998d2) states “Status: Approved” and redirects to a former Notion source. Its source update is 2026-09-27T00:18:31.392Z. This is a preserved approval claim; no independent signed revision or approving discussion was returned.

## Source and revision

- Migrated from [Teams & Shared Spaces](https://linear.app/amr21/document/teams-and-shared-spaces-4ebf497a7043), document ID `3feee922-4a04-46dd-8f72-7fab1ed695dc`.
- Source revision: 2026-10-06T23:58:49.187Z; source author: Amr Yasser; last editor: Amr Yasser.
- Repository migration revision: `migration-draft-1`, 2026-10-09. The user confirmed preparation and placement in this chat. Approval of this rewritten repository revision and remote canonical-link cutover is pending.
- Existing decision/approval statements are source evidence, not new approvals or proof of implementation.
