# Wodge

A collaborative workspace.

## Installation

Recommended:

- Usage of Linux instead of Windows.

Required:

- [Node.js v20^](https://nodejs.org/en/) or [Node.js v20^ - Linux](https://github.com/nodesource/distributions)
- [pnpm](https://pnpm.io/) or `npm install -g pnpm`
- [Infisical installation](https://infisical.com/docs/cli/overview)

Optional - If you want to use the CLI directly:

- `pnpm i -g typescript`
- `pnpm i -g tsx`
- `pnpm i -g turbo`
- `pnpm i -g wrangler`

## Usage

- Run `pnpm i` @root
- Start local dev: `pnpm dev {--filter <project>}` @root
- Start drizzle studio: `pnpm studio` @root

Note: If any env variables are required, they must be loaded first like `infisical run --env=dev <command>` or with local .env `dotenv -e .env.local <command>`.
Note: Refer to infisical docs for more info on env variables CRUD operations or use dotenv-cli for env variables loading `dotenv -e .env.local turbo <task>`.
