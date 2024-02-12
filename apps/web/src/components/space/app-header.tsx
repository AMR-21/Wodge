import { SpaceSwitcher } from "./space-switcher";

export function AppHeader() {
  return (
    <div className="flex border-b border-border/50">
      <SpaceSwitcher />
      <div className="basis-full px-2">channel</div>
    </div>
  );
}
