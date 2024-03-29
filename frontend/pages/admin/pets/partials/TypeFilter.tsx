import { PetTypeInterface } from "@interfaces/cmsInterfaces";
import { Dispatch, SetStateAction } from "react";
import { IoIosCreate } from "react-icons/io";

export function TypeFilter({
  types,
  typeFilter,
  setTypeFilter,
  typeFilterClear,
  openModal,
}: {
  types: PetTypeInterface[] | undefined;
  typeFilter: string | number;
  setTypeFilter: Dispatch<SetStateAction<string | number>>;
  typeFilterClear: () => void;
  openModal: () => void;
}) {
  return (
    <div className="mb-4 overflow-hidden border border-opacity-50 w-[150px]  rounded-lg h-fit border-base-200 text-neutral">
      <div className="text-sm">
        <div className="p-2">タイプフィルター</div>
        <div className="flex flex-col gap-1 p-1 bg-neutral-content">
          <div
            onClick={typeFilterClear}
            className={`btn btn-xs text-center cursor-pointer transition duration-500
                  hover:bg-primary-focus hover:text-primary-content
                ${typeFilter === "all" ? "btn-primary" : "btn-ghost"}`}
          >
            全タイプ
          </div>
          {types?.map((type) => (
            <div
              key={`type${type.id}`}
              onClick={() => setTypeFilter(type.id)}
              className={`btn btn-xs cursor-pointer transition duration-500
                  hover:bg-primary-focus hover:text-primary-content h-fit
                  ${typeFilter === type.id ? "btn-primary" : "btn-ghost"}`}
            >
              {type.name}
            </div>
          ))}
        </div>
        <div
          onClick={openModal}
          className="flex items-center justify-center p-2 text-sm transition duration-500 cursor-pointer select-none hover:bg-neutral hover:text-neutral-content"
        >
          タイプ管理
          <IoIosCreate className="ml-2" />
        </div>
      </div>
    </div>
  );
}
