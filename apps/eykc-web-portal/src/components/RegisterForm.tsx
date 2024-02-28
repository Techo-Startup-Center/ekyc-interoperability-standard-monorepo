"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import React, {
  ChangeEvent,
  FC,
  useCallback,
  useEffect,
  useState,
} from "react";
import { useForm } from "react-hook-form";
import { FaArrowLeft, FaUser } from "react-icons/fa6";

type FormData = {
  phone_number: string;
  first_name: string;
  last_name: string;
  email: string;
  dob: string;
  gender: string;
  document_type: string;
  document_id: string;
  issue_date: string;
  expiry_date: string;
  face_image: string;
  document_image: string;
  pub_key: string;
};

type Props = {
  data?: FormData;
};

const RegisterForm: FC<Props> = ({ data }) => {
  const router = useRouter();
  const { handleSubmit, register, getValues, setValue } = useForm<FormData>({
    defaultValues: data,
  });

  const [image, setImage] = useState(getValues().face_image || "");
  const [docImg, setDocImg] = useState(getValues().document_image || "");

  const getBase64 = useCallback((file: File) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve((reader.result as string).split(",")[1]);
      reader.onerror = (error) => reject(error);
    });
  }, []);

  useEffect(() => {
    if (image.length > 0) {
      setValue("face_image", image);
    }
  }, [image, setValue]);

  useEffect(() => {
    if (docImg.length > 0) {
      setValue("document_image", docImg);
    }
  }, [docImg, setValue]);

  const onProfileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const file = e.target.files[0];
      getBase64(file).then((b64) => {
        setImage(b64 as string);
      });
    }
  };

  const onDocumentChange = async (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const file = e.target.files[0];
      getBase64(file).then((b64) => {
        setDocImg(b64 as string);
      });
    }
  };

  return (
    <form className="form">
      <div className="form-control">
        <label htmlFor="dob" className="col-span-1">
          Date of Birth
        </label>
        <input
          disabled
          id="dob"
          type="date"
          className="col-span-2 input input-bordered disabled"
          value={data?.dob.slice(0, 10)}
        />
      </div>
      <div className="form-control">
        <label htmlFor="gender" className="col-span-1">
          Gender
        </label>
        <select
          className="select select-bordered col-span-2"
          disabled
          {...register("gender")}
        >
          <option key={"m"} value={"Male"}>
            Male
          </option>
          <option key={"f"} value={"Female"}>
            Female
          </option>
        </select>
      </div>
      <div className="form-control">
        <label htmlFor="firstname" className="col-span-1">
          First name
        </label>
        <input
          disabled
          id="firstname"
          type="text"
          className="col-span-2 input input-bordered"
          {...register("first_name")}
        />
      </div>
      <div className="form-control">
        <label htmlFor="lastname" className="col-span-1">
          Last name
        </label>
        <input
          disabled
          id="lastname"
          type="text"
          className="col-span-2 input input-bordered"
          {...register("last_name")}
        />
      </div>
      <div className="form-control">
        <label htmlFor="email" className="col-span-1">
          Email
        </label>
        <input
          disabled
          id="email"
          type="email"
          className="col-span-2 input input-bordered"
          {...register("email")}
        />
      </div>
      <div className="form-control">
        <label htmlFor="phone" className="col-span-1">
          Phone
        </label>
        <input
          disabled
          id="phone"
          type="tel"
          className="col-span-2 input input-bordered"
          {...register("phone_number")}
        />
      </div>
      <div className="form-control">
        <label htmlFor="document_id" className="col-span-1">
          Document ID
        </label>
        <input
          disabled
          id="document_id"
          type="text"
          className="col-span-2 input input-bordered"
          {...register("document_id")}
        />
      </div>
      <div className="form-control">
        <label htmlFor="document_type" className="col-span-1">
          Document Type
        </label>
        <select
          className="select select-bordered col-span-2"
          id="document_type"
          disabled
          {...register("document_type")}
        >
          <option key={"id"} value={"National ID"}>
            National ID
          </option>
          <option key={"passport"} value={"Passport"}>
            Passport
          </option>
        </select>
      </div>
      <div className="form-control">
        <label htmlFor="issue_date" className="col-span-1">
          Issue Date
        </label>
        <input
          disabled
          id="issue_date"
          type="date"
          className="col-span-2 input input-bordered"
          value={data?.issue_date.slice(0, 10)}
        />
      </div>
      <div className="form-control">
        <label htmlFor="expiry_date" className="col-span-1">
          Expiry Date
        </label>
        <input
          disabled
          id="expiry_date"
          type="date"
          className="col-span-2 input input-bordered"
          value={data?.expiry_date.slice(0, 10)}
        />
      </div>
      <div className="form-control">
        <label htmlFor="face_image" className="col-span-1">
          Face Image
        </label>
        <input hidden {...register("face_image")} />
        <input
          disabled
          id="face_image"
          type="file"
          className="col-span-2 file-input w-full"
          onChange={onProfileChange}
        />
        {image && image.length > 0 && (
          <div className="mt-4 col-span-2 flex items-start">
            <Image
              className="rounded-lg"
              src={`data:image/jpeg;base64, ${image}`}
              alt="Face Image"
              width={600}
              height={600}
            />
          </div>
        )}
      </div>
      <div className="form-control">
        <label htmlFor="document_image" className="col-span-1">
          Document Image
        </label>
        <input hidden {...register("document_image")} />
        <input
          disabled
          id="document_image"
          type="file"
          className="col-span-2 file-input w-full"
          onChange={onDocumentChange}
        />
        {docImg && docImg.length > 0 && (
          <div className="mt-4 col-span-2 flex items-start">
            <Image
              className="rounded-lg"
              src={`data:image/jpeg;base64,${docImg}`}
              alt="Document Image"
              width={600}
              height={600}
            />
          </div>
        )}
      </div>
      <div></div>
      <div className="flex gap-8 justify-between col-span-2 md:col-span-1 mt-10">
        <button
          className="btn w-56"
          onClick={(e) => {
            e.preventDefault();
            if (!data) {
              router.push("/register");
            }
          }}
        >
          <FaArrowLeft />
          Go back
        </button>
        <button className="btn btn-secondary w-56" type="submit">
          <FaUser />
          Submit
        </button>
      </div>
    </form>
  );
};

export default RegisterForm;
