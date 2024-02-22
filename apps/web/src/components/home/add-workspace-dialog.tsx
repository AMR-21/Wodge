import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@repo/ui";
import { JoinWorkspaceForm } from "./join-workspace-form";
import { CreateWorkspaceForm } from "./create-workspace-form";

export function AddWorkspaceDialog() {
  return (
    <Dialog>
      <DialogTrigger className="mt-6 w-full" asChild>
        <Button className="w-full">Add a workspace</Button>
      </DialogTrigger>
      <DialogContent className="max-w-sm">
        <Tabs defaultValue="join" className="w-full">
          <DialogHeader>
            <TabsList className="grid w-full grid-cols-2 transition-all">
              <TabsTrigger value="join">Join a Workspace</TabsTrigger>
              <TabsTrigger value="create">Create a Workspace</TabsTrigger>
            </TabsList>

            <TabsContent value="join">
              <JoinWorkspaceForm />
            </TabsContent>
            <TabsContent value="create">
              <CreateWorkspaceForm />
            </TabsContent>
          </DialogHeader>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
