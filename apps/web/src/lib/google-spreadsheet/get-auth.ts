"use server";
import { env } from "@/env";
import { JWT } from "google-auth-library";

export const getAuth = async () => {
  const decodedAccount = Buffer.from(
    env.GOOGLE_SERVICE_ACCOUNT_BASE64,
    "base64"
  ).toString("utf-8");

  const credentials = JSON.parse(decodedAccount);

  const auth = new JWT({
    email: credentials.client_email,
    key: credentials.private_key,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });

  return auth;
};
