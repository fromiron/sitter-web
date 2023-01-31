import CMSLayout from "@components/layout/CMSLayout";
import { toast } from "react-toastify";

import { useEffect, useState } from "react";
import { GetServerSideProps } from "next";
import { getSession } from "next-auth/react";
import { CustomersInterface, PetInterface } from "@interfaces/cmsInterfaces";
import { Session } from "next-auth/core/types";
import { useCustomer } from "@hooks/useCustomer";
import { MdNavigateNext, MdNavigateBefore } from "react-icons/md";
import { BsFillTelephoneFill } from "react-icons/bs";
import { ImSearch } from "react-icons/im";
import { SubmitHandler, useForm } from "react-hook-form";

export default function Customers({ session }: { session: Session }) {
  const [page, setPage] = useState<number>(1);

  //     'http://localhost:8000/api/customer/customers/?page=2' \
  //  'http://localhost:8000/api/customer/customers/?ordering=name_kana' \

  const { data: customers, isLoading } = useCustomer();

  if (isLoading) {
    <CMSLayout>Loading...</CMSLayout>;
  }

  return (
    <CMSLayout>
      <CustomerCounterBanner customerCountOrigin={customers?.count} />
      <SearchInput />
      {customers && <CustomerTable customers={customers} />}
    </CMSLayout>
  );
}

interface SearchValuesInterface {
  ordering?: string;
  search?: string;
}

function SearchInput() {
  const { setQuery } = useCustomer();
  const { register, handleSubmit } = useForm();
  const onSubmit: SubmitHandler<SearchValuesInterface> = (values) => {
    console.log(values);
    console.log(values.ordering);
    const query = `?ordering=${values.ordering}&search=${values.search}`;
    console.log(query);
    setQuery(query);
  };
  //   'http://localhost:8000/api/customer/customers/?ordering=-id&search=%E5%B1%B1%E5%8F%A3'
  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} onChange={handleSubmit(onSubmit)}>
        <div className="flex items-center justify-between max-w-xl p-2 mb-4 overflow-hidden transition duration-500 border border-opacity-50 rounded-lg focus-within:border-primary hover:border-primary group border-base-200 bg-neutral-content">
          <ImSearch className="mx-2 transition duration-500 text-base-300 group-hover:text-primary group-focus-within:text-primary" />
          <input
            {...register("search")}
            className="w-full transition duration-500 focus:outline-none bg-neutral-content text-neutral"
            placeholder="Search for customer"
          />
        </div>
        <select {...register("ordering")}>
          <option value="-id">登録日↓</option>
          <option value="id">登録日↑</option>
          <option value="-name">漢字名↓</option>
          <option value="name">漢字名↑</option>
          <option value="-name_kana">カナ名↓</option>
          <option value="name_kana">カナ名↑</option>
        </select>
      </form>
    </>
  );
}

function CustomerCounterBanner({
  customerCountOrigin,
}: {
  customerCountOrigin: number | undefined;
}) {
  const [customerCount, setCustomerCount] = useState<number | undefined>(
    undefined
  );

  useEffect(() => {
    if (customerCountOrigin !== undefined && customerCount === undefined) {
      setCustomerCount(customerCountOrigin - 2);
    }

    if (
      customerCountOrigin !== undefined &&
      customerCount !== undefined &&
      customerCountOrigin > customerCount
    ) {
      setTimeout(() => setCustomerCount(customerCount + 1), 400);
    }
  }, [customerCount, customerCountOrigin]);

  if (customerCountOrigin === undefined) {
    return null;
  }
  return (
    <div className="mb-4 overflow-hidden border border-opacity-50 rounded-lg border-base-200 w-fit">
      <div className="stat bg-neutral-content text-neutral">
        <div className="stat-title">Total Customer</div>
        <div className="stat-value">{customerCount}</div>
      </div>
    </div>
  );
}

function PetAvatarBadge({ pets }: { pets: PetInterface[] }) {
  if (pets.length === 0) return null;
  const count = pets.length;
  const renderingLimit = 3;
  //   todo pet avatar image
  return (
    <>
      {pets.slice(0, renderingLimit).map((pet) => (
        <div className="w-12 h-12" key={pet.id}>
          <div
            className="text-xs text-neutral-content tooltip tooltip-primary tooltip-top"
            data-tip={pet.name}
          >
            <div className="w-12 h-12 border-4 rounded-full border-neutral-content bg-base-200"></div>
          </div>
        </div>
      ))}
      {count > renderingLimit ? (
        <div className="z-10 w-12 h-12">
          <div className="flex items-center justify-center w-12 h-12 font-bold border-4 rounded-full border-neutral-content bg-primary text-primary-content">
            more
          </div>
        </div>
      ) : null}
    </>
  );
}

function CustomerTable({ customers }: { customers: CustomersInterface }) {
  function telNumCopy(tel: string) {
    navigator.clipboard
      .writeText(tel)
      .then(() => {
        toast.success(`コピー済 「${tel}」`);
      })
      .catch(() => {
        toast.success("コピーに失敗しました。");
      });
  }

  const { handlePage, page } = useCustomer();
  const count = customers.count;
  const pageRowCount = 10;
  const totalPage = Math.ceil(count / pageRowCount);

  return (
    <div className="w-full overflow-x-auto border border-opacity-50 rounded-lg max-w-7xl border-base-200 text-neutral">
      <table className="w-full table-compact">
        <thead>
          <tr>
            <th>IDX</th>
            <th>Customer</th>
            <th>Tel</th>
            <th>Pet</th>
            <th>Action</th>
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
                  onClick={() => telNumCopy(customer.tel)}
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
              <td className="text-end">
                memo
                <button className="btn btn-ghost btn-xs">ペット登録</button>
                <button className="btn btn-ghost btn-xs">予約登録</button>
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <th colSpan={5} className="normal-case">
              <div className="flex items-center justify-between w-full">
                <div className="text-base-200">
                  {customers.results[customers.results.length - 1]?.id}~
                  {customers?.results[0]?.id} of {customers.count}
                </div>
                <ul className="flex text-2x">
                  <li
                    onClick={() => handlePage(page - 1)}
                    className={`btn btn-ghost btn-sm btn-square ${
                      customers.previous ? null : "btn-disabled bg-base-100"
                    }`}
                  >
                    <MdNavigateBefore />
                  </li>

                  <li
                    className={"btn btn-ghost btn-sm btn-square"}
                    onClick={() => handlePage(1)}
                  >
                    1
                  </li>
                  <li
                    className={"btn btn-ghost btn-sm btn-square"}
                    onClick={() => handlePage(2)}
                  >
                    2
                  </li>
                  {totalPage > 5 ? (
                    // todo page move function
                    <li className={"btn btn-ghost btn-sm btn-square"}>...</li>
                  ) : null}
                  <li className={"btn btn-ghost btn-sm btn-square"}>
                    {totalPage}
                  </li>

                  <li
                    onClick={() => handlePage(page + 1)}
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
export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);
  return {
    props: {
      session: session,
    },
  };
};
