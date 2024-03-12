import { WorkspaceSchema, WorkspaceType, makeWorkspaceKey } from "../../..";

export function createWorkspaceMutation(data: WorkspaceType) {
  // validation is an extra needless effort but for purpose of adding extra validation
  // Typically where the case user bypass the function and call the mutation directly
  // 1. Validate the data,
  const validatedFields = WorkspaceSchema.safeParse(data);

  if (!validatedFields.success) throw new Error("Invalid workspace data");

  const { data: workspace } = validatedFields;

  return workspace;
}
