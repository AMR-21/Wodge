# Retained domain model

[Docs home](../README.md) · [Architecture](README.md)

The foundation retains the existing domain schemas in `packages/data/schemas`:
users, workspaces and memberships, teams, channels, pages, threads, and rooms.
Existing keys and mutation models remain in `packages/data`.

Replicache handles structured local-first state, while Yjs handles collaborative
text. D1 persistence and schema definitions remain distinct from browser adapters.
Zod 3 domain validation is retained; Zod 4 is isolated to auth/MCP protocol adapters.

This foundation introduces no custom-role model, resource/invitation redesign,
storage quota, call accounting model, or premium-eligibility flag. Those changes
cannot be inferred from dependency or package-boundary work.

See [package boundaries](../development/code-structure.md) and the
[foundation results](../development/backend-foundation.md).
