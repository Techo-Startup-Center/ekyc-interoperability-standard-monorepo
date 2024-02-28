import RegisterForm from "@/components/RegisterForm";
import { Metadata } from "next";
import { unstable_noStore as noStore } from "next/cache";

export default async function RegisterInfoPage({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  noStore();
  const data = searchParams?.jti
    ? await (
        await fetch(
          `${process.env.SERVER_URL}/api/v1/request/status?jti=${searchParams?.jti}`
        )
      ).json()
    : {};

  return (
    <div className="h-[calc(100vh-96px)] p-8 bg-base-100">
      <h2 className="font-bold text-xl">Register Information</h2>
      <div className="mt-10">
        <RegisterForm data={data?.user} />
      </div>
    </div>
  );
}

export const metadata: Metadata = {
  title: "Register Info",
  description: "Register your personal information",
};
