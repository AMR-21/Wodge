# Product Definition

### Identity and purpose

Wodge is a local-first collaborative workspace created as a graduation project. It combines team communication, shared knowledge, task coordination, and live collaboration. The revival keeps that product idea and makes Wodge a portfolio showcase.
The original code and graduation reports describe the capstone version. The revival can use a fresh deployment; it does not need to preserve accounts or data from the old deployment.

### People

* **Workspace members** communicate, edit shared pages, coordinate tasks, and participate in rooms.
* **Workspace owners and administrators** manage membership, invitations, and workspace settings.
* **Portfolio reviewers** are an audience for the revived demonstration of the product and its engineering.

### Product experience

A signed-in person enters a workspace containing members, teams, channels, rooms, and pages. Channels support discussions; rooms support real-time interaction; pages support shared knowledge and tasks. Presence and calls add live collaboration to that workspace.
Replicache is fundamental to Wodge's structured local-first data. Yjs is the collaborative text model. These two systems address different kinds of shared state.

### Capability map

The public showcase retains these major capabilities from the original product:

* Workspaces, reusable invitation links, email invitations, memberships, roles, teams, and settings.
* Channels, threaded posts and comments, Q&A-style discussions, room messages, polls, and presence.
* Hierarchical pages, collaborative rich text, embedded tasks, assignees, priorities, table views, and Kanban organization.
* Room-based audio/video calls and participant controls.
* Page content with links and file attachments, plus media/file attachments in room messages. Pages organize shared resources within teams without a separate file library.
* Local interaction and synchronization for structured data.
* Stripe Checkout and customer-portal flows in test mode, with Free and Demo Pro limits for members, pooled storage, and calls. Demo Pro displays an illustrative $29/month test price; no real payments are collected.
  The public portfolio showcase will demonstrate every major capability above, including calls and Stripe test billing. The goal is to show the working product and its engineering through use. The revival is a showcase, with no expectation of active maintenance afterward.
  The revival adds access for user-provided agents through MCP. Agents can work with permitted Wodge content under the member's privileges. Wodge does not host an AI model; deeper autonomous agent workflows remain a future direction.

### Premium access

Only manually selected users may use premium plan features. Eligibility is recorded as a user flag in the database.

### Revival boundaries

The architecture and technology may change while the product idea remains recognizable. Workspace-wide groups from the original capstone are excluded. Teams define the content boundary, while extensible team roles preserve differences in privileges within a team. A team member can hold multiple roles. The web application will use a separate backend that can also serve a possible future mobile client. A mobile application itself has not been committed as part of this revival.
A full visual redesign has not been chosen. Usability improvements can accompany the revival. The old deployment's data is outside the migration scope. The showcase will use Workers Free without a Workers Paid subscription; account-wide free limits constrain availability.

### Changes from the capstone

| Area | Capstone | Revival |
| -- | -- | -- |
| Access organization | Teams, workspace-wide groups, and a built-in team moderator; groups could be selected for page and room viewing or editing, while administrators had broad team-content access. | Teams use an automatically assigned Member role and extensible custom roles. A member may hold multiple additive roles; pages, rooms, and threads grant view/edit access to selected roles. The owner bypasses team restrictions. Administrators may manage team roles by default but need team membership and a granting role for content. Workspace-wide groups and the built-in Moderator role are absent. |
| Workspace entry and ownership | The capstone exposed a reusable invitation link, created a General team with Welcome spaces, and used 10/50 member limits. Its deletion UI was owner-only while the endpoint also accepted administrators. | The revival retains the General team, Welcome page, room, and thread, automatic entry into General, the reusable link, and 10/50 member limits. It adds email invitations for existing or new users. Only the owner may delete the workspace or change administrator status. |
| Resource sharing | The capstone offered team resource libraries for file sharing. | The revival removes standalone workspace and team resource libraries and their folder-management permission. Team pages organize resources through links and page attachments; room messages retain media and file attachments. Files inherit the access of their containing page or room. |
| AI assistance | The capstone's built-in AI writer called a hosted model. | Members connect their own agents through MCP. Agents edit permitted content directly; Wodge does not host a model. |
| Billing and limits | The capstone modeled a $50/month premium plan against estimated Workers, Durable Objects, LiveKit, R2, and hosted AI costs. It used 10/50 member limits and much larger storage assumptions. | The revival retains Stripe as a test-only demonstration, displays an illustrative $29/month Demo Pro price, and applies 10/50 member, 50/500 MB pooled storage, and 60/300 monthly call participant-minute limits. Downgrade retains existing people and content. The Financial Assessment documents the old and new calculations. |
| Deployment data | The capstone used its original account and workspace data stores. | The showcase starts with a fresh deployment and does not migrate old accounts or data. |
| Client boundary | The capstone's server behavior spans the web app and backend. | The web client uses a separate backend that can later serve a mobile client. No mobile app is included in this revival. |

### Related financial knowledge

[Financial Assessment](feasibility.md) explains the historical $50 model, the superseded paid-plan origin of $29, and the current Workers Free cost and capacity constraints. [Demo Billing & Limits](../features/demo-billing-limits/spec.md) defines plan behavior.

### Terms

* **Workspace:** shared context for a team and its membership.
* **Team role:** a team-scoped set of permissions assigned to one or more team members.
* **Channel:** organized location for workspace communication or content.
* **Room:** real-time conversation space that can include a call.
* **Thread:** discussion with posts or replies.
* **Page:** shared knowledge space that can include tasks.
* **Local-first:** interaction with locally available state that later reconciles with shared state.

## Source and revision

- Migrated from [Product Definition](https://linear.app/amr21/document/product-definition-8cd4775014cf), document ID `70c18dc9-9574-4ebf-97e9-631c8c1e4bb0`.
- Source revision: 2026-10-06T23:59:34.203Z; source author: Amr Yasser; last editor: Amr Yasser.
- Repository migration revision: `migration-draft-1`, 2026-10-09. The user confirmed preparation and placement in this chat. Approval of this rewritten repository revision and remote canonical-link cutover is pending.
- Existing decision/approval statements are source evidence, not new approvals or proof of implementation.
