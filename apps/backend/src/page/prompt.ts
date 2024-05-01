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
    // run a prompt based on action
    let response = "placeholder";
    switch (action) {
      case "simplify":
        return json({ response });
      case "fix":
        return json({ response });
      case "shorter":
        return json({ response });
      case "longer":
        return json({ response });
      case "tone":
        return json({ response });
      case "tldr":
        return json({ response });
      case "emojify":
        return json({ response });
      case "translate":
        return json({ response });
      case "complete":
        return json({ response });
      default:
        return json({ error: "Invalid action" }, 400);
    }
  }
}
