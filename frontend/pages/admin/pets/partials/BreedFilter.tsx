import { PetBreedInterface } from "@interfaces/cmsInterfaces";
import { Dispatch, SetStateAction } from "react";
import { IoIosCreate } from "react-icons/io";
export function BreedFilter({
  breeds,
  breedFilter,
  setBreedFilter,
  breedFilterClear,
  openModal,
}: {
  breeds: PetBreedInterface[] | undefined;
  breedFilter: string | number;
  setBreedFilter: Dispatch<SetStateAction<string | number>>;
  breedFilterClear: () => void;
  openModal: () => void;
}) {
  return (
    <div className="mb-4 overflow-hidden border border-opacity-50 w-[150px]  rounded-lg h-fit border-base-200 text-neutral">
      <div className="text-sm">
        <div className="p-2">品種フィルター</div>
        <div className="flex flex-col gap-1 p-1 bg-neutral-content">
          <div
            onClick={breedFilterClear}
            className={`btn btn-xs text-center cursor-pointer transition duration-500
                  hover:bg-primary-focus hover:text-primary-content
                ${breedFilter === "all" ? "btn-primary" : "btn-ghost"}`}
          >
            全タイプ
          </div>
          {breeds?.map((breed) => (
            <div
              key={`breed${breed.id}`}
              onClick={() => setBreedFilter(breed.id)}
              className={`btn btn-xs cursor-pointer transition duration-500
                  hover:bg-primary-focus hover:text-primary-content h-fit
                  ${breedFilter === breed.id ? "btn-primary" : "btn-ghost"}`}
            >
              {breed.name}
            </div>
          ))}
        </div>
        <div
          onClick={openModal}
          className="flex items-center justify-center p-2 text-sm transition duration-500 cursor-pointer select-none hover:bg-neutral hover:text-neutral-content"
        >
          品種管理
          <IoIosCreate className="ml-2" />
        </div>
      </div>
    </div>
  );
}
