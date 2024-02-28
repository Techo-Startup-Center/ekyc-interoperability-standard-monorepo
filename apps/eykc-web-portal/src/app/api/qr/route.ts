import axios, { AxiosError } from "axios";
import {unstable_noStore as noStore} from "next/cache";

export async function GET() {
  noStore();
  try {
    const { data } = await axios.post(
      `${process.env.SERVER_URL}/api/v1/request/new`
    );
    return Response.json(data);
  } catch (err) {
    if (err instanceof AxiosError) {
      console.error("Failed to get QR:", err.response?.data);
      return new Response(JSON.stringify(err.response?.data), {
        status: err.response?.status,
        statusText: err.response?.statusText,
      });
    }

    console.error("Failed to get QR:", err);
    return new Response(JSON.stringify(err), {
      status: 500,
      statusText: "INTERNAL_SERVER_ERROR",
    });
  }
}
