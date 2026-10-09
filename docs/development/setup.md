# Local setup and current commands

> **Migration revision approved.** User approved `migration-draft-1` in this chat on 2026-10-09. Prepared 2026-10-09 as `migration-draft-1`. Source decisions retain their recorded status; the repository revision is approved; external cutover awaits verified remote replacement links.

## Capstone checkout

This describes checked-in configuration, not a verified working installation. The current baseline is `d875c2d369f2bed15ba4e7257242131fddcbfa0a`. Root configuration declares Node.js >=18 and pnpm 9.4.0. The [root README](../../README.md) preserves the walkthrough, team attribution, license and capstone setup instructions.

1. Install the declared package manager and project dependencies in an appropriate local environment.
2. Copy the tracked example environment configuration into private application-local files and configure only the services needed for the intended local workflow. Never commit real values.
3. The existing `pnpm init:app` generates Drizzle artifacts, applies local D1 migrations and creates PartyKit state. Review it before executing; it changes local data.
4. Existing `pnpm dev` starts Turborepo development services; `pnpm livekit` is the separate local call server command.

Existing scripts also include `build`, `lint`, `generate`, `migrate:local`, and `studio`. These script definitions were inspected; installation, generation, migrations, services and builds were not run in this migration.

## Constraints and target setup

Current setup includes Next-on-Pages, PartyKit, Supabase, LiveKit and Infisical assumptions. It is not the final revival setup. [Tooling](tooling.md) preserves the target command contract and [environments](../operations/environments.md) the proposed Workers bindings. Pin resolved target versions and update the lockfile during the existing implementation work; no target dependency was installed here.

The existing setup uses Linux-style file commands, including destructive reset scripts. Windows compatibility is not established. Do not interpret the README's Node >=18 declaration as a current support recommendation; exact supported target versions require the existing compatibility work.

## Evidence

[Root scripts](../../package.json), [web scripts](../../apps/web/package.json), [backend scripts](../../apps/backend/package.json), [data package](../../packages/data/package.json), and [workspace configuration](../../pnpm-workspace.yaml).
