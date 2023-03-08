import { SexIcon } from "@components/icons/SexIcon";
import ContentTitle from "@components/layout/ContentTitle";
import { PetInterface } from "@interfaces/cmsInterfaces";
import { useState, useRef, useEffect, Dispatch, SetStateAction } from "react";
import { BsArrowLeftCircleFill, BsArrowRightCircleFill } from "react-icons/bs";
import Slider from "react-slick";
import Image from "next/image";
import RabbitIcon from "@images/rabbit_icon.svg";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { afterBirth, ageDeath } from "@helpers/date-helper";

export default function PetsSliderPanel({
  pets,
  setSelectedPetIndex,
}: {
  pets?: PetInterface[];
  setSelectedPetIndex: Dispatch<SetStateAction<number>>;
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

  const settings = {
    centerMode: true,
    infinite: true,
    arrows: true,
    speed: 500,
    nextArrow: <PrevArrow />,
    prevArrow: <NextArrow />,
    centerPadding: "100px",
    afterChange: (index: number) => {
      setSelectedPetIndex(index);
    },
  };

  useEffect(() => {
    // @ts-ignore
    setNav1(slider1.current);
    // @ts-ignore
    setNav2(slider2.current);
    setSelectedPetIndex(0);
  }, []);

  return (
    <div className="flex flex-col items-center w-full h-full">
      <ContentTitle title="登録ペット" />
      <div className="flex items-center justify-center w-full h-full">
        <div>
          <div className="relative max-w-lg overflow-hidden">
            <div className="absolute z-10 h-full select-none w-28 bg-neutral-content -left-12 blur-lg" />
            <div className="absolute z-10 h-full select-none w-28 bg-neutral-content -right-12 blur-lg" />
            <Slider asNavFor={nav2} ref={slider1} {...settings}>
              {pets?.map((pet) => (
                <div key={pet.id} className="px-4 mt-6">
                  <div className="relative overflow-hidden rounded-lg h-72 bg-base-200">
                    <div className="absolute z-20 px-2 py-1 text-sm rounded-lg opacity-50 bg-neutral-content left-4 top-4">
                      {pet.id}
                    </div>
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
                  <div className="relative px-4 mb-10 -mt-16">
                    <div
                      className={`absolute px-2 py-1 rounded-lg right-8 -top-4 ${
                        pet.death ? "bg-slate-200" : "bg-amber-200"
                      }  text-neutral`}
                    >
                      {pet.death
                        ? ageDeath({
                            birth: pet.birth,
                            death: pet.death,
                          }).format("Y歳")
                        : afterBirth({ birth: pet.birth }).format("Y歳")}
                    </div>
                    <div className="p-4 rounded-lg shadow-lg bg-neutral-content">
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
                    </div>
                  </div>
                </div>
              ))}
            </Slider>
          </div>
          <div className="flex justify-center w-full">
            <div className="relative max-w-md overflow-hidden">
              {pets?.length! > 5 ? (
                <>
                  <div className="absolute z-10 h-48 select-none -top-10 w-28 bg-neutral-content -left-16 blur-lg" />
                  <div className="absolute z-10 h-48 select-none -top-10 w-28 bg-neutral-content -right-16 blur-lg" />
                </>
              ) : null}

              <Slider
                asNavFor={nav1}
                ref={slider2}
                slidesToShow={pets?.length! >= 5 ? 5 : pets?.length}
                swipeToSlide={true}
                focusOnSelect={true}
                arrows={false}
                centerMode={pets?.length! >= 5}
              >
                {pets?.map((pet) => (
                  <div key={`pet_thumbnail_${pet.id}`}>
                    <div className="flex flex-col items-center mx-4 cursor-pointer">
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
      </div>
    </div>
  );
}
