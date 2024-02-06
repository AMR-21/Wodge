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
    <div className="flex flex-col items-center p-1">
      <Logo />
      <Card className="border-none bg-background text-center shadow-none">
        <CardHeader className="">
          <CardTitle className="text-4xl">Welcome onboard!</CardTitle>
          <CardDescription className="text-base">
            Wodge helps you ..........
          </CardDescription>
        </CardHeader>
        {/* <CardContent className="flex aspect-square items-center justify-center p-6">
        </CardContent> */}
      </Card>
    </div>
  );
}
