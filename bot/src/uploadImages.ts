import { BlockBlobClient } from "@azure/storage-blob";
import ReceiptImageData from "./ReceiptImageData";
import { config } from "./config";

let numberOfImagesUploaded = 0;
const logProgress = () => {
  numberOfImagesUploaded++;
  console.log(
    `Uploaded ${numberOfImagesUploaded} ${numberOfImagesUploaded == 1 ? "image" : "images"}.`
  );
};

const uploadImages = async (images: ReceiptImageData[]) => {
  for (const image of images) {
    await uploadImage(image);
  }
};

const uploadImage = async (image: ReceiptImageData) => {
  try {
    const blobService = new BlockBlobClient(
      config.AZURE_STORAGE_CONNECTION_STRING,
      config.AZURE_STORAGE_CONTAINER_NAME,
      image.filename
    );

    await blobService.syncUploadFromURL(image.url);
    logProgress();
  } catch (error) {
    console.error(`Error uploading image: ${error}`);
  }
};

export default uploadImages;
