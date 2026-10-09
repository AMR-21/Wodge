---
description: "Team Roles & Access: user journeys, interaction states, and design constraints."
icon: pen-ruler
---

# Design

Companion to [specification](spec.md). The following UX is transposed from the same source revision without changing behavior.

### Experience

The team-management experience presents one built-in Member role and the team's custom roles. There is no built-in Moderator role or workspace-wide group interface. Authorized role managers can see and change custom role definitions and assignments. A member's assigned roles can be shown together because one member may hold several roles.

### Member and role-management journeys

Joining a team assigns Member automatically. Authorized role managers can add or remove custom roles for team members and can assign a custom role to themselves. Member remains assigned while the person belongs to the team. The role-management experience makes the broad authority of Manage roles apparent to the person granting it.

### Content-access journey

Page, room, and thread access controls present the team roles selected for view and edit access. A new resource initially selects Member for both. Editing includes viewing, so the controls do not present edit access as independent of view access. Changes to selected roles change who can use the resource.

### Workspace role distinction

Workspace administrators can reach role management without automatic access to team content. The workspace owner bypasses team and role restrictions. The interface reflects those distinct capabilities without presenting administrator status as a content-access grant.

### Shared UI patterns and accessibility

Role names, multiple assignments, view/edit selections, and management authority are conveyed in text. Role and access controls are keyboard operable and expose their labels and state to assistive technology. The existing Wodge visual direction remains the starting point; this feature does not require a full visual redesign.

### References

The behavior is defined in the companion specification, with product and domain context in the [Product Definition](../../product/overview.md) and [Domain Model](../../architecture/domain-model.md).

## Engineering boundaries

Use the [shared architecture](../../architecture/overview.md), [domain model](../../architecture/domain-model.md), [security rules](../../architecture/security.md), [quality requirements](../../architecture/non-functional-requirements.md), [stack](../../architecture/tech-stack.md), and [testing strategy](../../development/testing-strategy.md). These are migrated shared decisions, not newly invented feature contracts. HTTP, synchronization and MCP paths must preserve the same authoritative product rules where applicable.

Detailed schemas, endpoint contracts and implementation patterns not settled by those sources remain implementation decisions. The owner authors repository agent instructions; this migration does not generate `AGENTS.md`.

## Prototypes and evidence

The inspected Linear documents contain written UX, not a standalone executable prototype. No prototype asset has been invented or an empty prototypes directory created. Existing capstone screens/code are implementation evidence and may differ from the revival specification. The repository walkthrough remains linked from the root README.

## Delivery and operation

Detailed work and evidence remain in the existing Linear project. Shared [CI/CD](../../operations/ci-cd.md), [deployment coordination](../../operations/runbooks/revival-deployment.md), [release policy](../../operations/release-policy.md), and [maintenance guidance](../../operations/maintenance.md) apply. Any additional feature rollout or migration requirement needs explicit coordination; lack of a feature deployment file does not assert operational readiness.

## Source and revision

- Migrated from [Team Roles & Access](https://linear.app/amr21/document/team-roles-and-access-06e587e08df4), document ID `bb315821-e663-4c67-ab40-0c94ca76ab12`.
- Source revision: 2026-10-06T23:59:38.661Z; source author: Amr Yasser; last editor: Amr Yasser.
- Repository migration revision: `migration-draft-1`, 2026-10-09. The user confirmed preparation and placement in this chat. Approval of this rewritten repository revision and remote canonical-link cutover is pending.
- Existing decision/approval statements are source evidence, not new approvals or proof of implementation.
