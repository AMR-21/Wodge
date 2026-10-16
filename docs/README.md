---
description: "Your starting point for Wodge’s product, architecture, design, features, development, operations, and decisions."
icon: house
layout:
  width: default
  outline:
    visible: false
---

# Wodge documentation

Wodge is a local-first collaborative workspace and portfolio revival. This documentation preserves existing product and engineering knowledge; it does not restart the SDLC or claim the revival has been delivered.

## Important notes

<table data-view="cards">
  <thead><tr><th width="48"></th><th></th><th></th><th data-hidden data-card-target data-type="content-ref"></th></tr></thead>
  <tbody>
    <tr><td><i class="fa-circle-info"></i></td><td><strong>Status and authority</strong></td><td>Distinguish the implemented baseline, approved revival intent, and unverified work.</td><td><a href="#status-and-authority">Status and authority</a></td></tr>
    <tr><td><i class="fa-clipboard-question"></i></td><td><strong>Coverage and open questions</strong></td><td>Find unresolved engineering gaps and the evidence still needed.</td><td><a href="development/documentation.md">Coverage and open questions</a></td></tr>
    <tr><td><i class="fa-terminal"></i></td><td><strong>Local setup</strong></td><td>Use the checked-in commands and understand the target tooling.</td><td><a href="development/setup.md">Local setup</a></td></tr>
    <tr><td><i class="fa-flag-checkered"></i></td><td><strong>Release policy</strong></td><td>Check readiness, required approval evidence, and rollback expectations.</td><td><a href="operations/release-policy.md">Release policy</a></td></tr>
  </tbody>
</table>

## Explore the documentation

<table data-view="cards">
  <thead><tr><th width="48"></th><th></th><th></th><th data-hidden data-card-target data-type="content-ref"></th></tr></thead>
  <tbody>
    <tr><td><i class="fa-compass"></i></td><td><strong>Product</strong></td><td>Purpose, principles, vocabulary, and feasibility.</td><td><a href="product/README.md">Product</a></td></tr>
    <tr><td><i class="fa-diagram-project"></i></td><td><strong>Architecture</strong></td><td>Runtime, data models, security, and quality requirements.</td><td><a href="architecture/README.md">Architecture</a></td></tr>
    <tr><td><i class="fa-palette"></i></td><td><strong>Design</strong></td><td>UX principles, navigation, visual foundations, and shared patterns.</td><td><a href="design/README.md">Design</a></td></tr>
    <tr><td><i class="fa-shapes"></i></td><td><strong>Features</strong></td><td>Behavior and design across Wodge’s eight documented features.</td><td><a href="#features">Features</a></td></tr>
    <tr><td><i class="fa-code"></i></td><td><strong>Development</strong></td><td>Local setup, engineering guidance, tooling, and validation.</td><td><a href="development/README.md">Development</a></td></tr>
    <tr><td><i class="fa-server"></i></td><td><strong>Operations</strong></td><td>Environments, release gates, observability, and maintenance.</td><td><a href="operations/README.md">Operations</a></td></tr>
    <tr><td><i class="fa-scale-balanced"></i></td><td><strong>Decisions</strong></td><td>Current engineering scope and implementation boundaries.</td><td><a href="decisions/README.md">Decisions</a></td></tr>
  </tbody>
</table>

## Status and authority

