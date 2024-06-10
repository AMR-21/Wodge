import { createInvite } from "../handlers/create-invite";
import { createInviteLink } from "../handlers/create-invite-link";
import { deleteFile } from "../handlers/delete-file";
import { deleteWorkspace } from "../handlers/delete-workspace";
import { getInvites } from "../handlers/get-invites";
import { toggleInviteLink } from "../handlers/toggle-invite-link";
import { updateWorkspace } from "../handlers/update-workspace";
import { uploadAvatar } from "../handlers/upload-avatar";
import { isAdminMiddleware } from "../middlewares/is-admin";
import WorkspaceParty from "../workspace-party";
export function setupAdministrativeRoutes(party: WorkspaceParty) {
  party.app.use(isAdminMiddleware.bind(null, party));
  party.app
    .patch("/invite-link", toggleInviteLink.bind(null, party))
    .post(createInviteLink.bind(null, party));

  party.app
    .post("/invites", createInvite.bind(null, party))
    .get(getInvites.bind(null, party));

  party.app.post("/update", updateWorkspace.bind(null, party));
  party.app
    .post("/avatar", uploadAvatar.bind(null, party))
    .delete(deleteFile.bind(null, party, "avatar"));
  party.app.delete("/", deleteWorkspace.bind(null, party));
}
