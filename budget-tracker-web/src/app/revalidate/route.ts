import { env } from "@/env";
import { revalidatePath } from "next/cache";
import { NextRequest } from "next/server";

export const GET = async (request: NextRequest) => {
  const secret = request.nextUrl.searchParams.get("secret");
  if (secret !== env.REVALIDATE_SECRET) {
    return new Response(null, { status: 404 });
  }

  revalidatePath("/");

  return new Response();
};