Only [AMR21 / Wodge Revival & Enhancements](https://linear.app/amr21/project/wodge-revival-and-enhancements-ee86a6345a5d) governs active delivery.
The [current scope and evidence rules](development/documentation.md) distinguish
retained implementation, necessary portfolio migrations, and deferred modernization.

The working application retains Next.js/Tailwind/Radix and its existing product
behavior. Backend PartyServer/Better Auth/D1 and minimal member-controlled MCP
are current migration goals. Calls and hosted generation are to be disabled;
broader framework/tooling/UI redesign and call restoration are deferred.

Use the [foundation record](development/backend-foundation.md) and
[baseline](development/baseline.md) for actual local observations and limitations.

## Product

- [Product overview](product/overview.md)
- [Principles and non-goals](product/principles.md)
- [Glossary](product/glossary.md)
- [Portfolio operating-cost boundary](product/feasibility.md)

## Architecture

- [Architecture and request flows](architecture/overview.md)
- [Technology stack: baseline versus target](architecture/tech-stack.md)
- [Domain model, invariants and lifecycles](architecture/domain-model.md)
- [Persistence and data ownership](architecture/data-model.md)
- [Security](architecture/security.md)
- [Non-functional requirements](architecture/non-functional-requirements.md)
- [Partial compatibility investigation](architecture/compatibility-investigation.md)

## Design

- [UX principles](design/ux-principles.md)
- [Navigation and information architecture](design/navigation.md)
- [Design system](design/design-system.md)
- [Shared interaction patterns](design/shared-patterns.md)

## Features

Each feature page describes its current portfolio scope and retained UI. The project scope governs delivery.

| Feature                      | Requirements                                   | Design                                             | Delivery approach                             |
| ---------------------------- | ---------------------------------------------- | -------------------------------------------------- | --------------------------------------------- |
| Workspace Setup & Membership | [spec](features/workspace-membership/spec.md)  | [design](features/workspace-membership/design.md)  | Existing Linear issues + shared process       |
| Teams & Shared Spaces        | [spec](features/teams-shared-spaces/spec.md)   | [design](features/teams-shared-spaces/design.md)   | Existing Linear issues + shared process       |
| Team Roles & Access          | [spec](features/team-roles-access/spec.md)     | [design](features/team-roles-access/design.md)     | Existing Linear issues + shared process       |
| Agent Access                 | [spec](features/agent-access/spec.md)          | [design](features/agent-access/design.md)          | [plan](features/agent-access/plan.md)         |
| Discussions & Messaging      | [spec](features/discussions-messaging/spec.md) | [design](features/discussions-messaging/design.md) | Existing Linear issues + shared process       |
| Room Calls                   | [spec](features/room-calls/spec.md)            | [design](features/room-calls/design.md)            | [plan](features/room-calls/plan.md)           |
| Pages & Embedded Tasks       | [spec](features/pages-embedded-tasks/spec.md)  | [design](features/pages-embedded-tasks/design.md)  | [plan](features/pages-embedded-tasks/plan.md) |
| Demo Billing & Limits        | [spec](features/demo-billing-limits/spec.md)   | [design](features/demo-billing-limits/design.md)   | Existing Linear issues + shared process       |

The linked delivery pages describe only the current scoped increments. They do not authorize broader redesign or remote deployment.

## Development and operations

- [Engineering policy](development/engineering-policy.md)
- [Code structure and deferred owner decisions](development/code-structure.md)
- [Local setup](development/setup.md)
- [Tooling](development/tooling.md)
- [Development and delivery workflow](development/workflow.md)
- [Testing strategy](development/testing-strategy.md)
- [Documentation ownership, engineering coverage and gaps](development/documentation.md)
- [Environments and runtime topology](operations/environments.md)
- [CI/CD and approval gates](operations/ci-cd.md)
- [Observability](operations/observability.md)
- [Release policy and open release decisions](operations/release-policy.md)
- [Shared revival deployment coordination](operations/runbooks/revival-deployment.md)
- [Maintenance and feedback](operations/maintenance.md)

## Decisions

- [Decision 001 — Separate backend for multiple clients](decisions/001-separate-backend.md)
- [Decision 002 — Structured and text collaboration](decisions/002-structured-text-collaboration.md)
- [Decision 003 — Member-provided agents](decisions/003-member-provided-agents.md)
- [Decision 004 — Direct Workers realtime runtime](decisions/004-direct-workers-runtime.md)
- [Decision 005 — Official MCP authorization](decisions/005-official-mcp-authorization.md)
- [Decision 006 — Verification and release control](decisions/006-verification-release-control.md)
- [Decision 007 — Remove standalone resource libraries](decisions/007-remove-resource-libraries.md)

## Preservation and review

The original Linear documents remain intact. Migrated substantive files retain source IDs/update timestamps and approval limits. Architecture and domain Mermaid diagrams remain editable text; the walkthrough and graduation-report reference remain linked. Detailed work packages are not copied into a parallel repository issue tracker.

The inspection covered 65 Wodge documents (46 current, 19 archived), 12 projects (nine current), and 174 issues (128 current Backlog, 16 current Canceled, 30 archived). The returned blocker graph had 553 edges with no missing issue references or cycles. These are inspection facts, not execution completion.

[Coverage and open questions](development/documentation.md) explains truncated historical reads, unverified external assets, incomplete provider/runtime evidence and absent GitBook connection. GitBook setup does not block these repository drafts. No source or Linear push/publication/write is authorized by this index.

## Original navigation provenance

The former Start Here, Product, Domain, Features, Design, Engineering, and Decisions hubs are consolidated here. Their originals are not changed or deleted.
