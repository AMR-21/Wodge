---
description: "The delivery workflow, approvals, and execution tracking."
icon: code-branch
---

# Development and delivery workflow

## Delivery window

The approved revival delivery window is October 4–11, 2026, with weekday work after work. No further allocation or ongoing active maintenance has been committed.

## Confirmed scope

Work revives the existing code with approved behavior and stack changes. The public showcase includes every retained major capability, including calls and Stripe test billing. A future mobile app is outside this delivery scope.

## Knowledge and decisions

Repository documentation is the selected destination for approved product and engineering knowledge. During the migration, old Linear documents remain available and repository files are review drafts. Canonical source cutover occurs only after the repository revision is approved, remotely available and verified. Linear owns detailed delivery work and execution evidence. Unconfirmed information is not entered as an approved decision.

## Deferred implementation decisions

Detailed code structure, design patterns, and coding rules will be decided during implementation. The project owner will write `AGENTS.md`; agent-generated repository guidance is excluded from the current documentation work. The approved architecture, stack, security, tooling, workflow, and testing constraints remain applicable.

## Repository push control

Before any remote push, show the exact command and wait for explicit confirmation. Check remote movement before pushing to the original branch. Remote-only commits require reporting divergence rather than force pushing. A Codex worktree targets its original base branch unless a separate branch or PR was explicitly requested.

## Implementation and review flow

After verified cutover, approved work proceeds from its linked canonical repository revision and existing Linear task to implementation, targeted validation, code review, manual QA, and human-approved release. The Software Engineering System defaults to short-lived, focused branches and meaningful commits; concurrent changes require isolation.

## Product identity and project completion

Use the permanent Wodge product team and Product: Wodge labels on Wodge issues and projects. The nine revival projects are bounded delivery work: complete each after its approved acceptance criteria and validation are satisfied and every scoped issue and sub-issue is resolved.
Future maintenance reports enter native Triage as independent Product: Wodge issues without a delivery project initially. Check for duplicates, classify the finding, and route accepted work to an active project whose approved scope includes it, a standalone issue, or a new bounded follow-up project. Completed revival projects stay closed. Future reports are not sub-issues of the finite maintenance-intake setup task.
After completion and the configured inactivity period, eligible projects and issues archive automatically. Configure automatic archiving in the Wodge team's Issue statuses & automations settings. Archive eligibility depends on closed issues, sub-issues, projects, and cycles; unresolved work must be resolved on its merits before closure.

## CI gates

The approved GitHub Actions workflow checks lint, formatting, types, tests, and builds. Automated integration coverage uses Vitest; critical browser journeys use Playwright. Failures block progression to the release step.
CI approval is distinct from remote-push confirmation and production deployment approval.

## Deployment authority

Cloudflare deployment requires manual approval after the required checks. Application runtime secrets reside in Cloudflare. Passing checks does not itself authorize a push, merge, or deployment.

## Current automation

The audited main-branch workflow deploys only PartyKit backend changes on push to main. It does not implement the approved full verification workflow or the new manually approved deployment.
[.github/workflows/deploy.yml](<https://github.com/AMR-21/Wodge/blob/d875c2d369f2bed15ba4e7257242131fddcbfa0a/.github/workflows/deploy.yml>)

## References

[Product Definition](../product/overview.md)
[Tech Stack](../architecture/tech-stack.md)

## Retained delivery approach

Revive the existing code with the approved stack changes and retained capabilities. The approved work window is October 4–11, 2026, with weekday work after work. No hourly estimate or later extension has been approved.

## Implementation ownership

Detailed code structure, design patterns, and coding rules are deferred to implementation. The project owner will write `AGENTS.md`. The migration sequence is governed by the approved architecture and engineering constraints, without treating the deferred conventions as completed prerequisites.



The source plan records 55 independent issues and 59 sub-issues within 14 coordinated deliverables, with owner approval of the revised delivery case. Preserve that historical decomposition and its original source revision; it is not a new estimate. Current Linear remains the authority for the actual issue set, statuses, owners, dates and blocking edges.

The retained sequence is foundation/toolchain and separate backend; web/UI/authentication; PartyServer and synchronization; role-based domain behavior; pages/tasks and discussions; provider calls, limits and agent access; verification and manually approved deployment. These groups describe the existing approach, not a new dependency graph. Existing issue blockers govern execution; this migration changes no edges.

The October 4–11, 2026 target schedule remains a historical approved planning window, with weekday work after work. As inspected on October 9, current executable issues remain Backlog. Dates are not completion evidence, a capacity claim, or authorization to extend the window. Daily targets and exact package checklists remain in Linear and the unchanged source plan rather than a second maintained repository task list.

Cross-feature work stays in Wodge Engineering and links shared engineering documents. Feature delivery approach files exist only for complex agent authorization, collaborative pages/tasks and call migration. Remaining feature plans are supplied by their existing issues plus shared processes.

[WDG-171](https://linear.app/amr21/issue/WDG-171) and [WDG-172](https://linear.app/amr21/issue/WDG-172) cover maintenance intake setup separately from release. Neither is turned into an ongoing maintenance commitment or release blocker.

## Cutover change

The source's statement that Linear Team Documents own knowledge is intentionally superseded by the user's confirmed repository documentation model. This is a documentation ownership change, not a product or architecture change. Old documents are retained; any supersession notice needs separate approval and verified replacement links.

## Source and revision

[Development Workflow](https://linear.app/amr21/document/development-workflow-8f1cc56c6c45), ID `c3c2fb92-ce17-406a-aa0d-99a4cf26d57e`, last updated 2026-10-06T23:57:54.714Z by Amr Yasser. Migration is editorial; existing approval statements are preserved claims, not new approvals or execution evidence.


## Source and revision

[Implementation Plan — Wodge Revival](https://linear.app/amr21/document/implementation-plan-wodge-revival-adfe59e91282), ID `aae19ea8-7ecc-4144-bd91-560f54be68cd`, last updated 2026-10-07T00:21:59.077Z by Amr Yasser. Migration is editorial; existing approval statements are preserved claims, not new approvals or execution evidence.
