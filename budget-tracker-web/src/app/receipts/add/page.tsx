import ImageUpload from "@/components/receipt/add-receipt/image-upload";
import { Button } from "@/components/ui/shadcn/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

// TODO: P0 Remove bot
const AddReceipt = async () => {
  return (
    <div className="flex flex-col mx-auto gap-4 max-w-prose">
      <div className="relative">
        <Link href="/" passHref>
          <Button variant="outline" className="absolute left-0 top-0">
            <ArrowLeft size={24} />
            Back
          </Button>
        </Link>
        <h1 className="text-xl text-center">Add Receipt</h1>
      </div>
      <ImageUpload />
    </div>
  );
};

export default AddReceipt;
