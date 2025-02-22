import { getUploadStatus } from "@/lib/upload/get-upload-status";
import { notFound } from "next/navigation";

const UploadStatusPage = async ({ params }: UploadStatusPageProps) => {
  const { id } = await params;
  const uploadStatus = await getUploadStatus(id);

  if (!uploadStatus) {
    notFound();
  }

  return <div>{JSON.stringify(uploadStatus)}</div>;
};

type UploadStatusPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default UploadStatusPage;
