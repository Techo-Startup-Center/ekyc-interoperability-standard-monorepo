import axios, { AxiosError } from "axios";
import { NextRequest } from "next/server";
import {unstable_noStore as noStore} from "next/cache"

export async function GET(request: NextRequest) {
  noStore();
  const searchParams = request.nextUrl.searchParams;
  if (!searchParams.has("jti")) {
    return new Response(
      JSON.stringify({ message: "Missing jti query parameter" }),
      {
        status: 400,
        statusText: "BAD_REQUEST",
      }
    );
  }

  try {
    const { data } = await axios.get(
      `${process.env.SERVER_URL}/api/v1/request/status?jti=${searchParams.get(
        "jti"
      )}`
    );

    return Response.json(data);
  } catch (err) {
    if (err instanceof AxiosError) {
      console.error("Failed to get QR status:", err.response?.data);
      return new Response(JSON.stringify(err.response?.data), {
        status: err.response?.status,
        statusText: err.response?.statusText,
      });
    }

    console.error("Failed to get QR status:", err);
    return new Response(JSON.stringify(err), {
      status: 500,
      statusText: "INTERNAL_SERVER_ERROR",
    });
  }
}
