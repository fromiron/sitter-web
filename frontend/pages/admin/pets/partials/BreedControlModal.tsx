import ModalContainer from "@components/layout/ModalContainer";
import { PetBreedInterface, PetTypeInterface } from "@interfaces/cmsInterfaces";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import RabbitIcon from "@images/rabbit_icon.svg";
import { IoMdAdd, IoMdClose } from "react-icons/io";
import { SelectInput, TextInput } from "@components/inputs";
import { Dispatch, SetStateAction } from "react";
import { UseMutationResult } from "react-query";
import { AxiosError } from "axios";
import { IconBaseProps } from "react-icons";

export function BreedControlModal({
  breeds,
  types,
  isModalOpen,
  setIsModalOpen,
  mutation,
}: {
  breeds?: PetBreedInterface[];
  types?: PetTypeInterface[];
  isModalOpen: boolean;
  setIsModalOpen: Dispatch<SetStateAction<boolean>>;
  mutation: {
    addPetBreed: UseMutationResult<
      null,
      AxiosError<unknown, any>,
      {
        name: string;
        type_id: number;
      },
      unknown
    >;
    deletePetBreed: UseMutationResult<
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
  } = useForm<{ petBreed: string; petType: number }>();

  const onSubmit = ({
    petBreed,
    petType,
  }: {
    petBreed: string;
    petType: number;
  }) => {
    const flg = breeds?.some(
      (item: PetBreedInterface) => item.name === petBreed
    );
    if (!!flg) {
      return toast.error(`${petBreed}はすでに登録されています。`);
    }

    if (petBreed.length > 0) {
      mutation.addPetBreed.mutate({ name: petBreed, type_id: petType });
      reset();
    }
  };

  return (
    <ModalContainer
      title="品種管理"
      show={isModalOpen}
      setShow={setIsModalOpen}
      Icon={RabbitIcon}
    >
      <div className="max-w-xl">
        <div className="flex items-center mb-6">
          <div className="underline text-primary decoration-wavy decoration-success">
            登録済品種
          </div>
          <div className="ml-2 badge badge-primary">{breeds?.length}</div>
        </div>
        <div className="flex flex-wrap w-full gap-2">
          {breeds?.map((breed) => (
            <div
              className="h-auto cursor-pointer w-fit indicator group"
              key={`modal-icon${breed.id}`}
              onClick={() => mutation.deletePetBreed.mutate({ id: breed.id })}
            >
              <span className="h-6 p-0 scale-0 rounded-full aspect-square group-hover:scale-100 indicator-item badge badge-error text-neutral-content">
                <IoMdClose />
              </span>
              <div className="p-1 text-xs text-center duration-500 rounded-md select-none group-hover:bg-error bg-purple-50 text-primary hover:bg-error active:bg-error">
                {breed.name}
              </div>
            </div>
          ))}
        </div>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex justify-center w-full gap-4 my-4"
        >
          <div className="w-fit">
            <SelectInput
              label={"Type"}
              Icon={IoMdAdd}
              register={register("petType")}
            >
              <>
                <option>タイプ</option>
                {types?.map((type) => (
                  <option key={`type${type.id}`} value={type.id}>
                    {type.name}
                  </option>
                ))}
              </>
            </SelectInput>
          </div>
          <TextInput
            errorMsg={errors.petBreed?.message}
            label={"Breed"}
            placeholder={"ネザーランドドワーフ、柴犬…"}
            Icon={IoMdAdd}
            register={register("petBreed", {
              required: "ペットの種類を入力してください",
            })}
          />
        </form>
      </div>
    </ModalContainer>
  );
}
