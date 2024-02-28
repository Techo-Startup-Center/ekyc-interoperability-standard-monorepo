import RegisterOption from "@/components/RegisterOption";
import { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Insurance Web Portal Login",
  description: "Login to Insurance Web Portal",
};

const RegisterPage = () => {
  return (
    <main className="h-screen w-screen grid grid-cols-1 sm:grid-cols-2">
      <div className="hidden h-screen sm:h-auto sm:block col-span-1">
        <div className="flex flex-col h-screen justify-center items-center">
          <Image
            className="w-72 md:w-80 lg:w-96"
            src={"/qr-animate.svg"}
            alt="Aninmate QR"
            width={0}
            height={0}
          />
        </div>
      </div>
      <div className="col-span-1 mx-auto h-screen m:h-auto bg-base-200 w-full">
        <div className="flex justify-center h-screen">
          <div className="flex flex-col justify-center">
            <RegisterOption />
          </div>
        </div>
      </div>
    </main>
  );
};

export default RegisterPage;
