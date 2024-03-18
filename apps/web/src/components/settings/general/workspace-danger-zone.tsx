import { SettingsContentAction } from "../settings";

export function WorkspaceDangerZone() {
  return (
    <div className="flex gap-4 ">
      <SettingsContentAction variant="outline">
        Leave Workspace
      </SettingsContentAction>

      <SettingsContentAction variant="destructive">
        Delete Workspace
      </SettingsContentAction>
    </div>
  );
}
