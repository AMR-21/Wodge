import { Mutable } from "@/lib/utils";
import * as React from "react";
import { useCurrentWorkspace } from "../../workspace/workspace-context";
import {
  SettingsContentDescription,
  SettingsContentHeader,
  SettingsContentSection,
} from "../settings";
import { teamColumns } from "./teams-columns";
import {
  DataTable,
  EditableDataTable,
  Form,
  Separator,
  TableRow,
} from "@repo/ui";
import { useForm, useFormState } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Team, TeamSchema, WORKSPACE_TEAM_ID_LENGTH } from "@repo/data";
import { nanoid } from "nanoid";

export function TeamsSettings() {
  const { structure } = useCurrentWorkspace();
  const [submitted, setSubmitted] = React.useState(false);

  const form = useForm({
    resolver: zodResolver(TeamSchema),
    defaultValues: {
      name: "",
      id: nanoid(WORKSPACE_TEAM_ID_LENGTH),
    },
  });

  if (!structure) return null;

  async function onSubmit(data: Team) {
    console.log(data);
    form.setValue("id", nanoid(WORKSPACE_TEAM_ID_LENGTH));
    form.reset();
    setSubmitted(true);
  }

  return (
    <div>
      <SettingsContentHeader
        label="Teams"
        description="Manage your workspace's teams"
      />

      <SettingsContentSection header="Teams">
        <Form {...form}>
          <form id="new-team-form" onSubmit={form.handleSubmit(onSubmit)}>
            <DataTable
              columns={teamColumns(form)}
              data={
                [
                  ...structure.teams,

                  {
                    id: "add-team",
                    name: "",
                    avatar: "",
                    moderators: [],
                    tags: [],
                  },
                ] as Mutable<typeof structure.teams>
              }
              label="team"
              formId="new-team-form"
              formIsSubmitted={submitted}
              withForm
            />
          </form>
        </Form>
      </SettingsContentSection>
    </div>
  );
}
