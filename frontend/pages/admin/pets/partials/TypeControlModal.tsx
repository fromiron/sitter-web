import ModalContainer from "@components/layout/ModalContainer";
import { PetTypeInterface } from "@interfaces/cmsInterfaces";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import RabbitIcon from "@images/rabbit_icon.svg";
import { IoMdAdd, IoMdClose } from "react-icons/io";
import { TextInput } from "@components/inputs";
import { Dispatch, SetStateAction } from "react";
import { UseMutationResult } from "react-query";
import { AxiosError } from "axios";

export function TypeControlModal({
  types,
  isModalOpen,
  setIsModalOpen,
  mutation,
}: {
  types?: PetTypeInterface[];
  isModalOpen: boolean;
  setIsModalOpen: Dispatch<SetStateAction<boolean>>;
  mutation: {
    addPetType: UseMutationResult<
      null,
      AxiosError<unknown, any>,
      {
        name: string;
      },
      unknown
    >;
    deletePetType: UseMutationResult<
      null,
      AxiosError<unknown, any>,
      {
        id: number;
      },
      unknown
    >;
  };
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<{ petType: string }>();

  const onSubmit = ({ petType }: { petType: string }) => {
    const flg = types?.some((item: PetTypeInterface) => item.name === petType);
    if (!!flg) {
      return toast.error(`${petType}はすでに登録されています。`);
    }

    if (petType.length > 0) {
      mutation.addPetType.mutate({ name: petType });
      reset();
    }
  };

  return (
    <ModalContainer
      title="Type 登録"
      show={isModalOpen}
      setShow={setIsModalOpen}
      Icon={RabbitIcon}
    >
      <div className="max-w-xl">
        <div className="flex items-center mb-6">
          <div className="underline text-primary decoration-wavy decoration-success">
            登録済タイプ
          </div>
          <div className="ml-2 badge badge-primary">{types?.length}</div>
        </div>
        <div className="flex flex-wrap w-full gap-2">
          {types?.map((type) => (
            <div
              className="h-auto cursor-pointer w-fit indicator group"
              key={`modal-icon${type.id}`}
              onClick={() => mutation.deletePetType.mutate({ id: type.id })}
            >
              <span className="h-6 p-0 scale-0 rounded-full aspect-square group-hover:scale-100 indicator-item badge badge-error text-neutral-content">
                <IoMdClose />
              </span>
              <div className="p-1 text-xs text-center duration-500 rounded-md select-none group-hover:bg-error bg-purple-50 text-primary hover:bg-error active:bg-error">
                {type.name}
              </div>
            </div>
          ))}
        </div>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex justify-center w-full my-4"
        >
          <TextInput
            errorMsg={errors.petType?.message}
            label={"Type"}
            placeholder={"うさぎ、いぬ、ねこ…"}
            Icon={IoMdAdd}
            register={register("petType", {
              required: "ペットの種類を入力してください",
            })}
          />
        </form>
      </div>
    </ModalContainer>
  );
}
