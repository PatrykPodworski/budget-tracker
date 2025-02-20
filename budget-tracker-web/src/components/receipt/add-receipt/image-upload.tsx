"use client";

import { useState } from "react";
import { Button } from "@/components/ui/shadcn/button";
import { uploadFiles } from "@/lib/storage/upload-file";
import { ImageDropzone } from "./image-dropzone";
import { ImagePreviews } from "./image-previews";

// TODO: P0 Add loading state
// TODO: P0 Redirect to status page after upload
// TODO: P0 Improve UI
// TODO: P0 Check mobile behavior
// TODO: P0 Upload from clipboard
const ImageUpload = () => {
  const [files, setFiles] = useState<FileList>();
  const [previews, setPreviews] = useState<string[]>([]);

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

    const filesToUpload = await Promise.all(
      Array.from(files).map(async (file) => ({
        buffer: await file.arrayBuffer(),
        type: file.type,
      }))
    );

    await uploadFiles(filesToUpload);
  };

  const handleReset = () => {
    setFiles(undefined);
    setPreviews([]);
  };

  const isUploadDisabled = !files || files.length === 0;

  return (
    <section className="flex flex-col gap-4 items-start">
      <ImageDropzone onDrop={handleFileDrop} />
      <ImagePreviews previews={previews} />
      <div className="flex gap-2 w-full justify-center">
        <Button onClick={handleUpload} disabled={isUploadDisabled}>
          Upload
        </Button>
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
