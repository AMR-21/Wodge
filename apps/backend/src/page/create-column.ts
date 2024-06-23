import { RunnerParams } from "../lib/replicache";
import { produce } from "immer";
import { createColumnMutation } from "@repo/data/models/page/mutators/create-column";
import PageParty from "./page-party";
import { CreateColumnArgs } from "@repo/data";

export async function createColumn(party: PageParty, params: RunnerParams) {
  const args = params.mutation.args as CreateColumnArgs;
  const newColumns = createColumnMutation({
    col: {
      id: args.id,
      title: args.title,
    },
    columns: party.db.data.columns,
  });

  party.db = produce(party.db, (draft) => {
    draft.data.columns = newColumns;
    draft.lastModifiedVersion = params.nextVersion;
  });

  await party.room.storage.put("db", party.db);
}
