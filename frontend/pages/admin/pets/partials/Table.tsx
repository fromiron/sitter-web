import {
  paginationNumGenerator,
  showColumRangeGenerator,
  totalPageCountGenerator,
} from "@helpers/page-num-generator";

import { PetTableInterface } from "@interfaces/cmsInterfaces";
import { IoMale, IoFemale } from "react-icons/io5";

import Image from "next/image";

import { TableLayout } from "@components/layout/cms/TableLayout";
import { ReactElement } from "react";
import dayjs, { Dayjs } from "dayjs";
import duration from "dayjs/plugin/duration";
dayjs.extend(duration);

const booleanToSexString = (boolean: boolean): ReactElement =>
  !!boolean ? (
    <IoMale className="text-info" />
  ) : (
    <IoFemale className="text-error" />
  );

export function Table({ pets, query, setQuery, isLoading }: PetTableInterface) {
  const columRange = showColumRangeGenerator(pets?.count ?? 0, query.page);
  const totalPageCount = totalPageCountGenerator(pets?.count);
  const pageArray = paginationNumGenerator(totalPageCount, query.page);

  if (!pets) {
    return <div>loading...</div>;
  }
  if (isLoading) {
    return <div>loading...</div>;
  }

  const theadList = [
    "IDX",
    "名前",
    "性別",
    "タイプ",
    "品種",
    "体重",
    "誕生日",
    "飼い主",
  ];
  const today = dayjs();

  function DayRender({ birth, death }: { birth: string; death: string }) {
    const afterBirth = dayjs.duration(today.diff(birth));
    const afterDeath = dayjs.duration(today.diff(birth));

    return (
      <div className="grid grid-cols-2 text-xs text-end gap-y-1 gap-x-3">
        {birth && (
          <>
            <div className="w-full badge badge-sm">誕生日</div>
            <div>{dayjs(birth).format("YYYY年M月D日")}</div>
          </>
        )}
        {birth && !death && (
          <>
            <div className="w-full badge badge-sm">年齢</div>
            <div>{afterBirth.format("Y歳(M月D日)")}</div>
          </>
        )}
        {death && (
          <>
            <div className="w-full badge badge-sm">虹の橋</div>
            <div>{dayjs(death).format("YYYY年M月D日")}</div>
          </>
        )}
        {death && (
          <>
            <div className="w-full badge badge-sm">その後</div>
            <div>{afterDeath.format("Y年MM月DD日")}</div>
          </>
        )}
      </div>
    );
  }

  function TbodyRow() {
    return (
      <>
        {pets?.results.map((pet) => (
          <tr key={pet.id} className="text-center">
            <td className="text-sm text-center">{pet.id}</td>
            <td className="flex items-center">
              <div className="avatar">
                <div className="relative w-24 mr-4 mask mask-squircle bg-slate-200">
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
              </div>
              <div>{pet.name}</div>
            </td>
            <td>
              <div className="flex justify-center">
                {booleanToSexString(pet.sex)}
              </div>
            </td>
            <td>{pet.type?.name}</td>
            <td>{pet.breed?.name}</td>
            <td>{pet.weight}g</td>
            <td>
              <div className="flex justify-center">
                <DayRender birth={pet.birth} death={pet.death} />
              </div>
            </td>
            <td>
              <div>
                <div className="font-bold">{pet.customer.name}</div>
                <div className="text-sm opacity-50">
                  {pet.customer.name_kana}
                </div>
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
