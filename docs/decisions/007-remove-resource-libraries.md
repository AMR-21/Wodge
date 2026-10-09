# Decision 007 — Remove standalone resource libraries

> **Migration revision approved.** User approved `migration-draft-1` in this chat on 2026-10-09. Historical source knowledge is preserved; this file does not establish implementation, runtime validation, deployment, or release completion.

## Decision

The Wodge revival does not include standalone workspace or team resource libraries, file-folder navigation, or a separate Manage resources permission. The capstone's team library is a deliberate removal from the portfolio showcase.
Shared resources are organized in team pages through links to other pages, links to external resources, and files attached to the page. Room messages retain media and file attachments. A file follows the view/edit access of its containing page or room message; it has no independent library location or permission.
Connected agents can work with links and files attached to pages under the member's page access. Room messaging remains outside the initial agent scope. The workspace's 50 MB Free or 500 MB Demo Pro storage allowance still pools user-created structured data and uploaded attachments.

## Rationale

Pages already provide the hierarchy and context needed to organize shared resources. A separate file tree would repeat that navigation while adding file-specific permissions, folder operations, and another experience to maintain. The revival focuses its showcase effort on local-first collaboration, team access, and agent-compatible knowledge. Keeping attachments preserves file sharing where it is used without preserving a standalone library.

## Change from the capstone

The capstone had a team resource library with folders inferred from file paths and upload/delete authority tied to its Moderator role. The revival removes that library and Moderator-specific file authority. Page and room attachments remain, governed by their containing content's permissions.

## Related knowledge

[Product Definition](../product/overview.md), [Domain Model](../architecture/domain-model.md), [Pages & Embedded Tasks](../features/pages-embedded-tasks/spec.md), [Discussions & Messaging](../features/discussions-messaging/spec.md), and [Demo Billing & Limits](../features/demo-billing-limits/spec.md) describe the resulting product, domain, page, room, and storage behavior.

## Source and revision

- Migrated from [Decision 007 — Remove standalone resource libraries](https://linear.app/amr21/document/decision-007-remove-standalone-resource-libraries-0bdb0045fadf), document ID `c3452c9b-db29-4d63-906a-dcb501e12b54`.
- Source revision: 2026-10-06T23:55:12.924Z; source author: Amr Yasser; last editor: Amr Yasser.
- Repository migration revision: `migration-draft-1`, 2026-10-09. The user confirmed preparation and placement in this chat. Approval of this rewritten repository revision and remote canonical-link cutover is pending.
- Existing decision/approval statements are source evidence, not new approvals or proof of implementation.
