"use client";

import { useDropzone } from "react-dropzone";

// TODO: P1 Style disabled state
export const ImageDropzone = ({ onDrop, disabled }: ImageDropzoneProps) => {
  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      "image/*": [],
    },
    onDrop,
    disabled,
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
  disabled?: boolean;
};
