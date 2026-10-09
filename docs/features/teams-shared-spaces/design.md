---
description: "Teams & Shared Spaces: user journeys, interaction states, and design constraints."
icon: pen-ruler
---

# Design

Companion to [specification](spec.md). The following UX is transposed from the same source revision without changing behavior.

### Experience

Team navigation makes the workspace's structure legible: General is always present, other accessible teams appear alongside it, pages appear in nested folders, and rooms and discussion threads appear within their teams. The existing Wodge visual direction remains the starting point.

### Team journeys

The team-management view distinguishes General from other teams and makes its permanent membership rule clear. Owners and administrators can create teams; a new team begins with its creator as a member and an empty page-folder root. Owners, administrators, and members with Manage team can change a team's name, avatar, and membership. A person managing membership sees which workspace members are already in the team. General does not offer controls to remove a current workspace member or delete the team.
Deleting a non-General team presents a confirmation naming the team and explaining that its spaces and content will be removed. The delete control is available only to owners and administrators.

### Space journeys

A team member with Manage spaces can create and organize page folders and create pages, rooms, and discussion threads. Space-management controls cover rename, organization, deletion, and role-based view/edit selections. New pages, rooms, and threads initially select Member for both view and edit access. The controls communicate that edit access includes viewing and that managing a space does not itself grant content access.
Content navigation shows only teams and spaces the person can access. An authorized manager who cannot view a space's content can still reach its management controls without exposing that content. A space-deletion confirmation identifies the selected space and the content affected.

### Role and authority cues

The interface presents Manage team and Manage spaces as separate grants. Workspace administrator status does not appear as an automatic team-content grant. A non-owner administrator needs team membership and a granting role for space actions; the workspace owner can manage any team and space. Team membership changes show that removal ends that person's access and team-task assignments while shared content remains.

### Shared UI patterns and accessibility

Team and space names, role selections, management authority, and destructive consequences are stated in text. Nested folders and management controls are keyboard operable and have accessible names and state. Empty teams, inaccessible spaces, and failed permission checks have clear feedback. Confirmation flows do not rely on color alone.

### References

Behavior is defined in the companion specification, with access rules in the [Team Roles and Access Feature Plan](../team-roles-access/spec.md) and core relationships in the [Domain Model](../../architecture/domain-model.md).

## Engineering boundaries

Use the [shared architecture](../../architecture/overview.md), [domain model](../../architecture/domain-model.md), [security rules](../../architecture/security.md), [quality requirements](../../architecture/non-functional-requirements.md), [stack](../../architecture/tech-stack.md), and [testing strategy](../../development/testing-strategy.md). These are migrated shared decisions, not newly invented feature contracts. HTTP, synchronization and MCP paths must preserve the same authoritative product rules where applicable.

Detailed schemas, endpoint contracts and implementation patterns not settled by those sources remain implementation decisions. The owner authors repository agent instructions; this migration does not generate `AGENTS.md`.

## Prototypes and evidence

The inspected Linear documents contain written UX, not a standalone executable prototype. No prototype asset has been invented or an empty prototypes directory created. Existing capstone screens/code are implementation evidence and may differ from the revival specification. The repository walkthrough remains linked from the root README.

## Delivery and operation

Detailed work and evidence remain in the existing Linear project. Shared [CI/CD](../../operations/ci-cd.md), [deployment coordination](../../operations/runbooks/revival-deployment.md), [release policy](../../operations/release-policy.md), and [maintenance guidance](../../operations/maintenance.md) apply. Any additional feature rollout or migration requirement needs explicit coordination; lack of a feature deployment file does not assert operational readiness.

## Source and revision

- Migrated from [Teams & Shared Spaces](https://linear.app/amr21/document/teams-and-shared-spaces-4ebf497a7043), document ID `3feee922-4a04-46dd-8f72-7fab1ed695dc`.
- Source revision: 2026-10-06T23:58:49.187Z; source author: Amr Yasser; last editor: Amr Yasser.
- Repository migration revision: `migration-draft-1`, 2026-10-09. The user confirmed preparation and placement in this chat. Approval of this rewritten repository revision and remote canonical-link cutover is pending.
- Existing decision/approval statements are source evidence, not new approvals or proof of implementation.
