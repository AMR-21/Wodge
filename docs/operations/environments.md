---
description: "Local and deployed environments."
---

# Local and deployed environments

The [current project scope](../development/documentation.md) selects a fresh
portfolio setup without old-account/data migration. No deployment or remote
provisioning is authorized by the local foundation work.

## Local configuration

Use ignored application environment files and explicit local bindings, as described
in [setup](../development/setup.md). The foundation Worker configuration uses a
placeholder local D1 identifier and SQLite Durable Object classes. It is a local
compatibility fixture; production routing and deployed binding wiring are incomplete.

## Deployment boundary

The web application remains Next.js with the retained UI. Backend services migrate
toward PartyServer/Better Auth/D1. Existing PartyKit and Supabase paths remain in
source until their separate migrations. Stripe remains in test mode. Calls and
hosted generation must be disabled for the current milestone; a replacement call
provider is not selected here.

Deployed secrets belong in provider-managed configuration. The owner-directed
secret-export CLI removal changes local scripts only; no remote secret values or
provider settings were migrated. See the [foundation evidence](../development/backend-foundation.md).

## Verification limits

Actual local Worker compilation and D1 fixture results do not validate production
sessions, MCP authorization, collaboration persistence, browser journeys, usage,
or operating cost. The current project requires bounded operating cost, but this
page does not adopt numerical budgets or dates from unrelated project records.

Production validation, deployment permission, and any recovery plan must be recorded
for the actual reviewed deployment. A build pass does not authorize deployment.
