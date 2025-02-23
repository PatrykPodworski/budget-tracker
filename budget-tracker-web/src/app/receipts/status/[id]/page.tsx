import { getProcessingBundle } from "@/lib/upload/get-processing-bundle";
import { notFound } from "next/navigation";

const UploadStatusPage = async ({ params }: UploadStatusPageProps) => {
  const { id } = await params;
  const processingBundle = await getProcessingBundle(id);

  if (!processingBundle) {
    notFound();
  }

  return <div>{JSON.stringify(processingBundle)}</div>;
};

type UploadStatusPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default UploadStatusPage;
