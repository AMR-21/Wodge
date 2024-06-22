import { NextRequest } from "next/server";
import { openai } from "@ai-sdk/openai";

import { generateText, streamText } from "ai";
import { createDb } from "@repo/data/server";
import { AiActionSchema, memberships, workspaces } from "@repo/data";
import { and, eq } from "drizzle-orm";

const promptTemplates = [
  {
    case: "fix",
    prompt_header:
      "correct the words the user says and just give out the corrected words and don't even say anything else.",
  },
  {
    case: "shorter",
    prompt_header:
      "Make the given text shorter by removing redundant information, eliminating unnecessary details, and condensing the content to its essential elements, ensuring concise and precise communication without compromising clarity or informativeness. just give the shortened text and nothing else.",
  },
  {
    case: "longer",
    prompt_header:
      "Utilize expansive expansion techniques and comprehensive elaboration strategies to augment the depth and breadth of the provided text, incorporating nuanced insights, detailed explanations, and additional contextual information to enrich the content and enhance reader understanding. just give the expanded text and nothing else.",
  },

  {
    case: "tldr",
    prompt_header:
      "Craft a succinct 'too long; didn't read' summary encapsulating the key themes, essential points, and overarching message of the provided text, employing efficient abstraction techniques to distill complex content into a concise yet informative narrative.",
  },
  {
    case: "emojify",
    prompt_header:
      "Integrate expressive emoticons and emotive glyphs into the provided text using advanced emoji enrichment methodologies, enhancing textual expressiveness, emotional resonance, and reader engagement through visually augmented linguistic communication. just give the emojified text and nothing else.",
  },
  {
    case: "translate",
    prompt_header:
      "Translate the following text into the target language, ensuring accurate and contextually appropriate linguistic conversion that preserves the original meaning, tone, and intent of the source text. just give the translated text and nothing else. the translation should be in ",
  },

  //complete
  //simplify

  {
    case: "default",
    prompt_header:
      "Do what the user says and just give the result without any additional information.",
  },
];

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

  const body = await req.json();

  const validatedFields = AiActionSchema.safeParse(body);

  if (!validatedFields.success)
    return new Response("Invalid request", { status: 400 });

  const { text: userText, action, lang } = validatedFields.data;

  if (action === "translate" && !lang)
    return new Response("Invalid request", { status: 400 });

  let systemPrompt = promptTemplates.find(
    (item) => item.case === action,
  )!.prompt_header;

  if (lang) {
    systemPrompt += lang;
  }

  const { text } = await generateText({
    model: openai("gpt-3.5-turbo"),
    system: systemPrompt,
    prompt: userText,
  });

  return Response.json({ text });
}
