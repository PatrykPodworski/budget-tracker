import Image from "next/image";

export const ImagePreviews = ({ previews }: ImagePreviewsProps) => (
  <div className="flex flex-wrap gap-2">
    {previews.map((x, index) => (
      <div key={index}>
        <Image alt={x} src={x} width={100} height={100} />
      </div>
    ))}
  </div>
);

type ImagePreviewsProps = {
  previews: string[];
};
