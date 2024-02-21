import { Avatar, AvatarImage, Button } from "../../../../../packages/ui";

export function WorkspaceItem({ workspace }: { workspace?: any }) {
  return (
    <div className="group flex w-full shrink-0 items-center gap-2 overflow-hidden py-3 pl-4">
      <Avatar className="h-6 w-6 rounded-md transition-all group-hover:scale-105">
        <AvatarImage src={"/avatar.jpeg"} />
      </Avatar>
      <p className="truncate transition-all group-hover:font-semibold">Name</p>
      <Button
        className=" ml-auto translate-x-full text-xs transition-all  group-hover:-translate-x-4"
        size="fit"
      >
        Open
      </Button>
    </div>
  );
}
