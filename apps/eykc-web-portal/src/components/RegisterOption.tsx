"use client";

import Image from "next/image";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { FaUserCheck, FaUserPlus, FaArrowLeft } from "react-icons/fa6";
import Link from "next/link";
import { useEffect } from "react";
import { Router } from "next/router";
import { useRouter, useSearchParams } from "next/navigation";
import RegisterForm from "./RegisterForm";

const RegisterOption = () => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const searchParams = useSearchParams();

  const getQr = async () => {
    const { data } = await axios.get("/api/qr");
    return data;
  };

  const {
    data: qrData,
    refetch,
    isLoading,
  } = useQuery({
    queryKey: ["get-qr"],
    queryFn: getQr,
    enabled: false,
  });

  useEffect(() => {
    if (qrData) {
      router.push(`/register?jti=${qrData.jti}`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [qrData]);

  const checkStatus = async () => {
    const { data } = await axios.get(
      `/api/qr/status?jti=${searchParams.get("jti")}`
    );
    return data;
  };

  const { data: statusData } = useQuery({
    queryKey: ["check-status"],
    queryFn: checkStatus,
    enabled: searchParams.has("jti") && qrData !== undefined,
    refetchInterval: () => {
      if (searchParams.has("jti") && qrData) {
        return 500;
      }

      return false;
    },
  });

  useEffect(() => {
    if (statusData && statusData.message === "Success") {
      router.push(`/register/info?jti=${qrData?.jti}`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusData]);

  return (
    <div className="card w-96 bg-base-100 shadow-xl">
      {qrData ? (
        <div className="card-body gap-8">
          <h2 className="card-title justify-center">
            Scan qr code with your bank app
          </h2>
          <div className="flex flex-col gap-4 items-center">
            <Image
              src={`data:image/jpeg;base64, ${qrData.qr_img}`}
              alt="QR Code"
              width={0}
              height={0}
              className="w-60"
            />
            <button
              className="btn btn-wide btn-secondary"
              onClick={async () => {
                try {
                  await navigator.clipboard.writeText(qrData.qr);
                  console.log("QR code copied to clipboard");
                } catch (err) {
                  console.error("Failed to copy text: ", err);
                }
              }}
            >
              <FaUserCheck /> Copy QR
            </button>
            <button
              className="btn btn-wide items-center"
              onClick={() => {
                queryClient.resetQueries({ queryKey: ["get-qr"] });
                router.push("/register");
              }}
            >
              <FaArrowLeft />
              Go back
            </button>
          </div>
        </div>
      ) : (
        <div className="card-body gap-8">
          <h2 className="card-title justify-center">
            Insurance Registration Portal
          </h2>
          <div className="flex flex-col gap-4">
            <p>
              Welcome to our Insurance Registration Portal. Register to manage
              your policies, make claims, and more.
            </p>
            <div className="card-actions flex-col items-center">
              <Link
                href="/register/info"
                className="btn btn-wide items-center btn-secondary"
              >
                <FaUserPlus />
                Register
              </Link>
              <button
                className={`btn btn-wide items-center btn-primary ${
                  isLoading && "btn-disabled"
                }`}
                onClick={() => {
                  refetch();
                }}
              >
                {isLoading ? (
                  <>
                    <span className="loading loading-spinner" />
                    Getting QR
                  </>
                ) : (
                  <>
                    <FaUserCheck /> Register with Partner Banks
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RegisterOption;
