import { PetTypeInterface } from "@interfaces/cmsInterfaces";
import { Dispatch, SetStateAction } from "react";

export function TypeFilter({
  types,
  typeFilter,
  setTypeFilter,
  typeFilterClear,
}: {
  types: PetTypeInterface[] | undefined;
  typeFilter: string | number;
  setTypeFilter: Dispatch<SetStateAction<string | number>>;
  typeFilterClear: () => void;
}) {
  return (
    <div className="ml-4 border border-opacity-50 rounded-lg h-fit border-base-200 text-neutral">
      <table className="table-compact">
        <thead>
          <tr>
            <th className="truncate">タイプフィルター</th>
          </tr>
        </thead>
        <tbody className="bg-neutral-content">
          <tr onClick={typeFilterClear}>
            <td>
              <div
                className={`rounded p-2 text-center w-full cursor-pointer transition duration-500 min-w-fit
                             hover:bg-primary-focus hover:text-primary-content
                ${
                  typeFilter === "all"
                    ? "bg-primary text-primary-content"
                    : "bg-neutral-content"
                }`}
              >
                全種
              </div>
            </td>
          </tr>
          {types?.map((type) => (
            <tr key={`type${type.id}`} onClick={() => setTypeFilter(type.id)}>
              <td>
                <div
                  className={`rounded p-2 text-center cursor-pointer w-full transition duration-500 min-w-fit 
                  hover:bg-primary-focus hover:text-primary-content
                  ${
                    typeFilter === type.id
                      ? "bg-primary text-primary-content"
                      : "bg-neutral-content"
                  }`}
                >
                  {type.name}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
