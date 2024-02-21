import { env } from "@repo/env";
import { auth } from "./auth";

export type VerificationMail = {
  identifier?: string;
  url: string;
};

/**
 * A function that sends email magic link to the user using Resend api.
 */
export async function sendMagicLink({
  identifier: email,
  url,
}: VerificationMail) {
  try {
    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${env.RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        to: [email],
        from: env.RESEND_EMAIL_FROM,
        subject: "Verify your email",
        html: `<a href="${url}">Verify your email ${url}</a>`,
      }),
    });
  } catch (error) {
    console.error("Error sending email:", error);
    // throw new Error("Error sending email");
  }
}

export async function currentUser() {
  const session = await auth();

  return session?.user;
}
