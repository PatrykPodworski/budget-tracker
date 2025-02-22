"use server";
import { UploadFile, uploadFiles } from "../storage/upload-file";

export const createUploadRequest = async (files: UploadFile[]) => {
  // TODO: P-1 Create status in cosmos
  // TODO: P-1 Read status from cosmos
  // TODO: P-1 Include receiptIds in status with initial status
  // TODO: P-1 Update status in functions
  // TODO: P-1 Add SSE Azure function that will notify the client of the status
  const requestId = crypto.randomUUID();

  await uploadFiles(files);

  return requestId;
};
