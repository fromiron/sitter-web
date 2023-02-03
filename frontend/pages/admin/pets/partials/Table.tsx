import {
  paginationNumGenerator,
  showColumRangeGenerator,
  totalPageCountGenerator,
} from "@helpers/page-num-generator";
import { PetInterface, PetTableInterface } from "@interfaces/cmsInterfaces";

import { useEffect, useState } from "react";
import Image from "next/image";

import { TableLayout } from "@components/layout/TableLayout";

const booleanToSexString = (boolean: boolean): string =>
  boolean ? "オス" : "めす";

export function Table({ pets, query, setQuery, isLoading }: PetTableInterface) {
  const [pageArray, setPageArray] = useState<Array<string | number>>([]);
  const [columRange, setColumRange] = useState({ from: 0, to: 0 });

  const totalPageCount = totalPageCountGenerator(pets?.count);

  useEffect(() => {
    const array = paginationNumGenerator(totalPageCount, query.page);
    setPageArray(array);
    const columRange = showColumRangeGenerator(pets?.count ?? 0, query.page);
    setColumRange(columRange);
  }, [query.page]);

  if (!pets) {
    return <div>loading...</div>;
  }
  if (isLoading) {
    return <div>loading...</div>;
  }

  const theadList = [
    "IDX",
    "Name",
    "Sex",
    "Type",
    "Breed",
    "weight",
    "Thumbnail",
  ];

  function TbodyRow() {
    return (
      <>
        {pets?.results.map((pet) => (
          <tr key={pet.id}>
            <td className="text-sm text-center">{pet.id}</td>
            <td>{pet.name}</td>
            <td>{pet.sex}</td>
            <td>{pet.type?.name}</td>
            <td>{pet.breed?.name}</td>
            <td>{pet.weight}</td>
            <td>
              <div className="relative w-16 h-16 bg-red-300">
                {pet.thumbnail ? (
                  <Image
                    className="object-cover"
                    src={pet.thumbnail}
                    alt={"pet image"}
                    fill
                    unoptimized
                  />
                ) : null}
              </div>
            </td>
          </tr>
        ))}
      </>
    );
  }

  return (
    <TableLayout
      theadList={theadList}
      TbodyRow={TbodyRow}
      count={pets?.count}
      from={columRange.from}
      to={columRange.to}
      next={pets.next}
      previous={pets.previous}
      pageArray={pageArray}
      query={query}
      setQuery={setQuery}
    />
  );
}
