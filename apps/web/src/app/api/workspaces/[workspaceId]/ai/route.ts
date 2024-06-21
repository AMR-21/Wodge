import { NextRequest } from "next/server";
import { openai } from "@ai-sdk/openai";

import { streamText } from "ai";
import { createDb } from "@repo/data/server";
import { memberships, workspaces } from "@repo/data";
import { and, eq } from "drizzle-orm";

export async function POST(
  req: NextRequest,
  { params: { workspaceId } }: { params: { workspaceId: string } },
) {
  const userId = req.headers.get("x-user-id");

  if (!userId) {
    return new Response("Unauthorized", { status: 401 });
  }

  // Check if the workspace premium and user is a member
  const db = createDb();

  const [workspace, membership] = await db.batch([
    db.query.workspaces.findFirst({
      where: eq(workspaces.id, workspaceId),
    }),

    db.query.memberships.findFirst({
      where: and(
        eq(memberships.workspaceId, workspaceId),
        eq(memberships.userId, userId),
      ),
    }),
  ]);

  if (!workspace || !membership) {
    return new Response("Unauthorized", { status: 401 });
  }

  if (!workspace.isPremium)
    return new Response("Unauthorized", { status: 401 });

  const { messages } = await req.json<{ messages: any }>();

  const result = await streamText({
    model: openai("gpt-3.5-turbo"),
    messages,
  });

  return result.toAIStreamResponse();
}
