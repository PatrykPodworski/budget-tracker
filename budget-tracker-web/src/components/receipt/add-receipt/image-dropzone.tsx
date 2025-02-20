"use client";

import { useDropzone } from "react-dropzone";

export const ImageDropzone = ({ onDrop }: ImageDropzoneProps) => {
  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      "image/*": [],
    },
    onDrop,
  });

  return (
    <div
      {...getRootProps()}
      className="w-full h-96 border-dashed border flex items-center justify-center bg-white"
    >
      <input {...getInputProps()} />
      <p>Drag &apos;n&apos; drop some files here, or click to select files</p>
    </div>
  );
};

type ImageDropzoneProps = {
  onDrop: (files: File[]) => void;
};
