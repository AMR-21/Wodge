# Maintenance and feedback

> **Migration revision approved.** User approved `migration-draft-1` in this chat on 2026-10-09. Prepared 2026-10-09 as `migration-draft-1`. Source decisions retain their recorded status; the repository revision is approved; external cutover awaits verified remote replacement links.

## Existing commitment

The revival is a portfolio showcase with no committed ongoing active-maintenance allocation. Do not create an on-call rotation, monitoring subscription, retention job, per-feature maintenance plan or service-level commitment from this migration.

## Intake and ownership

The [development workflow](../development/workflow.md) retains independent Product: Wodge triage, duplicate checking, routing into matching active delivery scope or a bounded follow-up, and preserving completed revival projects. WDG-171/WDG-172 are finite intake setup and verification work, not parents for every future incident. Their configuration and runtime behavior remain unverified.

## Ongoing safeguards already required

[Observability](observability.md) defines safe failure context, usage visibility and the operator workspace-creation pause. [Financial assessment](../product/feasibility.md) records budget and provider free-plan constraints. [Deployment recovery](runbooks/revival-deployment.md#recovery) requires schema/state compatibility before code rollback. These are recorded requirements, not demonstrated operating capabilities.

## Gaps requiring discussion

No verified backup/restore procedure, RPO/RTO, retention/deletion schedule for operational data, alert delivery, support coverage or dependency-update cadence was found. Existing data-preserving departure/downgrade rules remain binding. Resolve operational needs proportionally before introducing new recurring responsibilities; do not silently treat them as unnecessary.

Requirements-changing findings return to Specify, delivery changes to Plan, and authorized affected issue updates to Task. Existing issue comments, status, ownership, evidence and unrelated dependencies remain intact.
