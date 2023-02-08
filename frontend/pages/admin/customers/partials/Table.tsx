import { copyToClipboard } from "@helpers/copy-helper";
import {
  paginationNumGenerator,
  showColumRangeGenerator,
  totalPageCountGenerator,
} from "@helpers/page-num-generator";
import {
  CustomerTableInterface,
  PetInterface,
} from "@interfaces/cmsInterfaces";
import { BsFillTelephoneFill } from "react-icons/bs";
import Image from "next/image";
import RabbitIcon from "@images/rabbit_icon.svg";
import { TableLayout } from "@components/layout/cms/TableLayout";

export function Table({
  customers,
  query,
  setQuery,
  isLoading,
}: CustomerTableInterface) {
  const columRange = showColumRangeGenerator(customers?.count ?? 0, query.page);
  const totalPageCount = totalPageCountGenerator(customers?.count);
  const pageArray = paginationNumGenerator(totalPageCount, query.page);

  if (!customers) {
    return <div>loading...</div>;
  }
  if (isLoading) {
    return <div>loading...</div>;
  }

  const theadList = ["IDX", "Customer", "Information", "Pet"];

  function TbodyRow() {
    return (
      <>
        {customers?.results.map((customer) => (
          <tr key={customer.id}>
            <td className="text-sm text-center">{customer.id}</td>
            <td>
              <div className="flex items-center space-x-3 ">
                <div>
                  <div className="font-bold">{customer.name}</div>
                  <div className="text-sm opacity-50">{customer.name_kana}</div>
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
      </>
    );
  }

  return (
    <TableLayout
      theadList={theadList}
      TbodyRow={TbodyRow}
      count={customers?.count}
      from={columRange.from}
      to={columRange.to}
      next={customers.next}
      previous={customers.previous}
      pageArray={pageArray}
      query={query}
      setQuery={setQuery}
    />
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
            +{count - renderingLimit}
          </div>
        </div>
      ) : null}
    </>
  );
}
