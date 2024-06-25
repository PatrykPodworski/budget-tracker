import OpenAI from "openai";
import { ReceiptRawData } from "../../models/ReceiptRawData";
import { config } from "../../config";
import { z } from "zod";

const openai = new OpenAI();

export const enrichDocumentWithAssistant = async (document: ReceiptRawData) => {
  const response = await getAssistantResponse(document);
  const responseItems = await serializeTheResponse(response);
  return responseItems;
};

const getAssistantResponse = async (document: ReceiptRawData) => {
  const thread = await openai.beta.threads.create();
  await openai.beta.threads.messages.create(thread.id, {
    role: "user",
    content: JSON.stringify(document.items),
  });

  const run = await openai.beta.threads.runs.createAndPoll(thread.id, {
    assistant_id: config.OPENAI_ASSISTANT_ID,
  });

  if (run.status !== "completed") {
    throw new Error(`Run failed with status: ${run.status}`);
  }

  const messages = await openai.beta.threads.messages.list(run.thread_id);
  const content = messages.data.at(0)?.content.at(0);
  if (!content || content.type !== "text") {
    throw new Error("No text content found in the assistant's response.");
  }

  return content.text.value;
};

const serializeTheResponse = async (response: string) => {
  const serialized = JSON.parse(response);
  const parsed = await assistantResponseSchema.parseAsync(serialized);
  return parsed.items;
};

const assistantResponseSchema = z.object({
  items: z.array(
    z.object({
      name: z.string().min(1),
      originalName: z.string().min(1),
      category: z.string().min(1),
    })
  ),
});

type AssistantResponse = z.infer<typeof assistantResponseSchema>;
export type ResponseItem = AssistantResponse["items"][number];

// TODO: P3 Check the warning
// Set "WEBSITE_RUN_FROM_PACKAGE" to "1" to significantly improve load times. Learn more here: https://aka.ms/AAjon54
