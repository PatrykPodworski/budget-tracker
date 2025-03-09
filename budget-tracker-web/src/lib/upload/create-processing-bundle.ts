"use server";
import { env } from "@/env";
import { UploadFile, uploadFiles } from "../storage/upload-file";
import { getContainer } from "./common/get-container";
import { ProcessingBundle } from "./common/processing-bundle";

export const createProcessingBundle = async (files: ProcessingBundleFile[]) => {
  // TODO: P-1 Rename to ReceiptProcessingBundle
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

type ProcessingBundleFile = Omit<UploadFile, "id">;
