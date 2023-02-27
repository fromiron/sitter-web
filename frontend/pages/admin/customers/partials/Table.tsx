import { copyToClipboard } from "@helpers/copy-helper";
import {
  paginationNumGenerator,
  showColumRangeGenerator,
  totalPageCountGenerator,
} from "@helpers/page-num-generator";
import { PetInterface } from "@interfaces/cmsInterfaces";
import { BsFillTelephoneFill } from "react-icons/bs";
import { MdEmail } from "react-icons/md";

import Image from "next/image";
import RabbitIcon from "@images/rabbit_icon.svg";
import { TableLayout } from "@components/layout/cms/TableLayout";
import { useCustomerContext } from "context/CustomerContext";
import { useModalContext } from "context/ModalContext";
import LineLogo from "@images/logo_line.svg";

export function Table() {
  const { list, isListLoading, query, setQuery, setCustomerId } =
    useCustomerContext();
  const { setShowCustomerDetailModal } = useModalContext();

  if (!list) {
    return <div>loading...</div>;
  }
  if (isListLoading) {
    return <div>loading...</div>;
  }

  const columRange = showColumRangeGenerator(list?.count ?? 0, query.page);
  const totalPageCount = totalPageCountGenerator(list?.count);
  const pageArray = paginationNumGenerator(totalPageCount, query.page);

  const theadList = ["顧客", "情報", "ペット"];

  const openCustomerDetail = (id: number | string) => {
    setCustomerId(id);
    setShowCustomerDetailModal(true);
  };
  function TbodyRow() {
    return (
      <>
        {list?.results.map((customer) => (
          <tr key={customer.id} className="hover:bg-base-100">
            <td
              className="cursor-pointer whitespace-nowrap pl-7 min-w-fit"
              onClick={() => openCustomerDetail(customer.id)}
            >
              <div className="font-medium">{customer.name}</div>
              <div className="opacity-50 text-xxs">{customer.name_kana}</div>
            </td>
            <td className="whitespace-pre-wrap ">
              <div className="flex">
                <div className="mr-2 text-xxs">
                  <span className="select-none">〒</span>
                  {customer.zipcode}
                </div>
                {customer.address}
              </div>
              <div className="flex gap-x-2">
                <div
                  className="flex items-center px-2 mt-1 text-xs font-medium text-blue-600 rounded-full cursor-pointer bg-blue-50 w-fit"
                  onClick={() => copyToClipboard(customer.tel)}
                >
                  <span className="mr-1 scale-75">
                    <BsFillTelephoneFill />
                  </span>
                  {customer.tel}
                </div>
                <div
                  className="flex items-center px-2 mt-1 text-xs font-medium rounded-full cursor-pointer text-gray-600-600 bg-gray-50 w-fit"
                  onClick={() => copyToClipboard(customer.email)}
                >
                  <span className="mr-1">
                    <MdEmail />
                  </span>
                  {customer.email}
                </div>
                <div
                  className="flex items-center px-2 mt-1 text-xs font-medium text-green-600 rounded-full cursor-pointer bg-green-50 w-fit"
                  onClick={() => copyToClipboard(customer.line)}
                >
                  <span className="scale-50">
                    <LineLogo />
                  </span>
                  {customer.line}
                </div>
              </div>
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
      count={list?.count}
      from={columRange.from}
      to={columRange.to}
      next={list.next}
      previous={list.previous}
      pageArray={pageArray}
      query={query}
      setQuery={setQuery}
      tableName={"Customers"}
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
            <div className="relative flex items-center justify-center w-12 h-12 overflow-hidden border-4 rounded-full bg-base-200 border-neutral-content">
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
