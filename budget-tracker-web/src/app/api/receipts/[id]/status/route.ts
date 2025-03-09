import { ProcessingBundle } from "@/lib/upload/common/processing-bundle";
import { getProcessingBundle } from "@/lib/upload/get-processing-bundle";
import { NextRequest } from "next/server";
import equal from "fast-deep-equal";
import { PROCESSING_FINISHED_STATUS } from "@/lib/upload/common/processing-steps";
import { ProcessingBundleEvent } from "./processing-bundle-event";

export const GET = async (_request: NextRequest, { params }: Params) => {
  const { id } = await params;
  let previousBundle = await getProcessingBundle(id);
  const responseStream = new TransformStream();
  const writer = responseStream.writable.getWriter();
  const encode = getEncode();
  const response = new Response(responseStream.readable, { headers });

  // Send initial message
  const isInitialFinished = isProcessingFinished(previousBundle);
  writer.write(
    encode({
      data: previousBundle,
      isFinished: isInitialFinished,
    })
  );

  // Close immediately if all receipts are already processed
  if (isInitialFinished) {
    writer.close();
    return response;
  }

  // Check for updates
  const interval = setInterval(async () => {
    const processingBundle = await getProcessingBundle(id);
    const isFinished = isProcessingFinished(processingBundle);

    // Only send the message if the bundle has changed
    if (!equal(previousBundle, processingBundle)) {
      await writer.write(
        encode({
          data: processingBundle,
          isFinished,
        })
      );
      previousBundle = processingBundle;
    }

    // TODO: P2 Close the stream after time
    // Close the stream if all receipts are processed
    if (isFinished) {
      await writer.close();
      clearInterval(interval);
      return;
    }
  }, 3000);

  return response;
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
