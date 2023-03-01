import ContentTitle from "@components/layout/ContentTitle";
import { PetInterface } from "@interfaces/cmsInterfaces";
import { useState, useRef, useEffect } from "react";
import Slider from "react-slick";
import Image from "next/image";
import RabbitIcon from "@images/rabbit_icon.svg";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

export default function PetsSlider ({ pets }: { pets?: PetInterface[] })  {
  const [nav1, setNav1] = useState<Slider>();
  const [nav2, setNav2] = useState<Slider>();
  const slider1 = useRef<Slider>(null);
  const slider2 = useRef<Slider>(null);

  function PrevArrow(props: any) {
    const { style, onClick } = props;
    console.log(style);
    return (
      <div
        className={"slick-arrow slick-prev block"}
        style={{ ...style, background: "green" }}
        onClick={onClick}
      />
    );
  }
  function NextArrow(props: any) {
    const { style, onClick } = props;
    return (
      <div
        className={"slick-arrow slick-next"}
        style={{ ...style, background: "green" }}
        onClick={onClick}
      />
    );
  }

  const navSettings = {
    nextArrow: <PrevArrow />,
    prevArrow: <NextArrow />,
  };
  const settings = {
    centerMode: true,
    infinite: true,
    arrows: false,
    speed: 500,
    centerPadding: "100px",
  };
  useEffect(() => {
    // @ts-ignore
    setNav1(slider1.current);
    // @ts-ignore
    setNav2(slider2.current);
  }, []);

  return (
    <div className="flex flex-col items-center overflow-hidden">
      <div className="w-full">
        <ContentTitle title="登録ペット" />
      </div>
      <div className="w-full ">
        <div className="relative">
          <div className="absolute z-10 h-full select-none w-28 bg-neutral-content -left-12 blur-xl" />
          <div className="absolute z-10 h-full select-none w-28 bg-neutral-content -right-12 blur-xl" />
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
                    // TODO default image setting
                    <div className="flex items-center justify-center w-full h-full text-primary-content">
                      <RabbitIcon className={"w-20 h-auto opacity-50"} />
                    </div>
                  )}
                </div>
                <div className="relative px-4 mb-10 -mt-16 ">
                  <div className="p-6 bg-white rounded-lg shadow-lg">
                    <div className="flex items-baseline">
                      <span className="inline-block px-2 text-xs font-semibold tracking-wide text-teal-800 uppercase bg-teal-200 rounded-full">
                        {pet.type.name}
                      </span>
                      <div className="ml-2 text-xs font-semibold tracking-wider text-gray-600 uppercase">
                        {pet.breed.name}
                      </div>
                    </div>
                    <h4 className="mt-1 text-xl font-semibold leading-tight uppercase truncate">
                      {pet.name}
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
        <div className="px-16">
          <Slider
            asNavFor={nav1}
            ref={slider2}
            slidesToShow={5}
            swipeToSlide={true}
            focusOnSelect={true}
            {...navSettings}
          >
            {pets?.map((pet) => (
              <div key={`pet_thumbnail_${pet.id} text-neutral-content flex`}>
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
                <div>{pet.name}</div>
              </div>
            ))}
          </Slider>
        </div>
      </div>
    </div>
  );
};
