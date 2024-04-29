import * as Party from "partykit/server";
import PageParty from "./page-party";
import { json, ok } from "../lib/http-utils";
import { Prompt } from "@repo/data";

export async function prompt(req: Party.Request, party: PageParty) {
  const body = await req.json<Prompt>();

  const { response } = await party.ai.run("@cf/meta/llama-2-7b-chat-fp16", {
    prompt: `"${body.prompt}"`,
  });

  return json({ response });
}
