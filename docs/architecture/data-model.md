# Persistence and data ownership

> **Migration revision approved.** User approved `migration-draft-1` in this chat on 2026-10-09. Prepared 2026-10-09 as `migration-draft-1`. Source decisions retain their recorded status; the repository revision is approved; external cutover awaits verified remote replacement links.

### Database and files

Retain the existing D1 database with Drizzle. Better Auth uses that D1 database. Retain R2 for files.
Premium eligibility is stored as a manually managed user flag in the database.

### State and ownership

Replicache remains the structured local-first system; Yjs handles collaborative page text.
The workspace owns memberships, teams, user-content usage, and call-usage periods. A team owns its memberships, roles, and spaces. A page owns rich text, links/files, and at most one task collection. Rooms own their messages and attached files.

### Existing storage split

The audited implementation stores relational user/workspace/membership records in D1. PartyKit room storage contains domain snapshots and Replicache versions, client groups, and mutation acknowledgements. Page tasks and columns are in page-service storage; Yjs uses snapshot persistence.
The approved service replacements retain those ownership responsibilities rather than treating the UI framework migration as a move of all content into D1.
[packages/data/models/workspace/workspace-model.ts](<https://github.com/AMR-21/Wodge/blob/d875c2d369f2bed15ba4e7257242131fddcbfa0a/packages/data/models/workspace/workspace-model.ts>)
[apps/backend/src/page/start-fn.ts](<https://github.com/AMR-21/Wodge/blob/d875c2d369f2bed15ba4e7257242131fddcbfa0a/apps/backend/src/page/start-fn.ts>)
[apps/backend/src/lib/replicache.ts](<https://github.com/AMR-21/Wodge/blob/d875c2d369f2bed15ba4e7257242131fddcbfa0a/apps/backend/src/lib/replicache.ts>)

### PartyServer persistence requirements

Workers Free supports SQLite-backed Durable Objects. The direct Workers migration therefore requires SQLite-backed namespaces; the storage API can still expose get/put-style operations.
The Yjs addon supplies load/save hooks and a read-only connection hook. Durable recovery and access enforcement require their application configuration; the addon is not evidence that Wodge has already implemented them.
Document text, tasks, synchronization metadata, and file references retain distinct ownership. Removing the embedded task view cannot become deletion of the collection.
[Durable Objects storage and plan constraints](<https://developers.cloudflare.com/durable-objects/platform/pricing/>)
[Yjs server integration](<https://github.com/cloudflare/partykit/blob/main/packages/y-partyserver/src/server/index.ts>)

### Authentication state

Better Auth and its approved MCP authorization state use the existing D1 database. Auth schemas must match the selected plugins. The manually managed premium-eligibility flag is not a client-editable profile field.

### Lifecycle requirements

Removing a task block preserves its underlying collection. Deleting a page removes its text, files, and tasks. Team deletion removes contained spaces/content. Member departure preserves authored shared content while clearing roles and team-task assignments.

### Downgrade and local work

Downgrade preserves existing members and stored content. Reads, downloads, cleanup, and non-growing edits remain possible at a storage cap. Pending offline edits remain visible and are not silently discarded when their growth cannot synchronize.

### Storage accounting

User-created structured data and files share one workspace storage pool. Operational indexes, transient processing, and bounded synchronization history are outside the user-facing allowance, while remaining operator costs.

#

## Source and revision

[Architecture](https://linear.app/amr21/document/architecture-15a3790a91f7), ID `219776f3-b3d9-4b90-b493-9ae8aa9b9163`, last updated 2026-10-06T23:57:23.209Z by Amr Yasser. Migration is editorial; existing approval statements are preserved claims, not new approvals or execution evidence.
