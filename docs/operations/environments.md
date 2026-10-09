# Environments and runtime topology

data

The revival can use a fresh deployment. Migration of old accounts and data is outside scope.

### Sources

[Domain Model](../architecture/domain-model.md)
[Pages & Embedded Tasks](../features/pages-embedded-tasks/spec.md)
[Demo Billing & Limits](../features/demo-billing-limits/spec.md)

## Deployment

### Showcase deployment

The revival can start from a fresh deployment, with no migration of old accounts or data. It is a portfolio showcase with no committed active maintenance afterward.

### Runtime boundary

The backend is a separate service. PartyServer runs directly on Cloudflare Workers rather than through the existing PartyKit setup. The TanStack Start web application consumes the shared backend APIs.

### Secrets

Secrets move from Infisical to Cloudflare.

### Cost constraints

Use Workers Free without a Workers Paid subscription. Operating spend should remain near $5/month and must not exceed $10/month. Product plan upgrades cannot increase account-wide provider free limits.

### External behavior

Calls use Cloudflare Calls. Authentication uses Better Auth. Stripe remains in test mode. Agents connect through MCP with their own models.

### Approved delivery pipeline

GitHub Actions runs lint, formatting, type checks, Vitest, Playwright, and builds before manually approved Cloudflare deployment. The separate backend and web app remain distinct deployment units.
The audited PartyKit workflow's automatic main-branch deployment is superseded by this agreed release flow. The Next-on-Pages build output and PartyKit deployment configuration are current artifacts to replace.

### Binding and integration checks

Backend deployment includes D1/Drizzle, R2, Better Auth/MCP, PartyServer namespaces, Stripe test webhooks, Calls credentials, and Resend. The backend owns server-side product integrations. Auth origins and provider callback URLs must match the deployed web/backend configuration.
Workers Free requires SQLite-backed Durable Objects. A fresh deployment avoids migration of old namespace/account data but does not waive validation of new D1 schemas and bindings.

### Release evidence

A successful build is distinct from a healthy deployment. Release evidence includes authenticated requests, restored document state, realtime synchronization, permitted file access, test billing, call participation, and agent revocation.
No successful migration, deployment, or provider validation is claimed by these documents.

### Delivery allocation

Implementation is limited to this weekend, next week after work, and the following weekend.

### Related knowledge

[Product Definition](../product/overview.md)
[Tech Stack](../architecture/tech-stack.md)
[Financial Assessment](../product/feasibility.md)

## Documentation synchronization

GitBook is a separate repository integration. See [documentation workflow](../development/documentation.md#gitbook-verification). No GitBook synchronization was configured by this migration.

## Source and revision

[Architecture](https://linear.app/amr21/document/architecture-15a3790a91f7), ID `219776f3-b3d9-4b90-b493-9ae8aa9b9163`, last updated 2026-10-06T23:57:23.209Z by Amr Yasser. Migration is editorial; existing approval statements are preserved claims, not new approvals or execution evidence.
