"use client";

import { useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import Image from "next/image";

// TODO: P0 Improve UI
// TODO: P0 Check mobile behavior
// TODO: P0 Cleanup the code
const ImageUpload = () => {
  const [files, setFiles] = useState<{ preview: string; name: string }[]>([]);
  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      "image/*": [],
    },
    onDrop: (acceptedFiles) => {
      setFiles(
        acceptedFiles.map((file) =>
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          })
        )
      );
    },
  });

  useEffect(() => {
    return () => {
      files.forEach((file) => URL.revokeObjectURL(file.preview));
    };
  }, [files]);

  return (
    <section className="container">
      <div {...getRootProps()} className="dropzone">
        <input {...getInputProps()} />
        <p>Drag &apos;n&apos; drop some files here, or click to select files</p>
      </div>
      <aside>
        {files.map((x, index) => (
          <ImagePreview key={index} src={x.preview} name={x.name} />
        ))}
      </aside>
    </section>
  );
};

const ImagePreview = ({ src, name }: ImagePreviewProps) => (
  <div className="w-24 h-24 p-1">
    <div className="flex">
      <Image alt={name} src={src} width={100} height={100} />
    </div>
  </div>
);

type ImagePreviewProps = {
  src: string;
  name: string;
};

export default ImageUpload;
