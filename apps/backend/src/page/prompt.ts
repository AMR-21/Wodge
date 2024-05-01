import * as Party from "partykit/server";
import PageParty from "./page-party";
import { json, ok } from "../lib/http-utils";
import { Prompt } from "@repo/data";

export async function prompt(req: Party.Request, party: PageParty) {
  const { prompt, action, toneOrLang } = await req.json<Prompt>();

  // This is a normal prompt to run, no action specified
  if (!action) {
    // Pick the suitable AI model
    // ctrl+space to see the list of available models or run npx partykit ai models or visit https://docs.partykit.io/reference/partykit-ai/
    const { response } = await party.ai.run("@cf/meta/llama-2-7b-chat-fp16", {
      prompt: `"${prompt}"`,
    });

    return json({ response });
  }

  if (action) {
    switch (action) {
      case "simplify":
        break;
      case "fix":
        break;
      case "shorter":
        break;
      case "longer":
        break;
      case "tone":
        break;
      case "tldr":
        break;
      case "emojify":
        break;
      case "translate":
        break;
      case "complete":
        break;
      default:
        return json({ error: "Invalid action" }, 400);
    }
  }
}
