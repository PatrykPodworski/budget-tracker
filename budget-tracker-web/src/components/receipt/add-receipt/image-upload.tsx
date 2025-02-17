"use client";

import { useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import Image from "next/image";
import { Button } from "@/components/ui/shadcn/button";
import { addReceiptImage } from "@/lib/receipt-data/add-receipt-image";

// TODO: P0 Improve UI
// TODO: P0 Check mobile behavior
// TODO: P0 Cleanup the code
const ImageUpload = () => {
  const [files, setFiles] = useState<ImageFile[]>([]);
  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      "image/*": [],
    },
    onDrop: (acceptedFiles) => {
      const newFiles: ImageFile[] = acceptedFiles.map((file) => ({
        ...file,
        preview: URL.createObjectURL(file),
      }));

      setFiles(newFiles);
    },
  });

  useEffect(() => {
    return () => {
      files.forEach((file) => URL.revokeObjectURL(file.preview));
    };
  }, [files]);

  const handleUpload = async () => {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append("file", file);
    });
    await addReceiptImage(formData);
  };

  return (
    <section className="flex flex-col gap-4 items-start">
      <div {...getRootProps()}>
        <input {...getInputProps()} />
        <p>Drag &apos;n&apos; drop some files here, or click to select files</p>
      </div>
      <aside className="flex flex-wrap gap-2">
        {files.map((x, index) => (
          <ImagePreview key={index} src={x.preview} name={x.name} />
        ))}
      </aside>
      <Button onClick={handleUpload}>Upload</Button>
    </section>
  );
};

// TODO: P0 Remove image
const ImagePreview = ({ src, name }: ImagePreviewProps) => (
  <div>
    <Image alt={name} src={src} width={100} height={100} />
  </div>
);

type ImagePreviewProps = {
  src: string;
  name: string;
};

type ImageFile = File & {
  preview: string;
};

export default ImageUpload;
