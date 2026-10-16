---
description: "Foundation security boundaries."
---

# Foundation security boundaries

Preserve existing backend permission authority during the dependency/runtime work.
Persistence factories are not authorization endpoints. HTTP, synchronization, and
MCP callers must enforce the acting member's permissions.

Browser exports stay separate from server/database/protocol exports. Public browser
configuration is separate from server bindings and credentials. Shared persistence
receives D1 explicitly, while Next request context stays inside the web adapter.

Local configuration files remain ignored. The owner-directed secret-export CLI
removal changes scripts and configuration; it does not migrate remote secret values.
The original premium editor packages and private registry mapping are retained
without tracked authentication credentials.

See the [security cleanup record](../development/security-evidence.md) and
[foundation evidence](../development/backend-foundation.md) for actual observations.
Auth sessions, MCP authorization/discovery, production binding wiring, and permission
journeys require their separate implementation and validation.
