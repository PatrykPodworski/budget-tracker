"use server";

import { BlockBlobClient } from "@azure/storage-blob";
import mime from "mime-types";
import { env } from "@/env";

export const uploadFiles = async (files: UploadFile[]) => {
  const promises = files.map((file) => uploadFile(file));
  await Promise.all(promises);
};

const uploadFile = async (file: UploadFile) => {
  const fileName = getFileName(file.type);

  const blobService = new BlockBlobClient(
    env.AZURE_STORAGE_CONNECTION_STRING,
    env.AZURE_STORAGE_CONTAINER_NAME,
    fileName
  );

  await blobService.uploadData(file.buffer, {
    blobHTTPHeaders: {
      blobContentType: file.type,
    },
  });
};

const getFileName = (type: string) => {
  const extension = mime.extension(type);
  if (!extension) {
    throw new Error(`Could not determine extension for type: ${type}`);
  }

  return `${crypto.randomUUID()}.${extension}`;
};

export type UploadFile = {
  type: string;
  buffer: ArrayBuffer;
};
