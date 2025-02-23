"use server";
import { UploadFile, uploadFiles } from "../storage/upload-file";
import { getContainer } from "./common/get-container";
import { ProcessingBundle } from "./common/processing-bundle";

export const createUploadRequest = async (files: RequestUploadFile[]) => {
  // TODO: P-1 Rename to ReceiptProcessingBundle
  // TODO: P-1 Read status from cosmos
  // TODO: P-1 Include receiptIds in status with initial status
  // TODO: P-1 Update status in functions
  // TODO: P-1 Add SSE Azure function that will notify the client of the status
  const container = getContainer();

  const filesToUpload: UploadFile[] = files.map((file) => ({
    id: crypto.randomUUID(),
    type: file.type,
    buffer: file.buffer,
  }));

  const processingBundle = getProcessingBundle(filesToUpload);

  await container.items.create(processingBundle);
  await uploadFiles(filesToUpload);

  return processingBundle.id;
};

const getProcessingBundle = (files: UploadFile[]) => {
  const id = crypto.randomUUID();

  const processingBundle: ProcessingBundle = {
    id,
    receipts: files.map((x) => ({ id: x.id, status: "uploading" })),
  };

  return processingBundle;
};

type RequestUploadFile = Omit<UploadFile, "id">;
