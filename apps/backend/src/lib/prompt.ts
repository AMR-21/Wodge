import { CORS, json, ok } from "../lib/http-utils";
import { Context } from "hono";
import { Prompt } from "@repo/data";
import { type Ai } from "partykit-ai";
import PageParty from "@/page/page-party";

const promptTemplates = [
  {
    case: "fix",
    prompt_header:
      "Leverage cutting-edge grammatical analysis algorithms to meticulously identify and rectify any syntactical, grammatical, or structural anomalies present in the following text, ensuring utmost linguistic coherence and precision, The text: ",
  },
  {
    case: "shorter",
    prompt_header:
      "Employ sophisticated content condensation methodologies utilizing advanced summarization techniques to distill the essence of the following text, eliminating redundancies and extraneous details while retaining salient information and preserving narrative integrity, The text: ",
  },
  {
    case: "longer",
    prompt_header:
      "Utilize expansive expansion techniques and comprehensive elaboration strategies to augment the depth and breadth of the provided text, incorporating nuanced insights, detailed explanations, and additional contextual information to enrich the content and enhance reader understanding.",
  },
  {
    case: "tone",
    prompt_header:
      "Apply nuanced tone modulation algorithms to harmonize the linguistic tonality of the provided text with a specified style or mood, ensuring seamless integration of stylistic elements and linguistic nuances to evoke desired emotional responses and reader engagement.",
  },
  {
    case: "tldr",
    prompt_header:
      "Craft a succinct 'too long; didn't read' summary encapsulating the key themes, essential points, and overarching message of the provided text, employing efficient abstraction techniques to distill complex content into a concise yet informative narrative.",
  },
  {
    case: "emojify",
    prompt_header:
      "Integrate expressive emoticons and emotive glyphs into the provided text using advanced emoji enrichment methodologies, enhancing textual expressiveness, emotional resonance, and reader engagement through visually augmented linguistic communication.",
  },
  {
    case: "translate",
    prompt_header:
      "Leverage state-of-the-art multilingual translation algorithms to proficiently transmute the linguistic representation of the provided text into a specified target language, ensuring semantic fidelity, cultural sensitivity, and linguistic nuance preservation. The text: ",
  },
  {
    case: "complete",
    prompt_header:
      "Generate supplementary content synergistically aligned with the thematic elements and narrative trajectory of the provided text, augmenting its comprehensiveness, depth, and informativeness through contextually relevant elaborations, expansions, or extensions.",
  },
  {
    case: "default",
    prompt_header:
      "Initiate appropriate error handling protocols to address the occurrence of an invalid action, ensuring prompt recognition and resolution of erroneous inputs while maintaining system integrity and user experience quality.",
  },
];

const prepend =
  "do the mentioned giving the instruction above using the data below and no yapping just give the answer directly don't tell me anything but the answer and don't introduce the answer to me the answer and just the answer if no instruction is giving just answer the question directly without end indication: ";

export async function prompt(party: PageParty, c: Context) {
  const data = atob(c.req.param("prompt"));
  const action = c.req.param("action") && atob(c.req.param("action"));

  // This is a normal prompt to run, no action specified
  if (!action) {
    const prompt = prepend + data;

    const response = await party.ai.run(
      //@ts-ignore
      "@cf/mistral/mistral-7b-instruct-v0.1",
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

    if (template) {
      let prompt = template.prompt_header + data;

      if (lang) {
        prompt = prompt + " The target language: " + lang;
      }

      const { response } = await party.ai.run(
        "@cf/mistral/mistral-7b-instruct-v0.1",
        {
          // prompt: `"${prompt}"`,
          messages: [
            {
              role: "system",
              content: prepend,
            },
            { role: "user", content: prompt },
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
