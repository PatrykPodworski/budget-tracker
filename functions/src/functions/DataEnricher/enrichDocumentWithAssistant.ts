import OpenAI from "openai";
import { Document } from "./documentSchema";
import { config } from "../../config";

const openai = new OpenAI();

export const enrichDocumentWithAssistant = async (document: Document) => {
  const thread = await openai.beta.threads.create();
  await openai.beta.threads.messages.create(thread.id, {
    role: "user",
    content: JSON.stringify(document.items),
  });

  const run = await openai.beta.threads.runs.createAndPoll(thread.id, {
    assistant_id: config.OPENAI_ASSISTANT_ID,
  });

  if (run.status === "completed") {
    const messages = await openai.beta.threads.messages.list(run.thread_id);
    const content = messages.data.at(0)?.content.at(0);
    if (!content || content.type !== "text") {
      throw new Error("No text content found in the assistant's response.");
    }

    // TODO: Serialize and validate the content
    return content.text.value;
  } else {
    throw new Error(`Run failed with status: ${run.status}`);
  }
};
