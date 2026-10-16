# Persistence boundaries

[Docs home](../README.md) · [Architecture](README.md)

Shared D1 persistence uses the retained users, workspaces, memberships, and invite
schema definitions. `createDb` receives an explicit D1 binding; it does not read
Next request context or initialize a database at import time.

The local Worker fixture applied the three existing SQL migrations and exercised
user lookup and workspace/member/invite writes. The
[foundation evidence](../development/backend-foundation.md) identifies the checked
source and results. No new application data model or production migration was
executed by that check.

Replicache domain state and Yjs text remain separate systems. Existing PartyKit
production routing and state paths still require their scoped PartyServer migration.
The auth migration must supply its own persistence/schema and session evidence.
