import ImageUpload from "@/components/receipt/add-receipt/image-upload";

// TODO: P0 Image upload UI
// TODO: P0 Save image to storage
// TODO: P0 Track processing status
// TODO: P0 Add button to navigate
// TODO: P0 Remove bot
const AddReceipt = async () => {
  return (
    <div className="flex flex-col mx-auto gap-4 max-w-prose">
      <h1 className="text-xl text-center">Add Receipt</h1>
      <ImageUpload />
    </div>
  );
};

export default AddReceipt;
