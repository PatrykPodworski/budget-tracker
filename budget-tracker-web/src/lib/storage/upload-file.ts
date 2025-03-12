"use server";

import { BlockBlobClient } from "@azure/storage-blob";
import mime from "mime-types";
import { env } from "@/env";

export const uploadFiles = async (files: UploadFile[], folderName?: string) => {
  const promises = files.map((file) => uploadFile(file, folderName));
  await Promise.all(promises);
};

const uploadFile = async (file: UploadFile, folderName?: string) => {
  const fileName = getFileName(file.id, file.type);
  const blobPath = folderName ? `${folderName}/${fileName}` : fileName;

  const blobService = new BlockBlobClient(
    env.AZURE_STORAGE_CONNECTION_STRING,
    env.AZURE_STORAGE_CONTAINER_NAME,
    blobPath
  );

  await blobService.uploadData(file.buffer, {
    blobHTTPHeaders: {
      blobContentType: file.type,
    },
  });
};

const getFileName = (id: string, type: string) => {
  const extension = mime.extension(type);
  if (!extension) {
    throw new Error(`Could not determine extension for type: ${type}`);
  }

  return `${id}.${extension}`;
};

export type UploadFile = {
  id: string;
  type: string;
  buffer: ArrayBuffer;
};
