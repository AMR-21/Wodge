import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@repo/ui";
import { Logo } from "../logo";

export function Welcome() {
  return (
    <div className="flex h-full flex-col items-center justify-center space-y-3 p-1">
      <Logo />
      <Card className="border-none bg-background text-center shadow-none">
        <CardHeader className="">
          <CardTitle className="text-4xl">Welcome onboard!</CardTitle>
          <CardDescription className="text-base">
            Wodge helps you collaborate, communicate, and manage your knowledge
            in one place.
          </CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
}
