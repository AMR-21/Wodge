# Wodge

A collaborative workspace that features communication and knowledge management capabilities. [Walk-through](https://youtu.be/IBZvqOu6Xro?si=aTqJbLlVdo2VtL7t)

## Environment Configuration

Note: The following are tested only on Linux based operating systems.

Required:

- Node.js v18^

Environment Variables:

- NODE_OPTIONS=--max-old-space-size=8192

// The following are configuration for Partykit deployment

- CLOUDFLARE_ACCOUNT_ID=...
- CLOUDFLARE_API_TOKEN=...

## Project Setup

- Fill in the environment variables in the `.env.example` file, for environment variables that will not be used, fill in random strings.
- Run `cp .env.example > ./apps/web/.env.local && cp .env.example > ./apps/backend/.env`.
- Follow [Livekit local dev setup steps](https://docs.livekit.io/home/self-hosting/local/).
- Create `.npmrc` file in the root and add the Tiptap auth token.
- Run `pnpm i` @root.
- Start local dev: `pnpm dev {--filter <project>}` @root or run dev command locally inside the project folder.

## Project Self-Deployment

Self-deployment is currently in progress, contact the [maintainers](amryasser52001@gmail.com) for the current deployment instructions.
