# Agent Access — design

Companion to [specification](spec.md). The following UX is transposed from the same source revision without changing behavior.

### Experience

Members use their own agent outside Wodge. Wodge supplies an MCP connection to its permitted content and actions; it does not present a hosted AI writer or agent chat. Agent changes appear in the ordinary Wodge content experience, without a separate review queue.

### Member journey

A member can find their agent connections in Wodge, identify an active connection, and revoke it. A connection applies to workspaces the member may access where agent access is enabled. The connection experience makes that scope understandable without implying that the agent has permissions beyond the member's.

### Workspace management journey

The workspace owner and administrators can see whether agent access is enabled for their workspace and change that state. The disabled state applies to every member's agent, including the owner's agent. The state is a workspace-wide capability setting, separate from team-role permissions.

### Attribution and collaboration

Where Wodge shows the actor for an agent action, it displays "\[member\] via \[agent\]". Accepted changes appear through the same collaborative content experience as direct edits. Wodge does not interpose an agent-specific approval screen.

### Navigation and shared patterns

Connection visibility and revocation are member-facing controls. The workspace agent-access state and control are workspace-management controls.

### Accessibility

Connection identity, revocation, workspace setting state, and agent attribution are conveyed in text. The controls are operable by keyboard and expose their state to assistive technology.

### References

The behavioral scope is defined by the companion specification. Product and domain context are in the [Product Definition](../../product/overview.md) and [Domain Model](../../architecture/domain-model.md).

## Engineering boundaries

Use the [shared architecture](../../architecture/overview.md), [domain model](../../architecture/domain-model.md), [security rules](../../architecture/security.md), [quality requirements](../../architecture/non-functional-requirements.md), [stack](../../architecture/tech-stack.md), and [testing strategy](../../development/testing-strategy.md). These are migrated shared decisions, not newly invented feature contracts. HTTP, synchronization and MCP paths must preserve the same authoritative product rules where applicable.

Detailed schemas, endpoint contracts and implementation patterns not settled by those sources remain implementation decisions. The owner authors repository agent instructions; this migration does not generate `AGENTS.md`.

## Prototypes and evidence

The inspected Linear documents contain written UX, not a standalone executable prototype. No prototype asset has been invented or an empty prototypes directory created. Existing capstone screens/code are implementation evidence and may differ from the revival specification. The repository walkthrough remains linked from the root README.

## Delivery and operation

Detailed work and evidence remain in the existing Linear project. Shared [CI/CD](../../operations/ci-cd.md), [deployment coordination](../../operations/runbooks/revival-deployment.md), [release policy](../../operations/release-policy.md), and [maintenance guidance](../../operations/maintenance.md) apply. Any additional feature rollout or migration requirement needs explicit coordination; lack of a feature deployment file does not assert operational readiness.

## Source and revision

- Migrated from [Agent Access](https://linear.app/amr21/document/agent-access-3d457fb7931f), document ID `c34da8bf-9304-46ca-a597-a794625a57d9`.
- Source revision: 2026-10-06T23:58:53.948Z; source author: Amr Yasser; last editor: Amr Yasser.
- Repository migration revision: `migration-draft-1`, 2026-10-09. The user confirmed preparation and placement in this chat. Approval of this rewritten repository revision and remote canonical-link cutover is pending.
- Existing decision/approval statements are source evidence, not new approvals or proof of implementation.
