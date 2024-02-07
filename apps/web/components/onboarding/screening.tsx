import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@repo/ui";
import { Logo } from "../logo";

function Wrapper({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="flex h-full flex-col items-center justify-center space-y-3 p-1">
      <Logo />
      <Card className="border-none bg-background text-center shadow-none">
        <CardHeader className="">
          <CardTitle className="text-4xl">{title}</CardTitle>
          <CardDescription className="text-base">{description}</CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
}

export function Welcome() {
  return (
    <Wrapper
      title="Welcome onboard!"
      description="Wodge helps you collaborate, communicate, and manage your knowledge in one place."
    />
  );
}

export function Outro() {
  return (
    <Wrapper
      title="You're all set!"
      description="Maximizing your team productivity is just a click away"
    />
  );
}
