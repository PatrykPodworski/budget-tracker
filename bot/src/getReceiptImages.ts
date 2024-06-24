import { Attachment, Message } from "discord.js";
import ReceiptImageData from "./ReceiptImageData";

const getReceiptImages = async (message: Message) => {
  // filter out attachments that are not images
  const imageAttachments = message.attachments.filter((attachment) => {
    return attachment.contentType?.startsWith("image");
  });

  if (imageAttachments.size === 0) {
    console.log("No image attachments found.");
    return [];
  }

  console.log(`Found ${imageAttachments.size} image attachments.`);
  // map attachments to ImageData objects
  const imageData = imageAttachments.map(mapToImageData);
  return imageData;
};

const mapToImageData = (
  attachment: Attachment,
  key: string
): ReceiptImageData => {
  const extension = attachment.name.split(".").pop();
  const filename = `${Date.now()}-${key}.${extension}`;
  return {
    filename,
    url: attachment.url,
  };
};

export default getReceiptImages;
