import { CORS, json, ok } from "../lib/http-utils";
import { Context } from "hono";
import { Prompt } from "@repo/data";
import { type Ai } from "partykit-ai";
import PageParty from "@/page/page-party";

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
  // { faksana
  //   case: "tone",
  //   prompt_header:
  //     "Apply nuanced tone modulation algorithms to harmonize the linguistic tonality of the provided text with a specified style or mood, ensuring seamless integration of stylistic elements and linguistic nuances to evoke desired emotional responses and reader engagement.",
  // },
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
  // it is similar to "longer" {
  //   case: "complete",
  //   prompt_header:
  //     "Generate supplementary content synergistically aligned with the thematic elements and narrative trajectory of the provided text, augmenting its comprehensiveness, depth, and informativeness through contextually relevant elaborations, expansions, or extensions.",
  // },
  {
    case: "default",
    prompt_header:
      "Do what the user says and just give the result without any additional information.",
  },
];

//NO NEED FOR IT NOW const prepend =
//   "do the mentioned giving the instruction above using the data below and no yapping just give the answer directly don't tell me anything but the answer and don't introduce the answer to me the answer and just the answer if no instruction is giving just answer the question directly without end indication: ";

export async function prompt(party: PageParty, c: Context) {
  const data = atob(c.req.param("prompt"));
  const action = c.req.param("action") && atob(c.req.param("action"));

  // This is a normal prompt to run, no action specified
  if (!action) {
    const prompt = data;

    const response = await party.ai.run(
      //@ts-ignore
      "@hf/thebloke/openhermes-2.5-mistral-7b-awq",
      {
        prompt: `"${prompt}"`,

        max_tokens: 2048,
        stream: true,
      }
    );

    return new Response(response, {
      headers: {
        ...CORS,
        "Content-Type": "text/event-stream",
      },
    });
  }

  if (action) {
    const template = promptTemplates.find(
      (item: { case: string }) => item.case === action
    );

    const lang = c.req.param("lang") && atob(c.req.param("lang"));
    // const tone = c.req.param("tone") && atob(c.req.param("tone"));

    if (template) {
      let prompt = template.prompt_header;

      if (lang) {
        prompt = prompt + lang;
      }

      const { response } = await party.ai.run(
        "@hf/thebloke/openhermes-2.5-mistral-7b-awq",
        {
          // prompt: `"${prompt}"`,
          messages: [
            {
              role: "system",
              content: prompt,
            },
            { role: "user", content: data },
          ],
          max_tokens: 2048,
        }
      );
      return json({ response });

      // Run the AI model based on the action
    } else {
      // If the action is not found in the templates, return an error
      return json({ error: "Invalid action" }, 400);
    }
  }
}
