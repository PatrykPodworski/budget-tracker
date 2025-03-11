"use client";

import { useState } from "react";
import { Button } from "@/components/ui/shadcn/button";
import { ImageDropzone } from "./image-dropzone";
import { ImagePreviews } from "./image-previews";
import { LoadingButton } from "@/components/ui/loading-button";
import { createProcessingBundle } from "@/lib/processing-bundle/create-processing-bundle";
import { redirect } from "next/navigation";

// TODO: P1 Improve UI
// TODO: P1 Check mobile behavior
// TODO: P1 Upload from clipboard
const ImageUpload = () => {
  const [files, setFiles] = useState<FileList>();
  const [previews, setPreviews] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleFileDrop = (files: File[]) => {
    const dataTransfer = new DataTransfer();
    files.forEach((file) => dataTransfer.items.add(file));
    setFiles(dataTransfer.files);
    setPreviews(files.map((x) => URL.createObjectURL(x)));
  };

  const handleUpload = async () => {
    if (!files) {
      return;
    }

    setIsLoading(true);
    const filesToUpload = await mapFilesToUpload(files);
    const processingBundleId = await createProcessingBundle(filesToUpload);
    // TODO: P2 Add Centralized Route Management
    // TODO: P0 Move the processing status page
    redirect(`/receipts/status/${processingBundleId}`);
  };

  const handleReset = () => {
    setFiles(undefined);
    setPreviews([]);
  };

  const isUploadDisabled = !files || files.length === 0 || isLoading;

  return (
    <section className="flex flex-col gap-4 items-start">
      <ImageDropzone onDrop={handleFileDrop} disabled={isLoading} />
      <ImagePreviews previews={previews} />
      <div className="flex gap-2 w-full justify-center">
        <LoadingButton
          loading={isLoading}
          onClick={handleUpload}
          disabled={isUploadDisabled}
        >
          Upload
        </LoadingButton>
        <Button
          variant="outline"
          onClick={handleReset}
          disabled={isUploadDisabled}
        >
          Reset
        </Button>
      </div>
    </section>
  );
};

const mapFilesToUpload = async (files: FileList) =>
  await Promise.all(
    Array.from(files).map(async (file) => ({
      buffer: await file.arrayBuffer(),
      type: file.type,
    }))
  );

export default ImageUpload;
