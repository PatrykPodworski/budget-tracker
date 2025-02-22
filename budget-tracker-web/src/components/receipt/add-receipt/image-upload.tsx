"use client";

import { useState } from "react";
import { Button } from "@/components/ui/shadcn/button";
import { uploadFiles } from "@/lib/storage/upload-file";
import { ImageDropzone } from "./image-dropzone";
import { ImagePreviews } from "./image-previews";
import { LoadingButton } from "@/components/ui/loading-button";

// TODO: P0 Improve UI
// TODO: P0 Check mobile behavior
// TODO: P0 Upload from clipboard
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
    const filesToUpload = await Promise.all(
      Array.from(files).map(async (file) => ({
        buffer: await file.arrayBuffer(),
        type: file.type,
      }))
    );

    await uploadFiles(filesToUpload);
    setIsLoading(false);

    // TODO: P0 Redirect to status page
    handleReset();
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

export default ImageUpload;
