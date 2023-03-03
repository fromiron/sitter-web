import ContentTitle from "@components/layout/ContentTitle";
import { PetInterface } from "@interfaces/cmsInterfaces";
import { useState, useRef, KeyboardEvent, useEffect } from "react";
import Slider from "react-slick";
import Image from "next/image";
import RabbitIcon from "@images/rabbit_icon.svg";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { BsArrowLeftCircleFill, BsArrowRightCircleFill } from "react-icons/bs";
import { SexIcon } from "@components/icons/SexIcon";
import { SelectInput, TextInput } from "@components/inputs";

import { useForm } from "react-hook-form";
import { IoMdAdd } from "react-icons/io";

export default function PetPanel({ pets }: { pets?: PetInterface[] }) {
  const [selectedPet, setSelectedPet] = useState<PetInterface | null>(null);
  const handlePet = (pet: PetInterface) => setSelectedPet(pet);

  return (
    <>
      <PetsSlider pets={pets} handlePet={handlePet} />
      <PetInfoPanel selectedPet={selectedPet} />
    </>
  );
}

function PetsSlider({
  pets,
  handlePet,
}: {
  pets?: PetInterface[];
  handlePet: (pet: PetInterface) => void;
}) {
  const [nav1, setNav1] = useState<Slider>();
  const [nav2, setNav2] = useState<Slider>();
  const slider1 = useRef<Slider>(null);
  const slider2 = useRef<Slider>(null);

  function PrevArrow(props: any) {
    const { onClick } = props;
    return (
      <div
        className={
          "cursor-pointer absolute left-5 text-primary top-1/2 z-10 transition opacity-30 hover:opacity-50 active:scale-105"
        }
      >
        <BsArrowLeftCircleFill size={"2em"} onClick={onClick} />
      </div>
    );
  }
  function NextArrow(props: any) {
    const { onClick } = props;
    return (
      <div
        className={
          "cursor-pointer absolute right-5 text-primary top-1/2 z-10 transition opacity-30 hover:opacity-50 active:scale-105"
        }
      >
        <BsArrowRightCircleFill size={"2em"} onClick={onClick} />
      </div>
    );
  }

  const navSettings = {
    // nextArrow: <PrevArrow />,
    // prevArrow: <NextArrow />,
  };
  const settings = {
    centerMode: true,
    infinite: true,
    arrows: true,
    speed: 500,
    nextArrow: <PrevArrow />,
    prevArrow: <NextArrow />,
    centerPadding: "100px",
    afterChange: (index: number) => {
      handlePet(pets![index]);
    },
  };
  useEffect(() => {
    // @ts-ignore
    setNav1(slider1.current);
    // @ts-ignore
    setNav2(slider2.current);
    handlePet(pets![0]);
  }, []);

  return (
    <div className="flex flex-col items-center overflow-hidden">
      <div className="w-full">
        <ContentTitle title="登録ペット" />
      </div>
      <div className="w-full ">
        <div className="relative">
          <div className="absolute z-10 h-full select-none w-28 bg-neutral-content -left-12 blur-lg" />
          <div className="absolute z-10 h-full select-none w-28 bg-neutral-content -right-12 blur-lg" />
          <Slider asNavFor={nav2} ref={slider1} {...settings}>
            {pets?.map((pet) => (
              <div key={pet.id} className="px-4 mt-6">
                <div className="relative overflow-hidden rounded-lg h-72 bg-base-200">
                  {pet.image ? (
                    <Image
                      className="object-cover transition hover:scale-105"
                      src={pet.image}
                      unoptimized
                      fill
                      alt={pet.name}
                    />
                  ) : (
                    <div className="flex items-center justify-center w-full h-full text-primary-content">
                      <RabbitIcon className={"w-20 h-auto opacity-50"} />
                    </div>
                  )}
                </div>
                <div className="relative px-4 mb-10 -mt-16 ">
                  <div className="p-4 bg-white rounded-lg shadow-lg ">
                    <div className="flex mb-2">
                      {SexIcon(pet.sex)}
                      <div className="inline-block px-2 ml-2 text-xs font-semibold tracking-wide text-teal-800 uppercase bg-teal-200 rounded-full whitespace-nowrap">
                        {pet.type.name}
                      </div>
                    </div>
                    <div className="text-xs font-semibold tracking-wider text-gray-600 truncate">
                      {pet.breed.name}
                    </div>

                    <h4 className="mt-1 text-xl font-semibold leading-tight uppercase truncate">
                      {pet.name}
                      <span className="text-xs ">
                        {pet.sex ? "君" : "ちゃん"}
                      </span>
                    </h4>
                    <div className="mt-1">
                      {pet.weight}
                      <span className="text-sm text-gray-600"> /g</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </Slider>
        </div>
        <div className="w-full ">
          <Slider
            asNavFor={nav1}
            ref={slider2}
            slidesToShow={pets?.length! >= 5 ? 5 : pets?.length}
            swipeToSlide={true}
            focusOnSelect={true}
            {...navSettings}
          >
            {pets?.map((pet) => (
              <div key={`pet_thumbnail_${pet.id}`}>
                <div className="flex flex-col items-center cursor-pointer">
                  <div className="relative flex items-center justify-center w-12 h-12 overflow-hidden border-4 rounded-full text-neutral-content bg-base-200 border-neutral-content">
                    {pet.thumbnail ? (
                      <Image
                        src={pet.thumbnail}
                        unoptimized={true}
                        fill
                        alt="pet image"
                      />
                    ) : (
                      <RabbitIcon className={"w-3 h-auto opacity-50"} />
                    )}
                  </div>
                  <div className="truncate max-w-[100px]">{pet.name}</div>
                </div>
              </div>
            ))}
          </Slider>
        </div>
      </div>
    </div>
  );
}

function PetInfoPanel({
  selectedPet,
}: //   editPet,
{
  selectedPet?: PetInterface | null;
  //   editPet: UseMutationResult<
  //     null,
  //     AxiosError<unknown, any>,
  //     PetInterface,
  //     unknown
  //   >;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<PetInterface>();

  useEffect(() => {
    // 初期値をデフォルトとしていえる
    if (selectedPet) {
      reset(selectedPet);
    }
  }, [selectedPet]);

  const handleReset = () => reset();
  const onSubmit = (data: PetInterface) => {
    if (window.confirm("更新しますか？")) {
      //   editCustomer.mutate(data);
    }
  };
  const checkKeyDown = (e: KeyboardEvent<HTMLFormElement>) => {
    // 入力途中エンター入力でのSubmitをブロック
    if (e.code === "Enter") e.preventDefault();
  };

  return (
    <div>
      <ContentTitle title="顧客情報" />

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid grid-cols-2 gap-x-4"
        onKeyDown={(e) => checkKeyDown(e)}
      >
        <div className="relative flex items-center justify-center w-full ml-2 transition duration-500 cursor-pointer group hover:grayscale">
          <div className="absolute z-10 text-white transition duration-500 opacity-0 select-none group-hover:opacity-50">
            UPLOAD
          </div>
          <div className="avatar">
            <div
              className={`w-24 mask mask-squircle bg-slate-200 ${
                selectedPet?.death ? "grayscale" : null
              }`}
            >
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
          errorMsg={errors.name?.message}
          label={"虹の橋"}
          placeholder={""}
          Icon={IoMdAdd}
          register={register("death", {
            required: "体重を入力してください。",
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
  );
}
