import { TextInput, TextAreaInput } from "@components/inputs";
import ContentTitle from "@components/layout/ContentTitle";
import { TEL_PATTERN, EMAIL_PATTERN, ZIP_CODE_PATTERN } from "@constants/regex";
import insertString from "@helpers/insert-string";
import { numberNormalize } from "@helpers/number-normalize";
import {
  CustomerInterface,
  CustomerBaseInterface,
} from "@interfaces/cmsInterfaces";
import { axiosClient } from "@lib/axios-client";
import { AxiosError, AxiosResponse } from "axios";
import { useEffect, KeyboardEvent, ChangeEvent } from "react";
import { useForm } from "react-hook-form";
import { IoMdAdd } from "react-icons/io";
import { UseMutationResult } from "react-query";
import { toast } from "react-toastify";

export default function CustomerPanel({
  customer,
  editCustomer,
}: {
  customer: CustomerInterface;
  editCustomer: UseMutationResult<
    null,
    AxiosError<unknown, any>,
    CustomerBaseInterface,
    unknown
  >;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<CustomerInterface>();
  useEffect(() => {
    // 初期値をデフォルトとしていえる
    reset(customer);
  }, [customer]);

  const handleReset = () => reset();
  const onSubmit = (data: CustomerBaseInterface) => {
    if (window.confirm("更新しますか？")) {
      editCustomer.mutate(data);
    }
  };
  const checkKeyDown = (e: KeyboardEvent<HTMLFormElement>) => {
    // 入力途中エンター入力でのSubmitをブロック
    if (e.code === "Enter") e.preventDefault();
  };

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
    <div className="flex flex-col items-center w-full">
      <ContentTitle title="顧客情報" />
      <div className="flex items-center justify-center w-full h-full">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid grid-cols-2 gap-x-4"
          onKeyDown={(e) => checkKeyDown(e)}
        >
          <input
            type={"hidden"}
            defaultValue={customer?.id}
            {...register("id")}
          />
          <TextInput
            readonly={true}
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
            readonly={true}
            colSpan={1}
            errorMsg={errors.name_kana?.message}
            label={"かな名 (optional)"}
            placeholder={"そらのうさぎ"}
            Icon={IoMdAdd}
            register={register("name_kana")}
          />
          <TextInput
            readonly={true}
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
            readonly={true}
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
          <TextInput
            readonly={true}
            colSpan={1}
            type={"email"}
            errorMsg={errors.email?.message}
            label={"メール (optional)"}
            placeholder={"hana@rabbit.com"}
            Icon={IoMdAdd}
            register={register("email", {
              pattern: {
                value: EMAIL_PATTERN,
                message: "メールフォーマットを確認してください。",
              },
            })}
          />
          <TextInput
            readonly={true}
            colSpan={1}
            errorMsg={errors.name_kana?.message}
            label={"Line (optional)"}
            placeholder={"hana"}
            Icon={IoMdAdd}
            register={register("line")}
          />
          <div className="w-full col-span-1">
            <TextInput
              readonly={true}
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
            readonly={true}
            errorMsg={errors.address?.message}
            label={"住所"}
            placeholder={"札幌市○○区"}
            Icon={IoMdAdd}
            rows={2}
            register={register("address", {
              required: "住所を入力してください。",
            })}
          />
          <div className="col-span-2 my-4 text-xs text-error">
            <div>※各インプットは長押しにてロックのON/OFFができます。</div>
          </div>
          <div className="flex justify-center w-full col-span-full gap-x-4">
            <button
              type="button"
              onClick={handleReset}
              className="btn btn-outline border-base-200"
            >
              リセット
            </button>
            <button type={"submit"} className="btn btn-primary">
              更新
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
