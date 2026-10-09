# Pages & Embedded Tasks — specification

Status distinction: the source describes approved revival intent. Related capstone code exists, but compliance with these changed rules has not been demonstrated. This migration proposes document organization only.

### User context

Team members use pages for shared knowledge and task coordination. A page combines collaborative rich text with one optional embedded view of its task collection.

### Goals and scope

The feature covers viewing and editing page content, including links and file attachments; live collaboration; locally available editing; a single task collection per page; table and Kanban views; task and column management; assignment; filtering; and page lifecycle. Core editing is required; advanced layout is an enhancement target where it can be delivered without an unsuitable proprietary dependency.

### Behavior

 1. A page supports core rich text: headings, paragraphs, lists and checklists, links, images, tables, and code. Members with view access can read the page. Members with edit access can change its text. The workspace owner bypasses team and role restrictions; administrator status alone does not grant page access.
 2. Concurrent editors see a shared page. Locally available changes remain usable without a connection and reconcile when connectivity returns. Presence cues make collaborators visible.
 3. A page has at most one task collection. Its optional embedded task block presents that collection as a table or Kanban board. Switching views does not copy or alter the tasks.
 4. A page editor can create, edit, delete, and reorder task columns and tasks. A task belongs to one column. The column represents its current workflow state.
 5. A task may have a title, overview, multiple assignees from the page's team, low/medium/high priority, and a due date or range. Table and Kanban views can filter the same collection by title, assignee, priority, and due date.
 6. Page edit access governs task and column changes as well as rich-text changes. Removing someone from the team clears their assignments to that team's tasks but retains the tasks.
 7. Removing the task block from the page hides its view and preserves the collection. Adding the block again restores access to the same tasks. Deleting the page removes its text, attached files, and task collection.
 8. Connected agents can read or edit pages and tasks within the member's effective page access, with the agreed attribution.
 9. Advanced layout elements, such as multiple columns or a table of contents, may be retained when practical. The guaranteed feature scope is the core editor and task experience; exact editor extensions and token requirements are decided in the tech-stack stage.
10. An editor can organize resources on a page with links to other pages or external URLs and with uploaded file attachments. A viewer can open links and download attached files. Attachments belong to the page and inherit its access; there is no separate workspace or team file library. A connected agent may read, add, or remove links and page attachments under the same page permissions.

### Out of scope

Multiple independent task collections on one page, a separate task-edit permission, a built-in hosted AI writer, and specific proprietary editor extensions are outside this feature's required scope. Global task dashboards, charts, and calendars are not required for the showcase.

### Acceptance criteria

* **AC-01:** A page viewer can read its rich text and tasks but cannot change them; a page editor can change both.
* **AC-02:** An administrator without team membership and a granting role cannot access page content; the owner bypasses team and role restrictions.
* **AC-03:** Two authorized editors can work on the same page and see reconciled content and collaborator presence.
* **AC-04:** A previously available page remains editable during a connection loss and reconciles its changes after reconnecting.
* **AC-05:** A page has no more than one task collection; its table and Kanban views display the same tasks and columns.
* **AC-06:** A page editor can create, edit, delete, and reorder columns and tasks; every task belongs to one column.
* **AC-07:** Tasks support title, overview, multiple team-member assignees, low/medium/high priority, and due date or range; both views can filter by title, assignee, priority, and due date.
* **AC-08:** Removing the embedded task block retains tasks; adding it again shows the existing collection. Deleting the page removes its text, attached files, and task collection.
* **AC-09:** Removing a person from the team clears their assignments to that team's tasks without deleting the tasks.
* **AC-10:** Connected agents follow the member's page view/edit access when reading or changing text and tasks.
* **AC-11:** A page editor can add and remove links and file attachments; a viewer can open links and download attachments. Files inherit page access, and authorized agents can perform the same page actions.

### Domain and UX relationship

A page belongs to a team's folder and owns its rich text, links and attached files, and one task collection. A task belongs to a column in that collection. The embedded block is a view of page-owned tasks, not the owner of those tasks. The related UX design covers editor controls, collaboration cues, task view switching, filtering, assignment, and removal feedback.

### Relevant quality and security requirements

Page and task access is enforced for text collaboration, structured task mutations, direct backend requests, and connected-agent requests. Reconnection preserves valid local edits and communicates failures that need attention. The detailed synchronization, editor-package, storage, and conflict-handling design belongs to later engineering artifacts.

### Dependencies and references

This plan follows the approved [Product Definition](../../product/overview.md), [Domain Model](../../architecture/domain-model.md), [Team Roles and Access Feature Plan](../team-roles-access/spec.md), [Teams and Shared Spaces Feature Plan](../teams-shared-spaces/spec.md), and [Agent Access Feature Plan](../agent-access/spec.md).

### Validation expectations

Validation covers core rich text, links and attachments, concurrent and offline edits, page permissions, one collection across both views, columns and tasks, filters, assignee constraints, task-block removal and restoration, page deletion, team departure, and agent access.

## Document responsibilities

[Design](design.md) contains the migrated UX and shared engineering boundaries. Acceptance identifiers such as `AC-01` remain scoped to this feature; they are not renumbered. Detailed implementation, validation, deployment and maintenance work remains in the [existing delivery project](https://linear.app/amr21/project/wodge-pages-and-embedded-tasks-1e8ffa29562c).

## Historical approval evidence

- [Wodge — Pages and Embedded Tasks UX](https://linear.app/amr21/document/wodge-pages-and-embedded-tasks-ux-7aef6b6f4420) states “Status: Approved” and redirects to a former Notion source. Its source update is 2026-09-27T00:19:14.944Z. This is a preserved approval claim; no independent signed revision or approving discussion was returned.
- [Wodge — Pages and Embedded Tasks Feature Plan](https://linear.app/amr21/document/wodge-pages-and-embedded-tasks-feature-plan-5feb84b67161) states “Status: Approved” and redirects to a former Notion source. Its source update is 2026-09-27T00:19:10.765Z. This is a preserved approval claim; no independent signed revision or approving discussion was returned.

## Source and revision

- Migrated from [Pages & Embedded Tasks](https://linear.app/amr21/document/pages-and-embedded-tasks-b6f379a38493), document ID `f82cb4ec-aaae-4882-a5e0-49cd9fbf501a`.
- Source revision: 2026-10-06T23:59:16.461Z; source author: Amr Yasser; last editor: Amr Yasser.
- Repository migration revision: `migration-draft-1`, 2026-10-09. The user confirmed preparation and placement in this chat. Approval of this rewritten repository revision and remote canonical-link cutover is pending.
- Existing decision/approval statements are source evidence, not new approvals or proof of implementation.
