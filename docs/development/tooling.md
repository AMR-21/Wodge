# Development Tooling

> **Migration revision approved.** User approved `migration-draft-1` in this chat on 2026-10-09. Historical source knowledge is preserved; this file does not establish implementation, runtime validation, deployment, or release completion.

## Confirmed tooling

* **pnpm:** upgrade to the latest release.
* **Turborepo:** upgrade to the latest release for the monorepo.
* **TypeScript:** upgrade to version 7.
* **Oxlint:** replace ESLint.
* **Oxfmt:** replace Prettier. Oxfmt is the formatter referred to as “oxformatter”.

## Secrets

Move secrets from Infisical to Cloudflare.

## Reproducible migration commands

The following is the target command contract for the approved CI setup; it is not a claim that every script already exists in the capstone checkout.

* **pnpm install --frozen-lockfile:** CI installation using the committed lockfile and pinned package-manager version.
* **pnpm lint:** Oxlint checks.
* **pnpm format:check:** Oxfmt checks without modifying files.
* **pnpm typecheck:** TypeScript checks across affected packages.
* **pnpm test:run:** non-interactive Vitest tests.
* **pnpm test:e2e:** Playwright critical browser journeys.
* **pnpm build:** application/package builds through Turborepo.
  The current root already defines dev, build, lint, and database scripts; migration adds or updates the checks above and removes their old Next/ESLint/Infisical assumptions.

## Local and deployed environments

Cloudflare holds deployed secrets. Local development uses private local environment files and local bindings, without production-secret exports into web build files. Server-only credentials do not enter browser environment exports.
Current scripts pull Infisical values into web and backend files, run a local LiveKit server, and use PartyKit/Next-on-Pages commands. Those scripts belong to the migration rather than the final setup.

## Database and runtime configuration

D1/Drizzle migration generation and application remain explicit operations. PartyServer namespaces, D1, and R2 are backend bindings. The selected toolchain versions and runtime configuration must be committed together with the lockfile when the migration is implemented.

## Verified current scripts

[package.json](<https://github.com/AMR-21/Wodge/blob/d875c2d369f2bed15ba4e7257242131fddcbfa0a/package.json>)
[apps/web/package.json](<https://github.com/AMR-21/Wodge/blob/d875c2d369f2bed15ba4e7257242131fddcbfa0a/apps/web/package.json>)
[apps/backend/package.json](<https://github.com/AMR-21/Wodge/blob/d875c2d369f2bed15ba4e7257242131fddcbfa0a/apps/backend/package.json>)
[turbo.json](<https://github.com/AMR-21/Wodge/blob/d875c2d369f2bed15ba4e7257242131fddcbfa0a/turbo.json>)

## Stack

[Tech Stack](../architecture/tech-stack.md)

## References

* [pnpm](<https://pnpm.io/>)
* [Turborepo](<https://turborepo.com/docs>)
* [TypeScript 7](<https://devblogs.microsoft.com/typescript/announcing-typescript-7-0/>)
* [Oxlint](<https://oxc.rs/docs/guide/usage/linter>)
* [Oxfmt](<https://oxc.rs/docs/guide/usage/formatter/quickstart>)

## Source and revision

- Migrated from [Development Tooling](https://linear.app/amr21/document/development-tooling-1d556cdf4aee), document ID `01acfd7d-38ed-4651-a27a-9fee46918cf9`.
- Source revision: 2026-10-06T23:57:41.788Z; source author: Amr Yasser; last editor: Amr Yasser.
- Repository migration revision: `migration-draft-1`, 2026-10-09. The user confirmed preparation and placement in this chat. Approval of this rewritten repository revision and remote canonical-link cutover is pending.
- Existing decision/approval statements are source evidence, not new approvals or proof of implementation.
