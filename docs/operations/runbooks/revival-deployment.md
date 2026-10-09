# Revival deployment coordination

## Wodge Revival release

Fresh deployment of the existing project with the approved migrations. Existing accounts and data do not require migration.

## Release inputs

[Architecture](../../architecture/overview.md)
[Testing Strategy](../../development/testing-strategy.md)
[Financial Assessment](../../product/feasibility.md)

## Before approval

* Resolve and lock the approved dependency versions.
* Pass GitHub Actions lint, formatting, type checking, tests and builds.
* Validate Better Auth and MCP authorization on Workers, including revocation and trusted origins.
* Validate D1 schema changes and SQLite Durable Object persistence on the fresh environment.
* Demonstrate Replicache recovery and Yjs editing, read-only enforcement and persistence.
* Validate the permission matrix, invitations, pages/tasks, discussions, file access and premium flag.
* Exercise real calls, navigation controls, disconnection and participant-minute accounting.
* Exercise Stripe test events and duplicate delivery.
* Inspect deployed provider plans, usage and cost exposure against Workers Free and the $5 preferred / $10 maximum monthly budget.

## Manual deployment

A passing pipeline precedes a manual Cloudflare deployment approval. Deploy the separate web and backend units with their corresponding bindings, secrets, origins and callback configuration. Keep the release tied to its reviewed commit and record the deployed versions and schema changes.

## Deployed smoke checks

Sign in, open a workspace, navigate a team, reconnect after an offline edit, edit a page with two clients, test viewer denial, create and view a task, open a discussion, access a permitted file, connect and revoke an agent, join and end a room call, and exercise test billing.

## Recovery

Before deployment, check whether the prior application version remains compatible with the new schema and persisted state. Roll back application code only when that compatibility is established. A code rollback does not reverse a D1 migration or Durable Object state change. Record the recovery action with the release.

## Release record

Record the commit, release version, change summary, validation evidence, manual approval, deployment time and smoke-check outcome when they exist. No release version, executed check result or deployment approval is recorded by this document.

## Operating constraint

The project is a portfolio revival with no committed ongoing maintenance allocation. Release readiness includes a usable way to inspect failures and usage without relying on an unapproved paid monitoring service.

## Applicability and readiness

This retained shared coordination covers the fresh web/backend revival deployment; it is not evidence that the new process is already established. Old accounts/data are explicitly outside the migration scope. Detailed rollout, manual QA, approval requests and deployed smoke evidence stay in WDG-167 through WDG-170 under WDG-58. No feature-specific rollout document is needed solely to duplicate this shared procedure. If a feature introduces additional compatibility or rollout requirements, resolve that scope before executing it.

No production operation, schema migration, Worker probe, rollback or smoke check was executed during the documentation migration. Readiness remains conditional on the evidence above.

## Source and revision

[Release Plan — Wodge Revival](https://linear.app/amr21/document/release-plan-wodge-revival-c4746916bba2), ID `1f73acfb-fbee-48d2-af5e-afacef2edba4`, last updated 2026-10-06T23:55:45.574Z by Amr Yasser. Migration is editorial; existing approval statements are preserved claims, not new approvals or execution evidence.
