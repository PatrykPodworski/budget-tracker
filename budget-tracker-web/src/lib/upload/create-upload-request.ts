"use server";
import { env } from "@/env";
import { UploadFile, uploadFiles } from "../storage/upload-file";
import { getContainer } from "./common/get-container";
import { ProcessingBundle } from "./common/processing-bundle";

export const createUploadRequest = async (files: RequestUploadFile[]) => {
  // TODO: P-1 Rename to ReceiptProcessingBundle
  // TODO: P-1 Update status in functions
  // TODO: P-1 Add SSE Azure function that will notify the client of the status
  // TODO: P-1 Upload all files from one request in a single folder with requestId
  // TODO: P-1 After reading the files from OCR, include requestId in the raw data
  const container = getContainer();

  const filesToUpload: UploadFile[] = files.map((file) => ({
    id: crypto.randomUUID(),
    type: file.type,
    buffer: file.buffer,
  }));

  const processingBundle = getProcessingBundle(filesToUpload);

  await uploadFiles(filesToUpload, processingBundle.id);
  await container.items.create(processingBundle);

  return processingBundle.id;
};

const getProcessingBundle = (files: UploadFile[]) => {
  const id = crypto.randomUUID();
  const userId = env.TEMP_USER_ID;
  const receipts = files.reduce<ProcessingBundle["receipts"]>((acc, file) => {
    acc[file.id] = { status: "uploaded" };
    return acc;
  }, {});

  const processingBundle: ProcessingBundle = {
    id,
    userId,
    receipts,
  };

  return processingBundle;
};

type RequestUploadFile = Omit<UploadFile, "id">;
