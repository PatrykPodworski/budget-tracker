"use client";

import { useState } from "react";
import { useDropzone } from "react-dropzone";
import Image from "next/image";
import { Button } from "@/components/ui/shadcn/button";
import { uploadFiles } from "@/lib/storage/upload-file";

// TODO: P0 Improve UI
// TODO: P0 Check mobile behavior
// TODO: P0 Cleanup the code
// TODO: P0 Upload from clipboard
const ImageUpload = () => {
  const [files, setFiles] = useState<FileList>();
  const [previews, setPreviews] = useState<string[]>([]);
  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      "image/*": [],
    },
    onDrop: (acceptedFiles) => {
      const dataTransfer = new DataTransfer();
      acceptedFiles.forEach((file) => dataTransfer.items.add(file));
      setFiles(dataTransfer.files);
      setPreviews(acceptedFiles.map((x) => URL.createObjectURL(x)));
    },
  });

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
      <div
        {...getRootProps()}
        className="w-full h-96 border-dashed border flex items-center justify-center bg-white"
      >
        <input {...getInputProps()} />
        <p>Drag &apos;n&apos; drop some files here, or click to select files</p>
      </div>
      <aside className="flex flex-wrap gap-2">
        {previews.map((x, index) => (
          <ImagePreview key={index} src={x} />
        ))}
      </aside>
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

const ImagePreview = ({ src }: ImagePreviewProps) => (
  <div>
    <Image alt={src} src={src} width={100} height={100} />
  </div>
);

type ImagePreviewProps = {
  src: string;
};

type ImagePreview = File & {
  preview: string;
};

export default ImageUpload;
