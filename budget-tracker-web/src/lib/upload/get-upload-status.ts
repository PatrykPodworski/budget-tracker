"use server";
export const getUploadStatus = async (id: string) => {
  return id.startsWith("a") ? id : null;
};
