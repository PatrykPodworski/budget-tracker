import { ProcessingBundleStatus } from "@/components/processing-bundles/processing-bundle-status";

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
