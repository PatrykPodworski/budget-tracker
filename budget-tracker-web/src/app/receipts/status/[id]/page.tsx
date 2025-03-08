import { ProcessingBundleStatusIndicator } from "./processing-bundle-status-indicator";

const UploadStatusPage = async ({ params }: UploadStatusPageProps) => {
  const { id } = await params;

  return <ProcessingBundleStatusIndicator id={id} />;
};

type UploadStatusPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default UploadStatusPage;
