import ModalContainer from "@components/layout/ModalContainer";
import { useForm } from "react-hook-form";
import { IoMdAdd, IoMdClose } from "react-icons/io";
import { FaUser } from "react-icons/fa";
import { TextAreaInput, TextInput } from "@components/inputs";
import { ChangeEvent, KeyboardEvent, memo, useEffect } from "react";
import { AxiosError, AxiosResponse } from "axios";
import {
  CustomerBaseInterface,
  CustomerInterface,
  CustomerMemoInterface,
} from "@interfaces/cmsInterfaces";
import { EMAIL_PATTERN, TEL_PATTERN, ZIP_CODE_PATTERN } from "@constants/regex";
import { numberNormalize } from "@helpers/number-normalize";
import insertString from "@helpers/insert-string";
import { axiosClient } from "@lib/axios-client";
import { toast } from "react-toastify";
import { useCustomerContext } from "context/CustomerContext";
import { useCustomerModalContext } from "context/CustomerModalContext";

export function CustomerDetailModal() {
  const {
    editCustomer,
    customer,
    isCustomerLoading,
    addCustomerMemo,
    customerRefetch,
    deleteCustomerMemo,
  } = useCustomerContext();
  const { showCustomerDetailModal, setShowCustomerDetailModal } =
    useCustomerModalContext();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<CustomerInterface>();

  const {
    register: memoRegister,
    handleSubmit: memoHandleSubmit,
    formState: { errors: memoErrors },
    reset: memoReset,
    setValue: memoSetValue,
  } = useForm<CustomerMemoInterface>();

  useEffect(() => {
    // 初期値をデフォルトとしていえる
    reset(customer);
    // memo payloadの顧客idが更新されず、過去のデータが残ってしまうことを修正
    memoSetValue("customer_id", customer?.id!);

    console.log(customer?.memos);

    customerRefetch();
  }, [customer]);

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
    if (window.confirm("更新しますか？")) {
      editCustomer.mutate(data);
    }
  };

  const memoOnSubmit = (data: CustomerMemoInterface) => {
    addCustomerMemo.mutate(data);
    memoReset();
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

  const handleMemoDelete = (id: number | string) => {
    if (window.confirm("削除？")) {
      deleteCustomerMemo.mutate({ id });
    }
  };

  return (
    <ModalContainer
      title={`${customer?.name} 様 No.${customer?.id}`}
      show={showCustomerDetailModal}
      setShow={setShowCustomerDetailModal}
      Icon={FaUser}
    >
      <div className="grid max-w-5xl grid-cols-2 gap-x-4">
        <div className="col-span-1">
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
              <div>※各インプットは長尾しでロックのON/OFFができます。</div>
              <div>
                ※修正後、前に戻したい場合はリセットボタンを押し、その後更新ボタンを押すと以前のデータに復元できます。
              </div>
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

        <div className="col-span-1">
          pets
          <div className="flex flex-col gap-2 my-4">
            {customer?.pets.map((pet) => (
              <div
                key={`${pet.customer.id}_pet_${pet.id}`}
                className="bg-blue-400"
              >
                <div>{pet.name}</div>
                <div>{pet.type.name}</div>
                <div>{pet.breed.name}</div>
              </div>
            ))}
          </div>
          memo
          <div className="flex flex-wrap w-full gap-2 p-4 bg-yellow-50">
            {customer?.memos.map((memo) => (
              <div
                className="h-auto cursor-pointer w-fit indicator group"
                key={`${memo.customer_id}_memo_${memo.id}`}
                onClick={() => handleMemoDelete(memo.id)}
              >
                <span className="h-6 p-0 scale-0 rounded-full aspect-square group-hover:scale-100 indicator-item badge badge-error text-neutral-content">
                  <IoMdClose />
                </span>
                <div className="p-2 text-center duration-500 rounded-md select-none group-hover:bg-error bg-orange-50 text-primary hover:bg-error active:bg-error">
                  {memo.memo}
                </div>
              </div>
            ))}
          </div>
          <form
            onSubmit={memoHandleSubmit(memoOnSubmit)}
            className="flex justify-center w-full gap-4 my-4 rounded-lg"
          >
            <input
              type={"hidden"}
              defaultValue={customer?.id}
              {...memoRegister("customer_id")}
            />

            <TextInput
              errorMsg={memoErrors.memo?.message}
              label={"Memo"}
              placeholder={"ネザーランドドワーフ、柴犬…"}
              Icon={IoMdAdd}
              register={memoRegister("memo", {
                required: "メモを入力してください",
              })}
            />
          </form>
        </div>
      </div>
    </ModalContainer>
  );
}
