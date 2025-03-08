import {
  PROCESSING_FINISHED_STATUS,
  ProcessingBundle,
} from "@/lib/upload/common/processing-bundle";
import { getProcessingBundle } from "@/lib/upload/get-processing-bundle";
import { NextRequest } from "next/server";
import equal from "fast-deep-equal";

// TODO: P-1 Clean up the code
export const GET = async (request: NextRequest, { params }: Params) => {
  const { id } = await params;
  let previousBundle = await getProcessingBundle(id);
  const responseStream = new TransformStream();
  const writer = responseStream.writable.getWriter();
  const encode = getEncode();

  // Send initial message
  const isInitialFinished = isProcessingFinished(previousBundle);
  writer.write(
    encode({
      data: previousBundle,
      isFinished: isInitialFinished,
    })
  );

  if (isInitialFinished) {
    writer.close();
    return new Response(responseStream.readable, { headers });
  }

  // Check for updates
  const interval = setInterval(async () => {
    const processingBundle = await getProcessingBundle(id);

    // Only send the message if the bundle has changed
    if (!equal(previousBundle, processingBundle)) {
      await writer.write(
        encode({
          data: processingBundle,
          isFinished: isProcessingFinished(processingBundle),
        })
      );
      previousBundle = processingBundle;
    }

    // Close the stream if all receipts are processed
    if (isProcessingFinished(processingBundle)) {
      await writer.close();
      clearInterval(interval);
      return;
    }
  }, 1000);

  return new Response(responseStream.readable, { headers });
};

const getEncode = () => {
  const encoder = new TextEncoder();

  const encode = (data: ProcessingBundleEvent) =>
    encoder.encode(`data: ${JSON.stringify(data)}\n\n`);

  return encode;
};

const isProcessingFinished = (processingBundle: ProcessingBundle) =>
  Object.values(processingBundle.receipts).every(
    (receipt) => receipt.status === PROCESSING_FINISHED_STATUS
  );

const headers = {
  "Content-Type": "text/event-stream",
  "Cache-Control": "no-cache",
  Connection: "keep-alive",
};

type Params = {
  params: Promise<{ id: string }>;
};

export type ProcessingBundleEvent = {
  data: ProcessingBundle;
  isFinished: boolean;
};
