"use server";

export const addReceiptImage = async (formData: FormData) => {
  const files = formData.getAll("file");

  console.log("Files", files);
};
