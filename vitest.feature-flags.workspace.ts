import { defineWorkspace } from "vitest/config";
import { fileURLToPath } from "node:url";

export default defineWorkspace([
  {
    resolve: {
      alias: {
        "@": fileURLToPath(new URL("./apps/web/src", import.meta.url)),
        react: fileURLToPath(
          new URL("./apps/web/node_modules/react", import.meta.url),
        ),
        "react-dom": fileURLToPath(
          new URL("./apps/web/node_modules/react-dom", import.meta.url),
        ),
      },
    },
    esbuild: { jsx: "automatic" },
    test: {
      include: ["tests/feature-flags/*.test.{ts,tsx}"],
      environment: "node",
      cache: false,
    },
  },
]);
