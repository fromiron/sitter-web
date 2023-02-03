import { copyToClipboard } from "@helpers/copy-helper";
import {
  paginationNumGenerator,
  showColumRangeGenerator,
} from "@helpers/page-num-generator";
import {
  CustomerTableInterface,
  PetInterface,
} from "@interfaces/cmsInterfaces";
import { BsFillTelephoneFill } from "react-icons/bs";
import { MdNavigateBefore, MdNavigateNext } from "react-icons/md";
import { useEffect, useState } from "react";
import Image from "next/image";
import RabbitIcon from "@images/rabbit_icon.svg";

export function Table({
  customers,
  query,
  setQuery,
  isLoading,
}: CustomerTableInterface) {
  const [pageArray, setPageArray] = useState<Array<string | number>>([]);
  const [columRange, setColumRange] = useState({ from: 0, to: 0 });

  const count = customers?.count ? customers.count : 0;
  const pageRowCount = 10;
  const totalPageCount = Math.ceil(count / pageRowCount);

  useEffect(() => {
    const array = paginationNumGenerator(totalPageCount, query.page);
    setPageArray(array);
    const columRange = showColumRangeGenerator(count, query.page);
    setColumRange(columRange);
  }, [count, query.page, totalPageCount]);

  if (!customers) {
    return <div>loading...</div>;
  }
  if (isLoading) {
    return <div>loading...</div>;
  }

  return (
    <div className="w-full max-w-5xl overflow-x-auto border border-opacity-50 rounded-lg border-base-200 text-neutral">
      <table className="w-full table-compact">
        <thead>
          <tr>
            <th>IDX</th>
            <th>Customer</th>
            <th>Tel</th>
            <th>Pet</th>
          </tr>
        </thead>
        <tbody className="divide-y bg-neutral-content ">
          {customers.results.map((customer) => (
            <tr key={customer.id}>
              <td className="text-sm text-center">{customer.id}</td>
              <td>
                <div className="flex items-center space-x-3 ">
                  <div>
                    <div className="font-bold">{customer.name}</div>
                    <div className="text-sm opacity-50">
                      {customer.name_kana}
                    </div>
                  </div>
                </div>
              </td>
              <td className="max-w-xs truncate">
                {customer.address}
                <br />
                <span
                  className="text-sm cursor-pointer badge badge-ghost badge-sm"
                  onClick={() => copyToClipboard(customer.tel)}
                >
                  <span className="mr-1 scale-75">
                    <BsFillTelephoneFill />
                  </span>
                  {customer.tel}
                </span>
              </td>
              <td className="flex -space-x-4 cursor-pointer">
                <PetAvatarBadge pets={customer.pets} />
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <th colSpan={5} className="normal-case">
              <div className="flex items-center justify-between w-full">
                <div className="text-base-200">
                  {columRange.from}~{columRange.to} of {customers.count}
                </div>
                <ul className="flex text-2x">
                  <li
                    onClick={() => setQuery({ ...query, page: query.page - 1 })}
                    className={`btn btn-ghost btn-sm btn-square 
                    ${customers.previous ? null : "btn-disabled bg-base-100"}`}
                  >
                    <MdNavigateBefore />
                  </li>

                  {pageArray.map((pageNum, i) => (
                    <li
                      key={`page-btn-${i}`}
                      className={`btn btn-ghost btn-sm btn-square ${
                        query.page === pageNum ? "btn-active" : ""
                      } ${
                        typeof pageNum === "string"
                          ? "btn-disabled bg-base-100"
                          : null
                      }`}
                      onClick={() =>
                        setQuery({ ...query, page: pageNum as number })
                      }
                    >
                      {pageNum}
                    </li>
                  ))}

                  <li
                    onClick={() => setQuery({ ...query, page: query.page + 1 })}
                    className={`btn btn-ghost btn-sm btn-square ${
                      customers.next ? null : "btn-disabled bg-base-100"
                    }`}
                  >
                    <MdNavigateNext />
                  </li>
                </ul>
              </div>
            </th>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}

function PetAvatarBadge({ pets }: { pets: PetInterface[] }) {
  if (pets.length === 0) return null;
  const count = pets.length;
  const renderingLimit = 3;
  return (
    <>
      {pets.slice(0, renderingLimit).map((pet) => (
        <div className="w-12 h-12" key={pet.id}>
          <div
            className="text-xs text-neutral-content tooltip tooltip-primary tooltip-top"
            data-tip={pet.name}
          >
            <div className="relative flex items-center justify-center w-12 h-12 border-4 rounded-full bg-base-200 border-neutral-content">
              {pet.thumbnail ? (
                <Image
                  src={pet.thumbnail}
                  unoptimized={true}
                  fill
                  alt="pet image"
                />
              ) : (
                <RabbitIcon />
              )}
            </div>
          </div>
        </div>
      ))}
      {count > renderingLimit ? (
        <div className="z-10 w-12 h-12">
          <div className="flex items-center justify-center w-12 h-12 font-bold border-4 rounded-full border-neutral-content bg-primary text-primary-content">
            +{count-renderingLimit}
          </div>
        </div>
      ) : null}
    </>
  );
}
