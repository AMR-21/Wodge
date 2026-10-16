---
description: "Minimal member-controlled MCP delivery scope."
---

# Minimal member-controlled MCP delivery scope

Use only the [current project scope](../../development/documentation.md). The initial
increment covers permitted discovery, page reading, and task creation/update under
the acting member's current access. Expanded content, discussion, attachment, and
administration actions are not authorized by this plan.

The foundation selects compatible Better Auth/MCP dependencies and checks their
importability. Auth sessions, OAuth/discovery transport, connection/revocation,
permission enforcement, and synchronization still require implementation and actual
validation. No discovery fallback or security exception is selected here.

Keep authorization at the backend, record denied as well as successful requests,
and distinguish package compatibility from integrated agent acceptance. The
[foundation evidence](../../development/backend-foundation.md) records current limits.
