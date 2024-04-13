import sharedConfig from "../../packages/ui/tailwind.config";
import type { Config } from "tailwindcss";

const config: Config = {
  presets: [sharedConfig],
  content: [
    ...sharedConfig.content,
    "./node_modules/@repo/ui/components/**/*.{js,jsx,ts,tsx}",
    "./node_modules/@repo/editor/src/**/*.{js,jsx,ts,tsx}",
  ],
};

export default config;
