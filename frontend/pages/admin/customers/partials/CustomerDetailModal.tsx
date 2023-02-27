import ModalContainer from "@components/layout/ModalContainer";
import { useForm } from "react-hook-form";
import { IoMdAdd } from "react-icons/io";
import { FaUser } from "react-icons/fa";
import { TextAreaInput, TextInput } from "@components/inputs";
import { ChangeEvent, KeyboardEvent, useEffect } from "react";
import { AxiosError, AxiosResponse } from "axios";
import {
  CustomerBaseInterface,
  CustomerInterface,
} from "@interfaces/cmsInterfaces";
import { TEL_PATTERN, ZIP_CODE_PATTERN } from "@constants/regex";
import { numberNormalize } from "@helpers/number-normalize";
import insertString from "@helpers/insert-string";
import { axiosClient } from "@lib/axios-client";
import { toast } from "react-toastify";
import { useCustomerContext } from "context/CustomerContext";
import { useCustomerModalContext } from "context/CustomerModalContext";

export function CustomerDetailModal() {
  const { editCustomer, customer, isCustomerLoading } = useCustomerContext();
  const { showCustomerDetailModal, setShowCustomerDetailModal } =
    useCustomerModalContext();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<CustomerInterface>();

  useEffect(() => {
    if (customer) {
      // 初期値をデフォルトとしていえる
      reset(customer);
    }
  }, [customer?.id]);

  if (isCustomerLoading) {
    return null;
  }
  const getAddress = async (zipcode: string) => {
    const res: void | AxiosResponse<any, any> = await axiosClient
      .get(`https://zipcloud.ibsnet.co.jp/api/search?zipcode=${zipcode}`)
      .catch((error: AxiosError) => {
        toast.error("住所取得に失敗しました。");
      });
    if (res?.status === 200) {
      try {
        const result = res?.data?.results[0];
        const address =
          result["address1"] + result["address2"] + result["address3"];
        setValue("address", address);
        toast.success("郵便番号から住所情報を朱徳しました。");
      } catch (e) {
        toast.error("住所取得に失敗しました。");
      }
    }
  };
  const handleReset = () => reset();
  const onSubmit = (data: CustomerBaseInterface) => {
    console.log(data);
    editCustomer.mutate(data);
  };

  const checkKeyDown = (e: KeyboardEvent<HTMLFormElement>) => {
    // 入力途中エンター入力でのSubmitをブロック
    if (e.code === "Enter") e.preventDefault();
  };

  const handleZipcode = async (event: ChangeEvent<HTMLInputElement>) => {
    let value = event.target.value;
    if (value.length >= 4) {
      value = value.replace("ー", "-");
      if (!value.includes("-")) {
        value = insertString({ original: value, position: 3, insert: "-" });
      }
    }
    const zipcode = numberNormalize(value);
    setValue("zipcode", zipcode);
    if (value.length >= 8) {
      await getAddress(zipcode.replace("-", ""));
    }
  };

  const handleTelNumber = async (
    event: ChangeEvent<HTMLInputElement>,
    key: keyof CustomerBaseInterface
  ) => {
    let value = event.target.value;
    const tel = numberNormalize(value);
    setValue(key, tel);
  };

  return (
    <ModalContainer
      title={`${customer?.name} 様`}
      show={showCustomerDetailModal}
      setShow={setShowCustomerDetailModal}
      Icon={FaUser}
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid grid-cols-2 gap-x-4"
        onKeyDown={(e) => checkKeyDown(e)}
      >
        <TextInput
          colSpan={1}
          errorMsg={errors.name?.message}
          label={"名前"}
          placeholder={"空野うさぎ"}
          Icon={IoMdAdd}
          register={register("name", {
            required: "漢字名を入力してください。",
          })}
        />
        <TextInput
          colSpan={1}
          errorMsg={errors.name_kana?.message}
          label={"かな名 (optional)"}
          placeholder={"そらのうさぎ"}
          Icon={IoMdAdd}
          register={register("name_kana")}
        />
        <TextInput
          colSpan={1}
          errorMsg={errors.tel?.message}
          label={"連絡先"}
          placeholder={"〇〇〇‐〇〇〇-〇〇〇"}
          Icon={IoMdAdd}
          maxLength={13}
          minLength={11}
          register={register("tel", {
            required: "連絡先を入力してください。",
            pattern: {
              value: TEL_PATTERN,
              message: "012-3456-7890のように入力してください。",
            },
            onChange: (e) => handleTelNumber(e, "tel"),
          })}
        />
        <TextInput
          colSpan={1}
          errorMsg={errors.tel2?.message}
          label={"緊急連絡先 (optional)"}
          placeholder={"〇〇〇‐〇〇〇-〇〇〇"}
          Icon={IoMdAdd}
          maxLength={13}
          minLength={11}
          register={register("tel2", {
            pattern: {
              value: TEL_PATTERN,
              message: "012-3456-7890のように入力してください。",
            },
            onChange: (e) => handleTelNumber(e, "tel2"),
          })}
        />
        <div className="w-full col-span-1">
          <TextInput
            errorMsg={errors.zipcode?.message}
            label={"郵便番号 (optional)"}
            placeholder={"064-○○○〇"}
            Icon={IoMdAdd}
            type={"tel"}
            maxLength={8}
            minLength={7}
            register={register("zipcode", {
              pattern: {
                value: ZIP_CODE_PATTERN,
                message: "012-3456のように入力してください。",
              },
              onChange: (e) => handleZipcode(e),
            })}
          />
        </div>
        <TextAreaInput
          colSpan={2}
          errorMsg={errors.address?.message}
          label={"住所"}
          placeholder={"札幌市○○区"}
          Icon={IoMdAdd}
          rows={2}
          register={register("address", {
            required: "住所を入力してください。",
          })}
        />

        <div className="flex justify-center w-full mt-10 col-span-full gap-x-4">
          <button
            onClick={handleReset}
            className="btn btn-outline border-base-200"
          >
            リセット
          </button>
          <button type={"submit"} className="btn btn-primary">
            登録
          </button>
        </div>
      </form>
    </ModalContainer>
  );
}
