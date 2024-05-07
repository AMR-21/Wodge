import { createClient } from "@/lib/supabase/client";
import { Button } from "@repo/ui/components/ui/button";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@repo/ui/components/ui/input-otp";
import { Loader } from "@repo/ui/components/ui/loader";
import { PrevBtn } from "@repo/ui/components/ui/stepper";
import { useAtomValue } from "jotai";
import { useState } from "react";
import { emailAtom } from "./email-atom";
import { useRouter } from "next/navigation";

export function OTP() {
  const [isPending, setIsPending] = useState(false);
  const [otp, setOTP] = useState("");
  const supabase = createClient();
  const email = useAtomValue(emailAtom);
  const router = useRouter();

  async function onSubmit() {
    setIsPending(true);
    const {
      data: { session },
      error,
    } = await supabase.auth.verifyOtp({
      email,
      token: otp,
      type: "email",
      options: {
        redirectTo: "http://localhost:3000/",
      },
    });

    if (!error) router.replace("/");
    setIsPending(false);
  }

  return (
    <div className="flex flex-col gap-3">
      <InputOTP
        maxLength={6}
        value={otp}
        onChange={(v) => setOTP(v)}
        className="mt-0"
      >
        <InputOTPGroup className="w-full">
          <InputOTPSlot className="h-12 w-12 text-lg" index={0} />
          <InputOTPSlot className="h-12 w-12 text-lg" index={1} />
          <InputOTPSlot className="h-12 w-12 text-lg" index={2} />
        </InputOTPGroup>
        <InputOTPSeparator />
        <InputOTPGroup>
          <InputOTPSlot className="h-12 w-12 text-lg" index={3} />
          <InputOTPSlot className="h-12 w-12 text-lg" index={4} />
          <InputOTPSlot className="h-12 w-12 text-lg" index={5} />
        </InputOTPGroup>
      </InputOTP>

      <div className="flex w-full gap-2.5">
        <PrevBtn className="basis-1/4" variant="secondary">
          Cancel
        </PrevBtn>
        <Button
          type="submit"
          className="basis-3/4"
          onClick={onSubmit}
          disabled={isPending || otp.length < 6}
        >
          {isPending ? (
            <Loader color="hsl(var(--primary-foreground))" />
          ) : (
            "Login with OTP"
          )}
        </Button>
      </div>
    </div>
  );
}
