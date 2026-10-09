# CI/CD and deployment gates

> **Migration revision approved.** User approved `migration-draft-1` in this chat on 2026-10-09. Prepared 2026-10-09 as `migration-draft-1`. Source decisions retain their recorded status; the repository revision is approved; external cutover awaits verified remote replacement links.

## Current configuration

[The checked-in workflow](../../.github/workflows/deploy.yml) deploys PartyKit backend changes on push to `main`. It installs dependencies and invokes PartyKit deployment. It does not implement the approved complete lint/format/type/test/build gates or manual deployment approval. This migration does not change that executable workflow.

## Approved target

GitHub Actions must check lint, formatting, types, tests and builds before manually approved Cloudflare deployment. The [tooling contract](../development/tooling.md) supplies the intended commands; [testing strategy](../development/testing-strategy.md) supplies evidence requirements. Separate web/backend deployment units require correct D1/R2/SQLite Durable Object bindings, trusted origins, callbacks and server-only provider secrets.

Reuse [WDG-162](https://linear.app/amr21/issue/WDG-162) for verification checks and [WDG-163](https://linear.app/amr21/issue/WDG-163) for replacing automatic deployment. Preserve their current scope, status and blockers. Passing CI does not authorize a push or deployment.

## Approval and recovery

Show the exact push command and wait for explicit confirmation. Check remote movement before pushing; report remote-only commits rather than force pushing. Deployment requires separate manual approval and reviewed commit/build identity. [Revival deployment coordination](runbooks/revival-deployment.md) retains preflight, smoke and schema-aware recovery requirements.

Repository protection settings, active cloud bindings, installed secrets, remote CI runs and enforcement capabilities have not been verified. Do not mark a pipeline or protection gate implemented from this document.

## Sources

[Decision 006](../decisions/006-verification-release-control.md), [workflow](../development/workflow.md), [environments](environments.md), and [original release plan](runbooks/revival-deployment.md).
