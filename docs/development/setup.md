---
description: "Local setup and current commands, separated from revival targets."
icon: terminal
---

# Local setup and current commands

## Capstone checkout

This describes checked-in configuration, not a verified working installation. The current baseline is `d875c2d369f2bed15ba4e7257242131fddcbfa0a`. The foundation toolchain declares Node.js >=22.19 and pnpm 9.4.0; `.node-version` selects Node 24.19.0. The [root README](../../README.md) preserves the walkthrough, team attribution, license and capstone setup instructions.

1. Install the declared package manager and project dependencies in an appropriate local environment.
2. Copy the tracked example environment configuration into private application-local files and configure only the services needed for the intended local workflow. Never commit real values.
3. The existing `pnpm init:app` generates Drizzle artifacts, applies local D1 migrations and creates PartyKit state. Review it before executing; it changes local data.
4. Existing `pnpm dev` starts Turborepo development services; `pnpm livekit` is the separate local call server command.

Existing scripts also include `build`, `lint`, `generate`, `migrate:local`, and `studio`. These script definitions were inspected; installation, generation, migrations, services and builds were not run in this migration.

The security cleanup preserves the original premium editor packages and integrations. Tracked
registry configuration contains no authentication assignment. Configure any
required private registry access outside tracked files. The
[security cleanup evidence](security-evidence.md) records the final checks
and redacted history findings.

The [application baseline](baseline.md) records executed install, build, test, lint,
type-check and startup results at the reviewed checkout, with a
[failure inventory](failure-inventory.md) and reusable
[smoke-test matrix](smoke-test-matrix.md).

## Constraints and target setup

Current setup retains Next-on-Pages, PartyKit, Supabase and LiveKit. Secret-export CLI integration has been removed from configuration and scripts. It is not the final revival setup. [Tooling](tooling.md) preserves the target command contract and [environments](../operations/environments.md) the proposed Workers bindings. The foundation evidence records selected foundation dependencies and their actual validation; the retained web adapter migration remains separate work.

The existing setup uses Linux-style file commands, including destructive reset scripts. Windows compatibility is not established. Use the declared Node >=22.19 baseline for foundation tooling.

## Evidence

[Root scripts](../../package.json), [web scripts](../../apps/web/package.json), [backend scripts](../../apps/backend/package.json), [data package](../../packages/data/package.json), and [workspace configuration](../../pnpm-workspace.yaml).

## Local configuration and deployed secrets

Copy `.env.example` to `apps/web/.env.local`, `apps/web/.dev.vars` (Pages local
bindings), and `apps/backend/.env` (retained PartyKit local development). Supply
only development values; those files are ignored. The foundation Worker uses
explicit local D1 and Durable Object bindings from
`apps/backend/wrangler.foundation.jsonc`; it does not require application secrets.

Deployment remains manually authorized. Configure deployed secrets directly with
the hosting provider using its secret management; do not export production values
into local web files. `deploy:app` no longer pulls secrets, rewrites environment
files, or passes `--with-vars` to PartyKit. Public `NEXT_PUBLIC_*` build values
remain distinct from server-only secrets. No remote secrets or resources were
changed as part of this removal.

The [backend foundation evidence](backend-foundation.md) records the current
package boundaries, pinned dependencies, local Worker checks, and unresolved
private-registry/full-application gates.
