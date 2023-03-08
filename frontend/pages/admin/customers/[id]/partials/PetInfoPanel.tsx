import { TextInput, SelectInput } from "@components/inputs";
import ContentTitle from "@components/layout/ContentTitle";
import { PetInterface } from "@interfaces/cmsInterfaces";
import { useEffect, KeyboardEvent, useRef } from "react";
import { useForm } from "react-hook-form";
import { IoMdAdd } from "react-icons/io";
import Image from "next/image";
import RabbitIcon from "@images/rabbit_icon.svg";
import { UseMutationResult } from "react-query";
import { AxiosError } from "axios";

export default function PetInfoPanel({
  selectedPet,
  editPet,
  uploadImage,
}: {
  selectedPet?: PetInterface | null;
  editPet: UseMutationResult<
    null,
    AxiosError<unknown, any>,
    PetInterface,
    unknown
  >;
  uploadImage: UseMutationResult<
    null,
    AxiosError<unknown, any>,
    { id?: number; formData: object; customerId?: number },
    unknown
  >;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<PetInterface>();
  const imageRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // 初期値をデフォルトとしていえる
    if (selectedPet) {
      reset(selectedPet);
    }
  }, [selectedPet]);
  const handleReset = () => reset();
  const onSubmit = (data: PetInterface) => {
    if (window.confirm("更新しますか？")) {
      if (data?.death?.length === 0) {
        data.death = null;
      }
      editPet.mutate(data);
      console.log(data);
    }
  };
  const checkKeyDown = (e: KeyboardEvent<HTMLFormElement>) => {
    // 入力途中エンター入力でのSubmitをブロック
    if (e.code === "Enter") e.preventDefault();
  };

  const onImageClick = () => {
    console.log("onImageClick");
    if (imageRef.current) {
      imageRef.current.click();
    }
  };

  const onImageChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    id?: number
  ) => {
    console.log("onImageChange", id);
    if (event.target.files) {
      const image = event.target.files[0];
      const formData = new FormData();
      formData.append("image", image);
      console.log(formData);
      console.log("type", typeof formData);
      uploadImage.mutate({
        id: selectedPet?.id,
        formData: formData,
        customerId: selectedPet?.customer.id,
      });
    }
  };
  return (
    <div className="flex flex-col items-center w-full">
      <ContentTitle title="ペット情報" />
      <div className="flex items-center justify-center w-full h-full">
        <input
          type="file"
          className="hidden"
          accept="image/*"
          onChange={(event) => onImageChange(event, selectedPet?.id)}
          ref={imageRef}
        />
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid grid-cols-2 gap-x-4"
          onKeyDown={(e) => checkKeyDown(e)}
        >
          <div
            onClick={onImageClick}
            className="flex items-center justify-center w-full ml-2 transition duration-500 cursor-pointer group hover:grayscale"
          >
            <div className="avatar">
              <div
                className={`w-24 mask mask-squircle bg-slate-200 ${
                  selectedPet?.death ? "grayscale" : null
                }`}
              >
                <div className="absolute z-10 flex items-center justify-center w-full h-full text-white transition duration-500 opacity-0 select-none bg-neutral group-hover:opacity-50">
                  UPLOAD
                </div>
                {selectedPet?.thumbnail ? (
                  <Image
                    className="object-cover"
                    src={selectedPet?.thumbnail}
                    alt={"pet image"}
                    fill
                    unoptimized
                  />
                ) : (
                  <div className="flex items-center justify-center w-full h-full text-base-100">
                    <RabbitIcon className={"w-8 h-8"} />
                  </div>
                )}
              </div>
            </div>
          </div>
          <input
            type={"hidden"}
            defaultValue={selectedPet?.id}
            {...register("id")}
          />
          <div className="flex flex-col justify-end h-full bg-red">
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
          </div>
          <TextInput
            readonly={true}
            colSpan={1}
            errorMsg={errors.name?.message}
            label={"タイプ"}
            placeholder={"うさぎ"}
            Icon={IoMdAdd}
            register={register("type.name", {
              required: "タイプを入力してください。",
            })}
          />
          <TextInput
            readonly={true}
            colSpan={1}
            errorMsg={errors.name?.message}
            label={"品種"}
            placeholder={"ネザーランドドワーフ"}
            Icon={IoMdAdd}
            register={register("breed.name", {
              required: "品種を入力してください。",
            })}
          />
          <SelectInput
            readonly={true}
            label={"生別"}
            Icon={IoMdAdd}
            register={register("sex")}
          >
            <option disabled>性別</option>
            <option value={"true"}>男の子</option>
            <option value={"false"}>女の子</option>
          </SelectInput>
          <TextInput
            readonly={true}
            colSpan={1}
            errorMsg={errors.name?.message}
            label={"体重"}
            placeholder={"1320"}
            Icon={IoMdAdd}
            register={register("weight", {
              required: "体重を入力してください。",
            })}
          />
          <TextInput
            readonly={true}
            colSpan={1}
            type={"date"}
            errorMsg={errors.name?.message}
            label={"誕生日"}
            placeholder={"1320"}
            Icon={IoMdAdd}
            register={register("birth", {
              required: "体重を入力してください。",
            })}
          />
          <TextInput
            readonly={true}
            colSpan={1}
            type={"date"}
            errorMsg={errors.name?.message}
            label={"虹の橋"}
            placeholder={""}
            Icon={IoMdAdd}
            register={register("death")}
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
