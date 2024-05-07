import { createInvite } from "../handlers/create-invite";
import { deleteFile } from "../handlers/delete-file";
import { deleteWorkspace } from "../handlers/delete-workspace";
import { getInvites } from "../handlers/get-invites";
import { updateWorkspace } from "../handlers/update-workspace";
import { uploadAvatar } from "../handlers/upload-avatar";
import { isAdminMiddleware } from "../middlewares/is-admin";
import WorkspaceParty from "../workspace-party";
export function setupAdministrativeRoutes(party: WorkspaceParty) {
  party.app.use(isAdminMiddleware.bind(null, party));
  party.app.get("/invites", getInvites.bind(null, party));
  party.app.post("/create-invite", createInvite.bind(null, party));
  party.app.post("/update", updateWorkspace.bind(null, party));
  party.app
    .post("/avatar", uploadAvatar.bind(null, party))
    .delete(deleteFile.bind(null, party, "avatar"));
  party.app.delete("/", deleteWorkspace.bind(null, party));
}
