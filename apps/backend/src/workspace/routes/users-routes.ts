import { deleteFile } from "../handlers/delete-file";
import { downloadFile } from "../handlers/download-file";
import { getMembersInfo } from "../handlers/get-members-info";
import { leaveWorkspace } from "../handlers/leave-workspace";
import { listFiles } from "../handlers/list-files";
import { uploadFile } from "../handlers/upload-file";
import { workspacePull } from "../handlers/workspace-pull";
import { workspacePush } from "../handlers/workspace-push";
import WorkspaceParty from "../workspace-party";

export function setupUsersRoutes(party: WorkspaceParty) {
  party.app.post("/replicache-pull", workspacePull.bind(null, party));
  party.app.post("/replicache-push", workspacePush.bind(null, party));
  party.app.get("/members-info", getMembersInfo.bind(null, party));
  party.app.post("/leave", leaveWorkspace.bind(null, party));
  party.app
    .get("/files/:teamId/:path?", listFiles.bind(null, party))
    .post(uploadFile.bind(null, party))
    .delete(deleteFile.bind(null, party, "file"));
  party.app.get("/file/:teamId/:path", downloadFile.bind(null, party));
}
