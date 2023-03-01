import {
  paginationNumGenerator,
  showColumRangeGenerator,
  totalPageCountGenerator,
} from "@helpers/page-num-generator";
import RabbitIcon from "@images/rabbit_icon.svg";

import { PetTableInterface } from "@interfaces/cmsInterfaces";

import Image from "next/image";

import { TableLayout } from "@components/layout/cms/TableLayout";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import { SexIcon } from "@components/icons/SexIcon";
dayjs.extend(duration);

export function Table({
  pets,
  query,
  setQuery,
  isLoading,
  customerFilter,
  setCustomerFilter,
}: PetTableInterface) {
  const columRange = showColumRangeGenerator(pets?.count ?? 0, query.page);
  const totalPageCount = totalPageCountGenerator(pets?.count);
  const pageArray = paginationNumGenerator(totalPageCount, query.page);
  if (!pets) {
    return <div>loading...</div>;
  }
  if (isLoading) {
    return <div>loading...</div>;
  }

  const theadList = ["ペット", "タイプ", "年齢", "飼い主"];
  const today = dayjs();

  function DayRender({ birth, death }: { birth: string; death: string }) {
    const deathDayJs = dayjs(death);
    const afterBirth = dayjs.duration(today.diff(birth));
    const ageOfDeath = dayjs.duration(deathDayJs.diff(birth));
    return (
      <div>
        {birth && !death && (
          <>
            <div>{afterBirth.format("Y歳")}</div>
            <div className="px-2 mt-1 font-medium text-green-600 rounded-full text-xxs bg-green-50">
              {dayjs(birth).format("YYYY年M月D日")}
            </div>
          </>
        )}
        {death && (
          <>
            <div>{ageOfDeath.format("Y歳")}</div>
            <div className="px-2 mt-1 font-medium text-gray-600 bg-gray-100 rounded-full text-xxs">
              {dayjs(death).format("YYYY年M月D日")}
            </div>
          </>
        )}
      </div>
    );
  }

  function TbodyRow() {
    return (
      <>
        {pets?.results.map((pet) => (
          <tr key={pet.id} className="text-center hover:bg-base-100">
            <td className="flex items-center">
              <div className="hidden avatar sm:block">
                <div
                  className={`w-12 mr-4 mask mask-squircle bg-slate-200 ${
                    pet.death ? "grayscale" : null
                  }`}
                >
                  {pet.thumbnail ? (
                    <Image
                      className="object-cover"
                      src={pet.thumbnail}
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
              <div>
                <div className="flex items-center">
                  {pet.name}
                  {SexIcon(pet.sex)}
                </div>
                <div className="text-xs text-base-300">({pet.weight}g)</div>
              </div>
            </td>
            <td className="max-w-[100px] break-all">
              <div>{pet.type?.name}</div>
              <div className="text-sm truncate opacity-50">
                {pet.breed?.name}
              </div>
            </td>
            <td>
              <div className="flex justify-center">
                <DayRender birth={pet.birth} death={pet.death} />
              </div>
            </td>
            <td>
              <div
                className="group tooltip hover:tooltip-open tooltip-primary"
                data-tip={`no.${pet.customer.id}`}
              >
                <div
                  className="cursor-pointer"
                  onClick={() => setCustomerFilter(pet.customer.id)}
                >
                  <div>{pet.customer.name}</div>
                  <div className="text-xs opacity-50">
                    {pet.customer.name_kana}
                  </div>
                </div>
              </div>
            </td>
          </tr>
        ))}
        {pets?.count === 0 ? (
          <tr>
            <td colSpan={100} className="h-32 text-center">
              検索結果がありません。
            </td>
          </tr>
        ) : null}
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
      tableName={`${
        typeof customerFilter === "number" ? `顧客No.${customerFilter}` : "Pets"
      }`}
    />
  );
}
