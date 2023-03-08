import { TextInput } from "@components/inputs";
import ContentTitle from "@components/layout/ContentTitle";
import {
  MemoInterface,
  CustomerMemoInterface,
} from "@interfaces/cmsInterfaces";
import { useForm } from "react-hook-form";
import { IoMdClose, IoMdAdd } from "react-icons/io";

export default function CustomerMemoPanel({
  addCustomerMemo,
  deleteCustomerMemo,
  memos,
  customerId,
}: {
  addCustomerMemo: any;
  deleteCustomerMemo: any;
  memos: MemoInterface[];
  customerId: number | string;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CustomerMemoInterface>();

  const onSubmit = (data: CustomerMemoInterface) => {
    addCustomerMemo.mutate(data);
    reset();
  };

  const handleMemoDelete = (id: number | string) => {
    if (window.confirm("削除？")) {
      deleteCustomerMemo.mutate({ id });
    }
  };
  return (
    <div className="flex flex-col items-center w-full">
      <ContentTitle title="顧客メモ" />
      <div className="flex flex-col items-center justify-center w-full h-full pb-16">
        <div className="flex flex-wrap w-full gap-2 p-4 overflow-auto transition rounded-lg bg-amber-50 max-h-[100%]">
          {memos.length === 0 ? (
            <span className="opacity-50">メモを登録してください。</span>
          ) : null}
          {memos.map((memo) => (
            <div
              className="h-auto cursor-pointer w-fit indicator group"
              key={`${memo.customer_id}_memo_${memo.id}`}
              onClick={() => handleMemoDelete(memo.id)}
            >
              <span className="h-6 p-0 scale-0 rounded-full aspect-square group-hover:scale-100 indicator-item badge badge-error text-neutral-content">
                <IoMdClose />
              </span>
              <div className="p-2 text-center duration-500 rounded-md select-none group-hover:bg-error bg-amber-100 text-neutral hover:bg-error active:bg-error">
                {memo.memo}
              </div>
            </div>
          ))}
        </div>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex justify-center w-full gap-4 my-4 rounded-lg"
        >
          <input
            type={"hidden"}
            defaultValue={customerId}
            {...register("customer_id")}
          />

          <TextInput
            errorMsg={errors.memo?.message}
            label={"Memo"}
            placeholder={"ネザーランドドワーフ、柴犬…"}
            Icon={IoMdAdd}
            register={register("memo", {
              required: "メモを入力してください",
            })}
          />
        </form>
      </div>
    </div>
  );
}
