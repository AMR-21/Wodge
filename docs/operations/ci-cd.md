---
description: "Recorded pipeline behavior, approved gates, and gaps in enforcement."
icon: code-branch
---

# CI/CD and deployment gates

## Current configuration

[The checked-in workflow](../../.github/workflows/deploy.yml) is configured to deploy PartyKit backend changes on push to `main`. It installs dependencies and invokes PartyKit deployment. It does not implement the approved complete lint/format/type/test/build gates, documentation-only exclusion or manual deployment approval. The owner reports that CD is stopped; its remote disabled state has not been independently verified. Updating this policy does not change the executable workflow.

## Documentation-only changes

CI/CD must always skip pull requests and changes whose changed files are all under `docs/`. This applies to pull requests, pushes and their merge commits. Documentation-only changes must not run application lint, formatting, type checks, tests, builds, releases or deployments. GitBook Git Sync remains independent of application CI/CD.

| Changed files | Required behavior |
| --- | --- |
| Only `docs/**`, including additions, edits and deletions | Skip application CI/CD. |
| `docs/**` together with any path outside `docs/` | Run the normal checks for the application change; deployment still requires approval. |
| Any path outside `docs/` | Apply the normal pipeline policy. Root files such as `gitbook-docs.yaml` are outside this exemption. |

Determine the scope from the complete change set, including both paths of a rename. A move into or out of `docs/` is not documentation-only. Reviewers still check documentation accuracy, navigation and links; a skipped pipeline is not approval evidence or proof that requirements have shipped.

When revisiting the pipeline, apply the exclusion to every application CI/CD entry point. Non-required workflows can use `paths-ignore: ['docs/**']` for both pull-request and push events. GitHub leaves required checks pending when an entire required workflow is skipped by a path filter, so required workflows need a lightweight scope check that succeeds for documentation-only changes and skips all application jobs. This scope check must not trigger a build or deployment. See [GitHub's path-filter rules](https://docs.github.com/en/actions/reference/workflows-and-actions/workflow-syntax#onpushpull_requestpull_request_targetpathspaths-ignore).

This is the approved policy; enforcement remains outstanding in the checked-in workflow. Reconcile the affected verification and deployment work through the existing WDG-162 and WDG-163 issues below.

## Approved target

For changes outside the documentation-only exemption, GitHub Actions must check lint, formatting, types, tests and builds before manually approved Cloudflare deployment. The [tooling contract](../development/tooling.md) supplies the intended commands; [testing strategy](../development/testing-strategy.md) supplies evidence requirements. Separate web/backend deployment units require correct D1/R2/SQLite Durable Object bindings, trusted origins, callbacks and server-only provider secrets.

Reuse [WDG-162](https://linear.app/axxi-labs/issue/WDG-162/configure-github-actions-verification-checks) for verification checks and [WDG-163](https://linear.app/axxi-labs/issue/WDG-163/replace-automatic-deployment-with-manual-cloudflare-approval) for replacing automatic deployment. Preserve their current scope, status and blockers. Passing CI does not authorize a push or deployment.

## Approval and recovery

Show the exact push command and wait for explicit confirmation. Check remote movement before pushing; report remote-only commits rather than force pushing. Deployment requires separate manual approval and reviewed commit/build identity. [Revival deployment coordination](runbooks/revival-deployment.md) retains preflight, smoke and schema-aware recovery requirements.

Repository protection settings, active cloud bindings, installed secrets, remote CI runs and enforcement capabilities have not been verified. Do not mark a pipeline or protection gate implemented from this document.

## Sources

[Decision 006](../decisions/006-verification-release-control.md), [workflow](../development/workflow.md), [environments](environments.md), and [original release plan](runbooks/revival-deployment.md).
