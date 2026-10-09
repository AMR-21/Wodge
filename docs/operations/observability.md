# Observability

## Wodge Revival

Operational visibility supports the retained user journeys and the preferred $5 / maximum $10 monthly budget. This page defines checks for implementation and release; it does not claim monitoring is configured.

## User-critical flows

Sign-in and invitations; membership and permission checks; Replicache push/pull and reconnect; Yjs editing and persistence; files; discussions; MCP connection and revocation; room calls; Stripe test webhooks.

## Logs and errors

Use the deployed Cloudflare runtime's native diagnostics to investigate failed requests and service errors. Keep enough operation context to distinguish authentication, permission, validation, storage, synchronization and provider failures. Agent operations need member-via-agent attribution as required by Agent Access.

## Health and dependency checks

During deployed validation, check web/backend responses, required D1 and R2 bindings, Durable Object persistence, authentication callbacks, MCP metadata and authorization, Resend delivery, Stripe test webhooks and SFU session behavior. Capture actual failures in the implementation work.

## Usage and budget

Inspect Workers requests and CPU, Durable Object requests/duration/storage, D1 usage, R2 storage/operations and call egress. Apply the current provider allowances in the Financial Assessment to observed usage. Product quotas alone do not establish the provider bill or prevent every usage spike.
[Financial Assessment](../product/feasibility.md)

## Sensitive-data restrictions

Do not log session cookies, authorization codes, bearer tokens, secrets, invitation tokens, full MCP payloads or private document/chat/file contents. Diagnostic context must not expose another member's restricted data.
[Security](../architecture/security.md)

## Release evidence and feedback

Attach observed runtime failures and usage checks to release validation. No external monitoring subscription, alert delivery service, on-call schedule or automatic spending cutoff has been approved. The application owner can use the approved new-workspace pause when appropriate; that is not a provider billing cap.

## Source and revision

- Migrated from [Observability](https://linear.app/amr21/document/observability-e2f2f78960cf), document ID `fa6ef1d8-50c1-4cc6-9f80-6715e5d762fa`.
- Source revision: 2026-10-06T23:57:18.471Z; source author: Amr Yasser; last editor: Amr Yasser.
- Repository migration revision: `migration-draft-1`, 2026-10-09. The user confirmed preparation and placement in this chat. Approval of this rewritten repository revision and remote canonical-link cutover is pending.
- Existing decision/approval statements are source evidence, not new approvals or proof of implementation.
