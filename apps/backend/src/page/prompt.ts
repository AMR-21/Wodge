import * as Party from "partykit/server";
import PageParty from "./page-party";
import { json } from "../lib/http-utils";
import { Context } from "hono";
import { Prompt } from "@repo/data";
import { concat } from "lodash";

// Assuming that prompt_templates.json is in the same directory as this script
const promptTemplates = require("./prompt_templates.json");

export async function prompt(party: PageParty, c: Context) {
  let { prompt, action, toneOrLang } = await c.req.json<Prompt>();

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
    let response;
    let prompt_header;
    let data; // get data from context

    // Find the corresponding prompt header from the prompt_templates.json file
    const template = promptTemplates.cases.find(
      (item: { case: string }) => item.case === action
    );
    if (template) {
      prompt_header = template.prompt_header + "do the mentioned above giving the data below and no yapping just give the answer directly";
      prompt = prompt_header + "" + data;
      const { response } = await party.ai.run("@cf/meta/llama-2-7b-chat-fp16", {
        prompt: `"${prompt}"`,
      });
      return json({ response });

      // Run the AI model based on the action
    } else {
      // If the action is not found in the templates, return an error
      return json({ error: "Invalid action" }, 400);
    }
  }
}
