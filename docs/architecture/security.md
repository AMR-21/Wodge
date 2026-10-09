---
description: "Authorization, privacy, secrets, revocation, and integration boundaries."
icon: shield-halved
---

# Security

## Identity and invitations

Better Auth uses the existing D1 database. Email invitation acceptance requires a signed-in account with the invited verified address. Revoked, expired, or reset invitations cannot grant entry.

## Workspace authority

Only the owner may delete the workspace or change administrator status. The owner cannot leave or be removed while owning it. Administrator authority does not automatically grant team-content access.

## Team and resource authorization

Non-owners require team membership and additive granting roles. Edit includes view. Manage team, spaces, roles, and discussions are distinct. Manage roles is high-trust because holders can assign custom roles to themselves.
Attachments inherit their containing page or room’s access. Enforcement applies to direct backend calls, structured mutations, text collaboration, and downloads as well as UI controls.

## Agents

MCP requests require an active member connection and enabled workspace agent access. They use the member’s current permissions and attribution. Revocation and disabled workspace access block subsequent actions, including owner-connected agents.

## Calls

Room view access governs joining and publishing the participant’s own media. Losing room, team, or workspace access disconnects participation. Deleting the room ends its call.

## Secrets and premium eligibility

Secrets move from Infisical to Cloudflare. Only manually selected users may use premium plan features; eligibility is recorded as a user flag in the database.

## Plans and abuse

The backend enforces joins, storage growth, uploads, synchronization writes, and call admission against effective limits. Stripe test events are authenticated and applied idempotently. Shared rate/abuse controls constrain runaway traffic while preserving ordinary local-first use.

## Trust boundaries and session transport

Better Auth runs at the separate backend's Hono boundary and stores authentication state in D1. Credentialed browser requests require explicit approved origins and matching Better Auth trusted origins; wildcard CORS is not the authentication configuration.
Public payloads do not establish the actor, owner/admin status, role grants, premium eligibility, or internal service authority.

## MCP authorization

The approved official Better Auth MCP/OAuth plugin handles standard connection authorization. Wodge still enforces current member permissions, active connection state, workspace disablement, and attribution. A valid token alone does not authorize a particular resource.

## Legacy access paths

The current page service and task mutation runner accept administrator/moderator bypasses. Shared RBAC still contains workspace-wide group logic and grants thread viewing without a team-membership check. These are capstone behaviors superseded by the approved owner-only bypass and team-role model.
[apps/backend/src/page/page-party.ts](<https://github.com/AMR-21/Wodge/blob/d875c2d369f2bed15ba4e7257242131fddcbfa0a/apps/backend/src/page/page-party.ts>)
[apps/backend/src/page/page-push.ts](<https://github.com/AMR-21/Wodge/blob/d875c2d369f2bed15ba4e7257242131fddcbfa0a/apps/backend/src/page/page-push.ts>)
[packages/data/lib/rbac.ts](<https://github.com/AMR-21/Wodge/blob/d875c2d369f2bed15ba4e7257242131fddcbfa0a/packages/data/lib/rbac.ts>)

## Critical security validation

* A non-owner administrator without a granting team role cannot read or mutate page, room, or thread content.
* A viewer cannot send a Yjs document update or task mutation.
* Forged actor/role/premium fields cannot establish privileges.
* Revoked agents and workspace-disabled agents fail subsequent requests.
* Invalid Stripe signatures and duplicate events cannot fabricate plan changes.
* File access follows the current containing resource's permissions.
* Secrets, cookies, tokens, OTPs, and content bodies are not committed or included in diagnostic logs.
  [Better Auth Hono boundary](<https://better-auth.com/docs/integrations/hono>)

## Sources

[Workspace Setup & Membership](../features/workspace-membership/spec.md)
[Team Roles & Access](../features/team-roles-access/spec.md)
[Agent Access](../features/agent-access/spec.md)
[Room Calls](../features/room-calls/spec.md)
[Demo Billing & Limits](../features/demo-billing-limits/spec.md)
[Tech Stack](tech-stack.md)

## Source and revision

- Migrated from [Security](https://linear.app/amr21/document/security-c4b345b5472c), document ID `7d81a4ed-984c-42ee-94f0-c861d5232ad8`.
- Source revision: 2026-10-06T23:57:45.849Z; source author: Amr Yasser; last editor: Amr Yasser.
- Repository migration revision: `migration-draft-1`, 2026-10-09. The user confirmed preparation and placement in this chat. Approval of this rewritten repository revision and remote canonical-link cutover is pending.
- Existing decision/approval statements are source evidence, not new approvals or proof of implementation.
