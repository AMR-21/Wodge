---
description: "Release readiness, approval evidence, and rollback expectations."
icon: flag-checkered
---

# Release policy

## Deployment and named release

A deployment is identified by the reviewed commit SHA/build ID. A named release is a separate meaningful checkpoint and requires explicit human approval before a tag or release is created. The plugin baseline requires SemVer; project-specific internal/public release mode, initial release version, pre-1.0 behavior and automated release engine configuration are not settled by the inspected Wodge records. Those remain discussion gaps rather than invented choices.

## Retained release gates

The [revival deployment coordination](runbooks/revival-deployment.md) retains required automated checks, manual provider/accessibility QA, cost/usage review, deployment approval, deployed smoke and recovery checks. Preserve the existing [WDG-58](https://linear.app/axxi-labs/issue/WDG-58/complete-revival-validation-manual-qa-and-approved-release) release parent and its execution issues: [WDG-167](https://linear.app/axxi-labs/issue/WDG-167/run-final-automated-and-cross-feature-validation) for automated validation, [WDG-168](https://linear.app/axxi-labs/issue/WDG-168/complete-manual-provider-call-and-accessibility-qa) for manual QA, [WDG-169](https://linear.app/axxi-labs/issue/WDG-169/prepare-release-evidence-and-request-deployment-approval) for release evidence and approval, and [WDG-170](https://linear.app/axxi-labs/issue/WDG-170/deploy-after-approval-and-record-deployed-smoke-results) for approved deployment and smoke results. A planned date, document approval or green local check cannot establish release readiness.

The root [CHANGELOG](../../CHANGELOG.md) has no entries in the inspected checkout. No release version or deployment approval was recorded in the original release plan. Record actual changed scope, compatibility consequences, validation evidence, approval, commit/build ID and deployment outcome when they exist. Do not fabricate a version, executed result, release history or approval.

Documentation-only changes under `docs/` skip application CI/CD according to the [documentation-only policy](ci-cd.md#documentation-only-changes). They do not trigger an application release or deployment. Mixed documentation and application changes retain the normal release gates.

## Evidence and publication

[Decision 006](../decisions/006-verification-release-control.md) preserves the approved verification/deployment boundary. [Engineering policy](../development/engineering-policy.md) preserves plugin release controls. Publishing GitBook, pushing source, merging code, creating tags/releases and sending announcements remain separate authorized operations.
