// import type * as Party from "partykit/server";
// import { badRequest, getRoute, ok, unauthorized } from "../../lib/http-utils";
// import WorkspaceParty from "../workspace-party";
// import { workspacePull } from "../handlers/workspace-pull";
// import { workspacePush } from "../handlers/workspace-push";
// import { createWorkspace } from "../handlers/create-workspace";
// import { createInvite } from "../handlers/create-invite";
// import { joinWorkspace } from "../handlers/join-workspace";
// import { handlePresence } from "../handlers/presence";
// import { getMembersInfo } from "../handlers/get-members-info";
// import { updateWorkspace } from "../handlers/update-workspace";
// import { notifyFile } from "../handlers/notify-file";
// import { leaveWorkspace } from "../handlers/leave-workspace";
// import { deleteWorkspace } from "../handlers/delete-workspace";
// import { uploadFile } from "../handlers/upload-file";
// import { channelPoke } from "../handlers/channel-poke";

// export async function handlePost(req: Party.Request, party: WorkspaceParty) {
//   const route = getRoute(req);

//   switch (route) {
//     case "/replicache-push":
//       return workspacePush(req, party);

//     case "/replicache-pull":
//       return workspacePull(req, party);

//     case "/create":
//       return createWorkspace(req, party);

//     case "/create-invite":
//       return createInvite(req, party);

//     case "/join":
//       return joinWorkspace(req, party);

//     case "/presence":
//       return handlePresence(req, party);

//     case "/update":
//       return updateWorkspace(req, party);

//     case "/poke":
//       return await channelPoke(req, party);

//     case "/notify-file":
//       return notifyFile(req, party);

//     case "/leave":
//       return await leaveWorkspace(req, party);

//     case "/delete":
//       return await deleteWorkspace(req, party);

//     // case "/upload-file":
//     //   return await uploadFile(req, party);
//     case "/upload-avatar":
//     case "/delete-avatar":
//     default:
//       return badRequest();
//   }
// }
