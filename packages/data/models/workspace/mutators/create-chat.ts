import { produce } from "immer";
import { Chat, ChatSchema, DrObj } from "../../..";
import { WorkspaceStructure } from "../../../schemas/workspace.schema";

interface CreateTeamArgs {
  chat: Chat;
  teamId: string;
  structure: WorkspaceStructure | DrObj<WorkspaceStructure>;
}

export function createChatMutation({
  chat,
  teamId,
  structure,
}: CreateTeamArgs) {
  // Validate the data
  const validateFields = ChatSchema.safeParse(chat);

  if (!validateFields.success) throw new Error("Invalid chat data");

  const { data: newChat } = validateFields;

  const newStructure = produce(structure, (draft) => {
    const team = draft.teams.find((t) => t.id === teamId);
    // Check if team not found
    if (!team) throw new Error("Team not found");

    // Check if chat already exists
    if (team.chats.find((ch) => ch.id === newChat.id)) {
      throw new Error("Chat already exists");
    } else {
      team.chats.push(newChat); // Add chat
    }
  });
  return newStructure as WorkspaceStructure;
}
