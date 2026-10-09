# Release policy

## Deployment and named release

A deployment is identified by the reviewed commit SHA/build ID. A named release is a separate meaningful checkpoint and requires explicit human approval before a tag or release is created. The plugin baseline requires SemVer; project-specific internal/public release mode, initial release version, pre-1.0 behavior and automated release engine configuration are not settled by the inspected Wodge records. Those remain discussion gaps rather than invented choices.

## Retained release gates

The [revival deployment coordination](runbooks/revival-deployment.md) retains required automated checks, manual provider/accessibility QA, cost/usage review, deployment approval, deployed smoke and recovery checks. Preserve the existing WDG-58 release parent and WDG-167–170 execution issues. A planned date, document approval or green local check cannot establish release readiness.

The root [CHANGELOG](../../CHANGELOG.md) has no entries in the inspected checkout. No release version or deployment approval was recorded in the original release plan. Record actual changed scope, compatibility consequences, validation evidence, approval, commit/build ID and deployment outcome when they exist. Do not fabricate a version, executed result, release history or approval.

## Evidence and publication

[Decision 006](../decisions/006-verification-release-control.md) preserves the approved verification/deployment boundary. [Engineering policy](../development/engineering-policy.md) preserves plugin release controls. Publishing GitBook, pushing source, merging code, creating tags/releases and sending announcements remain separate authorized operations.
