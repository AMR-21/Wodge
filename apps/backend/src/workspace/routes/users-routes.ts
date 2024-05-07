import { deleteFile } from "../handlers/delete-file";
import { downloadFile } from "../handlers/download-file";
import { getMembersInfo } from "../handlers/get-members-info";
import { leaveWorkspace } from "../handlers/leave-workspace";
import { listFiles } from "../handlers/list-files";
import { uploadFile } from "../handlers/upload-file";
import { workspacePull } from "../handlers/workspace-pull";
import { workspacePush } from "../handlers/workspace-push";
import { isTeamMemberMiddleware } from "../middlewares/is-team-member";
import WorkspaceParty from "../workspace-party";
import { isTeamModeratorMiddleware } from "../middlewares/is-team-moderator";
import { canEditMiddleware } from "../middlewares/can-edit-middleware";
import { canViewMiddleware } from "../middlewares/can-view-middleware copy";

export function setupUsersRoutes(party: WorkspaceParty) {
  party.app.post("/replicache-pull", workspacePull.bind(null, party));
  party.app.post("/replicache-push", workspacePush.bind(null, party));
  party.app.get("/members-info", getMembersInfo.bind(null, party));
  party.app.post("/leave", leaveWorkspace.bind(null, party));
  party.app
    .use("/files/:teamId/:path?", isTeamMemberMiddleware.bind(null, party))
    .get(listFiles.bind(null, party))
    .post(
      isTeamModeratorMiddleware.bind(null, party),
      uploadFile.bind(null, party)
    )
    .delete(
      isTeamModeratorMiddleware.bind(null, party),
      deleteFile.bind(null, party, "file")
    );

  party.app.get(
    "/file/:teamId/:path",
    isTeamMemberMiddleware.bind(null, party),
    downloadFile.bind(null, party)
  );

  party.app
    .get(
      "/file/:teamId/:channelId/:path",
      canViewMiddleware.bind(null, party),
      downloadFile.bind(null, party)
    )
    .post(canEditMiddleware.bind(null, party), uploadFile.bind(null, party));
}
