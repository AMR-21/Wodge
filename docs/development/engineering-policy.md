---
description: "Engineering expectations, ownership, and validation policy."
icon: clipboard-check
---

# Engineering policy

This baseline is part of the plugin's approved operating model. A project's canonical Organization Policy may add stricter rules. `DEFAULT` rules may be overridden only with documented rationale and approval. `MANDATORY` rules require organization-policy change, not a project-level exception.

| ID | Classification | Rule |
|---|---|---|
| POL-SEC-001 | MANDATORY | Never commit secrets to source control. Use approved configuration/secret mechanisms. |
| POL-CODE-001 | MANDATORY | Respect SOLID principles in design and implementation, applied pragmatically rather than by manufacturing unnecessary abstractions. |
| POL-CODE-002 | MANDATORY | Apply DRY to duplicated knowledge/logic: search for and reuse existing implementation first; do not force unrelated concepts into a shared abstraction merely because code looks similar. |
| POL-QUAL-001 | MANDATORY | Use formatter, linter, and type/static checking where the chosen stack supports them; project tooling defines the exact tools. |
| POL-WORK-001 | DEFAULT | Use trunk-based development with short-lived branches. |
| POL-WORK-002 | DEFAULT | Use worktrees or equivalent isolation for concurrent changes that may conflict. |
| POL-REVIEW-001 | DEFAULT | Require human merge approval after configured CI/review gates; repositories may explicitly opt into autonomous merge. |
| POL-DEPS-001 | DEFAULT | Reuse existing dependencies first; prefer mature maintained libraries over custom implementation when dependency cost is justified. |
| POL-DEPS-002 | MANDATORY | Major/core/security-sensitive dependency additions or replacements require explicit human approval. |
| POL-DEPS-003 | DEFAULT | Use supported stable versions and deliberate upgrades rather than automatically chasing latest releases. |
| POL-TEST-001 | DEFAULT | Use confidence-first, integration-oriented, risk-based testing: integration tests primary, E2E for critical journeys, unit tests for complex isolated logic, contract tests for meaningful boundaries. |
| POL-TEST-002 | MANDATORY | Coverage percentage is diagnostic, not a delivery target. Do not add low-value tests solely to increase coverage. |
| POL-TEST-003 | DEFAULT | Add practical regression coverage for meaningful bugs when an automated test can prevent recurrence. |
| POL-SEC-002 | MANDATORY | Enforce permission-sensitive behavior at the authoritative backend/system boundary; UI hiding is not authorization. |
| POL-RELEASE-001 | MANDATORY | Deployment and named release are distinct. Named releases use the approved SemVer release engine and require human approval before tag/release creation. |
| POL-AI-001 | MANDATORY | AI/agents must not silently alter material approved decisions or bypass required approval gates. |
| POL-AI-002 | MANDATORY | Agents must report external tool/action failures accurately and never claim an unverified write succeeded. |



This policy specifies requirements for execution agents. The plugin itself defines/records policies and plans; it does not merge, execute tests, deploy, tag, or release.


## Wodge-specific controls

The user confirmed using the updated Software Engineering plugin for this migration. The table above reproduces that plugin's policy baseline, including mandatory versus overridable default classifications. Existing Wodge constraints remain: exact-command confirmation before any push; remote divergence checks; no force push without explicit instruction; owner-authored AGENTS.md; manual deployment and named-release authorization. Detailed conventions remain deferred to implementation. A documentation migration does not select new owners, deadlines, monitoring services or dependencies.

## Provenance

Software Engineering plugin version 0.2.0, `shared/default-organization-policy.md`, read during this migration. [Workflow](workflow.md), [code structure](code-structure.md), [security](../architecture/security.md) and [testing strategy](testing-strategy.md) retain project-specific source decisions.
