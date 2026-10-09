# Documentation ownership, coverage and open questions

> **Migration revision approved.** User approved `migration-draft-1` in this chat on 2026-10-09. Revision `migration-draft-1`, 2026-10-09.

## Agreed migration

The user explicitly confirmed preparing the proposed repository documentation in this chat on 2026-10-09. Source and execution tracker: AMR21 workspace, permanent WODGE team (WDG). Destination: the existing AMR-21/Wodge repository. The intervening proposal to use Axxi was withdrawn; no cross-workspace copy or identifier migration is needed.

Repository Markdown is the selected canonical knowledge model. Linear retains delivery state, detailed implementation/deployment/maintenance work and execution evidence. The user approved the prepared repository content and proposed Linear reconciliation in this chat on 2026-10-09. This approves the migration revision, not implementation of unresolved proposals. Keep original Linear documents intact until the approved replacement revision is available remotely and its links/content have been verified. The reviewed supersession banners are approved conditionally on verified remote replacements; do not delete/archive content.

The root README remains a capstone introduction with the walkthrough, attribution and license. Its navigation addition does not claim the revival is implemented. Application README templates remain original implementation history; [local setup](setup.md) explains their limits.

## Coverage assessment

| Coverage | Canonical destination | Assessment / remaining evidence |
| --- | --- | --- |
| Product, discovery, feasibility | [Overview](../product/overview.md), [principles](../product/principles.md), [glossary](../product/glossary.md), [feasibility](../product/feasibility.md) | Existing people, goals, showcase constraints and historical financial calculations preserved. This is a migration, not renewed product discovery. No empty discovery document or new business case. |
| Feature behavior and acceptance | [Feature index](../README.md#features) | Eight source specifications split from UX; feature-scoped AC identifiers unchanged. Approved intent is distinguished from code evidence. |
| Domain and data | [Domain/invariants/lifecycles](../architecture/domain-model.md), [data ownership](../architecture/data-model.md) | Ownership, membership, invitations, roles, tasks, plans, calls and agent state preserved. Exact target schemas and unresolved byte/retention semantics are not invented. |
| UX, accessibility, prototypes | [Shared design](../README.md#design), feature design documents | Journeys and loading/empty/error/permission feedback preserved, with keyboard/text requirements. No standalone prototype asset was found; no new prototype or empty directory created. |
| Architecture, APIs, integrations | [Architecture](../architecture/overview.md), [data model](../architecture/data-model.md) | Separate backend and runtime/request boundaries retained. Detailed unspecified endpoint/schema contracts remain implementation decisions. |
| Stack and compatibility | [Stack](../architecture/tech-stack.md), [investigation](../architecture/compatibility-investigation.md) | Approved targets retained. Original investigation dated 2026-10-01 is partial; no current-provider/version verification or runtime pass is claimed. |
| Security and privacy | [Security](../architecture/security.md) | Backend authority, membership/role checks, revocation, secrets and test-billing controls preserved. Client discovery transport and historical credential-remediation evidence remain open. |
| Performance/reliability/scalability/cost | [Quality requirements](../architecture/non-functional-requirements.md), [feasibility](../product/feasibility.md) | Offline/recovery, accessibility and budget constraints retained. Measurable latency/load/SLO and cost-cap enforcement proof are not established. |
| Code structure and guidance | [Code structure](code-structure.md), [policy](engineering-policy.md) | Established package/dependency boundaries retained. Detailed patterns and root AGENTS.md are deferred to the owner/implementation; no agent-authored replacement or empty guidance document. |
| Local setup/tooling/workflow | [Setup](setup.md), [tooling](tooling.md), [workflow](workflow.md) | Current scripts separated from target commands. Windows/reproducibility and resolved dependency graph unverified. Existing work window is not extended. |
| CI/CD and environments | [CI/CD](../operations/ci-cd.md), [environments](../operations/environments.md) | Current deploy-on-main versus approved verification/manual gate mismatch explicit; cloud configuration and protection enforcement unverified. |
| Testing and validation | [Strategy](testing-strategy.md), conditional feature plans | Existing Vitest and target critical-journey Playwright strategy preserved. Integration/E2E-first, targeted unit/contract/security/accessibility/recovery evidence required by risk. No product tests were executed. |
| Operations/observability/recovery | [Observability](../operations/observability.md), [deployment coordination](../operations/runbooks/revival-deployment.md), [maintenance](../operations/maintenance.md) | Required failure/usage visibility and schema-aware rollback retained. Backup/restore, RPO/RTO, retention and support responsibilities remain gaps. |
| Release/versioning | [Release policy](../operations/release-policy.md) | Manual approval and commit/build identity retained. Named release is distinct from deployment; internal/public mode, initial version and engine configuration remain unresolved. |
| Planning and execution | [Workflow](workflow.md), conditional feature plan.md files, existing Linear issues | No SDLC restart, initiatives, new team, plans/changes directory, mapping file or per-feature maintenance plan. Cross-feature work stays in existing projects/issues. |
| Documentation synchronization | GitBook verification below | No verified repository connection. Missing setup does not block repository drafts. |

## Source preservation and approval limits

The inspection retrieved 65 Wodge documents: 46 current and 19 archived. The current seven navigation hubs are consolidated into [docs navigation](../README.md). Current substantive source content is transposed with document IDs, source update timestamps and source links. Domain summaries/invariants/lifecycles are consolidated; architecture persistence/deployment sections become data-model/environments. Repetitive architecture self-links are removed. Requirements, numeric limits and feature acceptance IDs are not silently changed.

The original implementation plan remains intact in Linear. Its shared approach, allocation, approval claims and phase context are retained in [workflow](workflow.md); detailed package descriptions, daily issue lists and per-issue dates remain in Linear rather than being maintained twice. The release plan's coordination and recovery content is retained in the shared deployment runbook. Conditional feature plans are approved editorial reorganizations of existing delivery intent.

Archived feature/UX redirects state “Status: Approved” and point to former Notion pages. Relevant claims are retained with their links in feature specifications; source comments returned no independent approval discussion for current documents/projects. Do not turn a redirect's approval label, an editor name, a timestamp or this migration confirmation into approval of later content or proof of implemented behavior. The original delivery plan says its revised issues/delivery case were approved; preserve that statement at its source revision without inventing a signature or extending it.

Three Mermaid diagrams across Architecture and Domain Model are retained as text. The root walkthrough link and linked graduation PDF in the financial assessment are retained. No uploaded issue attachments were returned. External Notion/report assets were not downloaded or claimed verified.

## Historical content

Nineteen archived documents and thirty archived issues remain intact. Historical duplicate/redirect documents are not promoted into new requirements. In particular, old Stripe-removal, RealtimeKit, Radix and group/moderator directions must not override the current retained test billing, Calls/SFU, Base UI and additive team-role decisions. The historical resource-library project is canceled/trashed; current attachments and page links remain in scope.

Three archived source documents (Scope & Product Constraints, Target Architecture, Delivery & Review Rules) remain truncated even through both get-document and fetch reads. Six archived issue descriptions are also truncated. Their originals remain intact in Linear; this migration cannot claim a complete independent historical export. No truncated historical text is used to reconstruct missing requirements.

The archived credential-remediation issue [WDG-5](https://linear.app/amr21/issue/WDG-5) retains an In Progress status and a single `@codex` comment. No rotation/completion evidence was returned. This migration neither exposes credential values nor executes credential rotation.

## Open questions and unresolved proof

| ID | Finding | Treatment |
| --- | --- | --- |
| GAP-01 | Official MCP authorization remains selected, but compliant CIMD discovery transport on Workers is not proven; managed registration or dynamic fallback is not selected. | Preserve Decision 005 and the partial investigation; resolve before the affected executable OAuth increment. No security fallback chosen. |
| GAP-02 | Target dependency graph, TypeScript/tool/compiler API compatibility, Worker sessions, Yjs persistence and SFU calls lack runtime evidence. | Keep existing implementation/evidence issues; no success claimed. Provider statements remain dated source findings. |
| GAP-03 | Current deployment runs on push to main; the approved target requires full verification and manual approval. | Existing WDG-162/163 handle implementation. This docs-only migration leaves executable CI unchanged. |
| GAP-04 | $5 preferred / $10 maximum monthly operating budget is an approved constraint; product quotas cannot guarantee an account-wide provider spending cap. | Preserve financial history and usage requirements. Do not claim a configured billing cap or free-plan feasibility pass. |
| GAP-05 | Source approval labels do not provide independent signed approving revisions; some historical reads are truncated and Notion/report access is unverified. | Retain original links and claims, mark limitations, and keep originals. |
| GAP-06 | Detailed code conventions and repository agent instructions are owner-deferred. | Preserve existing WDG-173/174 scope; do not settle through documentation migration. |
| GAP-07 | October 4–11 targets coexist with a current Backlog execution snapshot. | Record historical window and current state; no automatic date shifts, completion claims or new estimates. |
| GAP-08 | Quantitative performance/SLO, backup/restore, RPO/RTO, retention and support/maintenance responsibilities are not settled. | Explicit gaps; no invented targets or ongoing allocation. |
| GAP-09 | Release mode, initial version, pre-1.0 rules and release-engine setup are not verified. | Preserve approval boundary and separate named releases from deployment. |
| GAP-10 | GitBook has no verified Wodge repository/branch/path synchronization. | Prepare repository drafts; leave setup/publication untouched. |

## GitBook verification

On 2026-10-09 the existing authenticated browser session could access the AMR21 GitBook organization. The visible AMR21 Docs site was unpublished, displayed authenticated audience access and “Git Sync — Set up”, and listed one Untitled space. Organization home likewise showed that site and space. This establishes access to those visible surfaces, not a configured Wodge repository sync or broader member permissions.

No Wodge repository, branch, documentation folder, synchronization direction or multi-user sharing capability was verified. No GitBook configuration file was found in this repository. Do not assume `main`/`docs/` is already synchronized, create another site, change visibility or publish. If a connection is later verified, reuse it and record actual repository/branch/path/direction/access. Repository work can proceed without it.

## Verification and cutover procedure

Review the repository draft and concrete external change summary. Check content, relative links, feature AC preservation, diagram text and coverage gaps. Detailed Linear work should receive only approved source-link edits, keeping identity, ownership, statuses, comments, evidence and dependencies untouched.

The replacement files need an approved immutable repository revision available remotely before Linear links can claim a verified canonical cutover. Repository push requires the user's separate exact-command confirmation and remote-divergence check; approval of these drafts does not authorize pushing. Read back remote replacements before adding supersession notices. Old documents stay intact.

No tests, builds, migrations, production operations, commits, pushes, publication, issue changes or supersession notices were executed as part of preparing this draft.
