---
description: "Team Roles & Access: behavior, scope, acceptance criteria, and recorded approval evidence."
icon: list-check
---

# Spec

Status distinction: the source describes approved revival intent. Related capstone code exists, but compliance with these changed rules has not been demonstrated. This migration proposes document organization only.

### User context

A workspace member can participate in a team with the privileges granted by that team's roles. Workspace owners, administrators, and delegated role managers can shape access without workspace-wide groups or a fixed Moderator role.

### Goals and scope

Team roles provide within-team differences in privilege. Every team member has the built-in Member role; teams may define custom roles. A member can hold multiple roles, whose grants combine additively. There are no explicit deny rules.
Pages, rooms, and discussion threads select team roles for viewing and editing. Editing includes viewing. New pages, rooms, and threads grant Member view and edit access by default. Page attachments follow the page's role-based view and edit access, and room message attachments follow the room's role-based access. There is no separate Manage resources permission. The model can extend as additional actions are specified; this plan does not fix an exhaustive catalog.

### Behavior

1. Joining a team assigns Member automatically. Member cannot be deleted. Leaving a team removes the person's roles for that team.
2. The owner bypasses team and role restrictions for workspace content. Everyone else, including a workspace administrator, needs team membership and an assigned role granting the requested content action.
3. The owner and workspace administrators can manage roles in any team by default. A team member granted Manage roles can create, change, delete, and assign custom roles in that team, including assigning roles to themselves. This permission delegates broad team authority.
4. A role's selected view and edit grants determine access to a page, room, or thread. Any assigned role can supply a grant. Changing a role changes effective access; deleting a custom role removes its member assignments and content grants.
5. Connected agents use the effective permissions of the member they represent.

### Out of scope

There is no built-in Moderator role and no workspace-wide group model. This plan does not define every permission for team membership, channel management, or later capabilities.

### Acceptance criteria

* **AC-01:** A person joining a team receives Member; leaving removes that person's team roles.
* **AC-02:** Authorized role managers can create, change, delete, and assign custom roles. Member remains present and cannot be deleted.
* **AC-03:** A member can hold multiple roles, with additive grants and no explicit denies.
* **AC-04:** A member with Manage roles can assign a custom role to themselves, and the resulting grants apply.
* **AC-05:** A non-owner's page, room, or thread access requires team membership and a role that grants the requested action. Edit access includes view access.
* **AC-06:** New pages, rooms, and threads grant Member view and edit access by default; authorized changes to a resource's selected roles change access.
* **AC-07:** Workspace administration alone grants no team-content access. The owner bypasses team and role restrictions.
* **AC-08:** Changing a role updates effective access. Deleting a custom role removes its assignments and content grants.
* **AC-09:** A connected agent has the same effective access as the member it represents.
* **AC-10:** A non-owner reads a page attachment only with page view access and changes it only with page edit access; room file messages follow room view/edit access. No standalone library or Manage resources grant exists.

### Domain and UX relationship

Roles belong to teams, not to the whole workspace. Workspace owner and administrator authority to manage roles is distinct from team-content access. Role management is a high-trust permission because a holder can grant themselves other team privileges. Member-role assignment, multiple roles, and resource-specific grants are visible in the team and content management experience.

### Relevant quality and security requirements

Effective access is enforced for content reads and writes, including direct requests and agent actions. Role, membership, and resource-grant changes affect subsequent access decisions. The detailed permission catalog and enforcement design are developed in the corresponding feature and engineering artifacts.

### Dependencies and references

This plan depends on the approved [Product Definition](../../product/overview.md) and [Domain Model](../../architecture/domain-model.md). [Agent Access](../agent-access/spec.md) uses the same effective member permissions. [Pages & Embedded Tasks](../pages-embedded-tasks/spec.md) and [Discussions & Messaging](../discussions-messaging/spec.md) define their containing content and attachments.

### Validation expectations

Validation covers Member defaults, multiple roles, role changes and deletion, restricted resources, owner and administrator differences, high-trust self-assignment, and equivalent access through connected agents.

## Document responsibilities

[Design](design.md) contains the migrated UX and shared engineering boundaries. Acceptance identifiers such as `AC-01` remain scoped to this feature; they are not renumbered. Detailed implementation, validation, deployment and maintenance work remains in the [existing delivery project](https://linear.app/axxi-labs/project/wodge-team-roles-and-access-1003fb2c4428).

## Historical approval evidence

- [Wodge — Team Roles and Access UX](https://linear.app/amr21/document/wodge-team-roles-and-access-ux-a1d767317b5b) states “Status: Approved” and redirects to a former Notion source. Its source update is 2026-09-27T00:18:43.323Z. This is a preserved approval claim; no independent signed revision or approving discussion was returned.
- [Wodge — Team Roles and Access Feature Plan](https://linear.app/amr21/document/wodge-team-roles-and-access-feature-plan-4539df6c64d1) states “Status: Approved” and redirects to a former Notion source. Its source update is 2026-09-27T00:18:39.091Z. This is a preserved approval claim; no independent signed revision or approving discussion was returned.

## Source and revision

- Migrated from [Team Roles & Access](https://linear.app/amr21/document/team-roles-and-access-06e587e08df4), document ID `bb315821-e663-4c67-ab40-0c94ca76ab12`.
- Source revision: 2026-10-06T23:59:38.661Z; source author: Amr Yasser; last editor: Amr Yasser.
- Repository migration revision: `migration-draft-1`, 2026-10-09. The user confirmed preparation and placement in this chat. Approval of this rewritten repository revision and remote canonical-link cutover is pending.
- Existing decision/approval statements are source evidence, not new approvals or proof of implementation.
