import {
  SearchInputInterface,
  SearchValuesInterface,
} from "@interfaces/cmsInterfaces";
import { SubmitHandler, useForm } from "react-hook-form";
import { ImSearch } from "react-icons/im";
import { useEffect, useState } from "react";
import {
  RiArrowDownSFill,
  RiArrowUpSFill,
  RiLoader4Line,
} from "react-icons/ri";
import { IoIosRadioButtonOn, IoIosRadioButtonOff } from "react-icons/io";
import { AiOutlineSortAscending } from "react-icons/ai";

interface SearchSelectOptionInterface {
  [key: string]: { query: string; string: string };
}

const OPTIONS: SearchSelectOptionInterface = {
  idDESC: {
    query: "-id",
    string: "登録日",
  },
  idASC: {
    query: "id",
    string: "登録日",
  },
  nameDESC: {
    query: "-name",
    string: "漢字名",
  },
  nameASC: {
    query: "name",
    string: "漢字名",
  },
  kanaDESC: {
    query: "-name_kana",
    string: "カナ名",
  },
  kanaASC: {
    query: "name_kana",
    string: "カナ名",
  },
};

export function SearchInput({ setQuery, query }: SearchInputInterface) {
  const [selected, setSelected] = useState(OPTIONS.idDESC);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { register, handleSubmit, getValues } = useForm();
  const onSubmit = () => {
    const { search } = getValues();
    setQuery({
      ...query,
      ordering: selected.query ?? "-id",
      search: search ?? "",
    });
  };
  useEffect(() => {
    onSubmit();
  }, [selected]);

  return (
    <div className="flex mb-4">
      <div className="flex">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex items-center justify-between max-w-xl p-2 transition duration-500 border border-opacity-50 rounded-lg focus-within:border-primary hover:border-primary group border-base-200 bg-neutral-content">
            <ImSearch className="mx-2 transition duration-500 text-base-300 group-hover:text-primary group-focus-within:text-primary" />
            <input
              {...register("search")}
              className="w-full transition duration-500 focus:outline-none bg-neutral-content text-neutral"
              placeholder="Search for customer"
            />
          </div>
        </form>

        {isOpen ? (
          <div
            className="absolute inset-0"
            onClick={() => setIsOpen(false)}
          ></div>
        ) : null}
        <div
          onClick={() => setIsOpen(!isOpen)}
          className="relative ml-4 text-sm"
        >
          <div className="flex w-full h-full max-w-xl overflow-hidden transition duration-500 border border-opacity-50 divide-y rounded-lg cursor-pointer select-none hover:border-primary hover:bg-primary-focus text-primary-content bg-primary">
            <div
              className={`w-8 flex justify-center items-center select-none ${
                isOpen ? "animate-spin" : null
              }`}
            >
              {isOpen ? <RiLoader4Line /> : <AiOutlineSortAscending />}
            </div>
            <div className="flex items-center justify-between object-fill h-full px-4 font-bold text-center transition duration-500 bg-primary-content text-neutral">
              {selected.string}
              {selected.query.includes("-") ? (
                <RiArrowDownSFill />
              ) : (
                <RiArrowUpSFill />
              )}
            </div>
          </div>

          <div
            className={`transition z-10 duration-500 absolute origin-top  ${
              isOpen ? "opacity-100 scale-y-100" : " opacity-0 scale-y-0"
            } cursor-pointer  overflow-hidden divide-y rounded-lg drop-shadow-lg left-0 right-0 mt-2`}
          >
            {Object.keys(OPTIONS).map((key) => (
              <div
                onClick={() => {
                  setSelected(OPTIONS[key]);
                }}
                key={key}
                className={`flex items-center justify-between px-4 py-2 transition duration-500 ${
                  OPTIONS[key].query === selected.query
                    ? "bg-primary hover:bg-primary-focus text-primary-content"
                    : "bg-primary-content  hover:bg-primary hover:text-primary-content"
                } text-neutral `}
              >
                {OPTIONS[key].query === selected.query ? (
                  <IoIosRadioButtonOn />
                ) : (
                  <IoIosRadioButtonOff />
                )}
                {OPTIONS[key].string}
                {OPTIONS[key].query.includes("-") ? (
                  <RiArrowDownSFill />
                ) : (
                  <RiArrowUpSFill />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
