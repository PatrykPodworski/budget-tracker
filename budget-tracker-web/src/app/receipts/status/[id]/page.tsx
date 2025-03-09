import { ProcessingBundleStatus } from "./processing-bundle-status";

const ProcessingBundleStatusPage = async ({
  params,
}: ProcessingBundleStatusPageProps) => {
  const { id } = await params;

  return <ProcessingBundleStatus id={id} />;
};

type ProcessingBundleStatusPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default ProcessingBundleStatusPage;
