// import { RoleSchema, TeamSchema, WorkspaceStructure, makeWorkspaceStructureKey } from "@repo/data";
// import { RunnerParams } from "../../lib/replicache";
// import WorkspaceParty from "../workspace-party";

// import { produce } from "immer";

// export async function daleteRole(
//     party: WorkspaceParty,
//     { mutation, nextVersion, userId }: RunnerParams
// )
// {
//     const validatedFields = RoleSchema.safeParse(mutation.args);
//     //  Bug: Should throw an error if the data is invalid
//     if (!validatedFields.success) {
//       return;
//     }
//     const { data: deletedRole } = validatedFields;
//     //3. Delete the role
//     const newStructure = produce(party.workspaceStructure.data, (draft) => {
//       const index = draft.roles.findIndex((r) => r.id === deletedRole.id);
//       if (index != -1) {
//         draft.roles.splice(index, 1);
//         //splice example
//         //const array = [1, 2, 3, 4, 5];
//         //const removedElement = array.splice(2, 1); // Removes one element at index 2
//         // Resulting array: [1, 2, 4, 5]
//         // removedElement contains the removed element, in this case, [3]
//       }
//       else {
//         return;
//       }
//     });
//     //4. Persist the mutation
//     await party.room.storage.put(makeWorkspaceStructureKey(), newStructure);
// }
