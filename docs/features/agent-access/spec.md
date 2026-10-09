# Agent Access — specification

Status distinction: the source describes approved revival intent. Related capstone code exists, but compliance with these changed rules has not been demonstrated. This migration proposes document organization only.

### User context

A Wodge member can connect an MCP-compatible agent that they provide, so the agent can work with Wodge knowledge and tasks using that member's access. This replaces the capstone's built-in AI writer. Wodge hosts no AI model.

### Goals and scope

The initial agent capability covers accessible workspace and team discovery; pages, their links and file attachments, and embedded tasks; and discussion threads, posts, comments, Q&A, and polls. Agent activity is a direct part of Wodge's normal collaboration flow.
A member's agent connection applies across workspaces the member can access. A workspace owner or administrator can disable or enable agent access for that workspace. The disabled setting blocks every agent there, including one connected by the owner. The member can view and revoke their agent connection in Wodge.

### Behavior

1. A member connects their own MCP-compatible agent to Wodge and can view or revoke the connection in Wodge.
2. The agent discovers only the member's accessible workspaces and teams where agent access is enabled.
3. Within the member's permissions, the agent can read, create, edit, and delete pages, embedded tasks, thread posts, and comments. It can interact with Q&A and polls, including voting on the member's behalf.
4. Within the member's page access, the agent can read page links and download page attachments. With page edit access it can add or remove links and upload or remove page attachments. It has no standalone library or file-folder actions; room chat and its attachments remain outside the initial agent scope.
5. Agent changes take effect directly, without a separate proposal or review queue. Other clients receive accepted changes through Wodge's normal synchronization.
6. Collaborators see agent actions attributed as "\[member\] via \[agent\]".
7. A revoked connection or a disabled workspace setting stops subsequent agent access. Changes to the member's permissions also apply to the agent.

### Out of scope for the initial capability

Agent access to room chat, live calls, workspace administration, and autonomous background workflows is outside the initial scope. Wodge does not provide an in-app hosted model or pay for generation. These boundaries do not remove the corresponding human-facing Wodge capabilities.

### Acceptance criteria

* **AC-01:** A member can connect an MCP-compatible agent, view the connection in Wodge, and revoke it.
* **AC-02:** The agent discovers only workspaces and content accessible to the member where workspace agent access is enabled.
* **AC-03:** The workspace owner or an administrator can disable or enable agent access. Disabling blocks all agents in that workspace, including the owner's.
* **AC-04:** Page, attachment, task, thread, and poll actions follow the member's current team roles and content permissions. Agent access grants no additional privilege.
* **AC-05:** An agent can perform the page, task, thread, Q&A, and poll actions listed in Scope when permitted, including page-link and page-attachment actions and voting on the member's behalf.
* **AC-06:** Accepted agent changes take effect directly and synchronize with collaborators without a separate approval queue.
* **AC-07:** Wodge attributes agent actions to the member via the agent.
* **AC-08:** Revocation, a disabled workspace setting, or loss of the member's permission prevents subsequent agent access.
* **AC-09:** The capability works without a Wodge-hosted AI model.

### Domain and UX relationship

An agent connection belongs to a member and acts on that member's behalf. The workspace agent-access setting is separate from content-role permissions. The member-facing experience includes connection visibility and revocation; workspace managers can see and change the workspace setting; collaborators see the "via agent" attribution. There is no separate agent review queue.

### Relevant quality and security requirements

Agent operations respect the same authorization and collaboration guarantees as human actions. Revocation and workspace disabling are enforced for subsequent access. The agent does not receive content outside the member's permitted scope. Detailed security mechanisms and synchronization design belong to later engineering artifacts.

### Dependencies and references

This feature depends on the approved [Product Definition](../../product/overview.md) and [Domain Model](../../architecture/domain-model.md). It relies on Wodge's page, task, discussion, membership, and synchronization capabilities. The capstone's hosted AI writer is replaced; agents can work with links and files attached to accessible pages, while standalone libraries are absent.

### Validation expectations

Validation covers discovery and each allowed content action, denied actions, role changes, workspace disabling including the owner case, connection revocation, attribution, and synchronization to another client.

## Document responsibilities

[Design](design.md) contains the migrated UX and shared engineering boundaries. Acceptance identifiers such as `AC-01` remain scoped to this feature; they are not renumbered. Detailed implementation, validation, deployment and maintenance work remains in the [existing delivery project](https://linear.app/amr21/project/wodge-agent-access-a097a3305099).

## Historical approval evidence

- [Wodge — Agent Access UX](https://linear.app/amr21/document/wodge-agent-access-ux-d32af5edd79d) states “Status: Approved” and redirects to a former Notion source. Its source update is 2026-09-27T12:22:42.082Z. This is a preserved approval claim; no independent signed revision or approving discussion was returned.
- [Wodge — Agent Access Feature Plan](https://linear.app/amr21/document/wodge-agent-access-feature-plan-d0a1794867bd) states “Status: Approved” and redirects to a former Notion source. Its source update is 2026-09-27T00:18:54.067Z. This is a preserved approval claim; no independent signed revision or approving discussion was returned.

## Source and revision

- Migrated from [Agent Access](https://linear.app/amr21/document/agent-access-3d457fb7931f), document ID `c34da8bf-9304-46ca-a597-a794625a57d9`.
- Source revision: 2026-10-06T23:58:53.948Z; source author: Amr Yasser; last editor: Amr Yasser.
- Repository migration revision: `migration-draft-1`, 2026-10-09. The user confirmed preparation and placement in this chat. Approval of this rewritten repository revision and remote canonical-link cutover is pending.
- Existing decision/approval statements are source evidence, not new approvals or proof of implementation.
