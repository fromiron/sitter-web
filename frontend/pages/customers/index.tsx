import { GetServerSideProps, GetServerSidePropsContext } from "next";
import { getSession } from "next-auth/react";
import CMSLayout from "../../components/layout/CMSLayout";
import {
  CustomerInterface,
  CustomersInterface,
  SessionUserInterface,
} from "../../interfaces/cmsInterfaces";
import { useQuery } from "react-query";
import { CUSTOMERS } from "../../constants/queryKeys";
import axios from "axios";
import { Dispatch, SetStateAction, useEffect, useState } from "react";

export default function Customers({
  session,
}: {
  session: SessionUserInterface;
}) {
  const [page, setPage] = useState<number>(1);
  const [pageLength, setPageLength] = useState<number>(1);

  const getCustomers = async (page: number) => {
    const res = await axios.get(
      `http://localhost:8000/api/customer/customers/?page=${page}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `JWT ${session.accessToken}`,
        },
      }
    );
    if (res.status === 200) {
      return res.data;
    }
  };

  const {
    isLoading,
    isError,
    data: customers,
  } = useQuery([CUSTOMERS, page], () => getCustomers(page), {
    keepPreviousData: true,
  });

  const handlePageLength = () => {
    const PAGE_SIZE: number =
      Number(process.env.PAGE_SIZE) > 1 ? Number(process.env.PAGE_SIZE) : 20;

    if (customers) {
      const length = Math.ceil(customers.count / PAGE_SIZE);
      setPageLength(length);
    } else {
      setPageLength(1);
    }
  };

  useEffect(() => {
    handlePageLength();
  }, [customers]);

  if (!session.user) {
    return (
      // TODO  rendering error page design
      <div>
        <h1>ログイン情報がありません。</h1>
        <p>再度ログ・インしてください。</p>
      </div>
    );
  }
  return (
    <CMSLayout>
      <div>Dashboard</div>
      <div>{pageLength}</div>
      <div>{session.accessToken}</div>

      {isLoading && <div>Loading...</div>}
      {isError && <div>Error...</div>}
      {customers && (
        <CustomerTable
          customers={customers}
          setPage={setPage}
          page={page}
          pageLength={pageLength}
        />
      )}
    </CMSLayout>
  );
}

function CustomerTable({
  customers,
  page,
  pageLength,
  setPage,
}: {
  customers: CustomersInterface;
  page: number;
  pageLength: number;
  setPage: Dispatch<SetStateAction<number>>;
}) {
  return (
    <div className="overflow-x-auto">
      <table className="table w-full table-compact">
        <thead>
          <tr>
            <th>ID</th>
            <th>名前</th>
            <th>かな名</th>
            <th>電話</th>
            <th>電話2</th>
            <th>住所</th>
            <th>ペット</th>
          </tr>
        </thead>
        <tbody>
          {customers.results.map((customer: CustomerInterface, i) => (
            <tr key={`row${i}`}>
              <th>{customer.id}</th>
              <td>{customer.name}</td>
              <td>{customer.name_kana}</td>
              <td>{customer.tel}</td>
              <td>{customer.tel2}</td>
              <td>{customer.address}</td>
              <td>
                <button>ペット情報</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex justify-center w-full">
        <div className="btn-group">
          <button className="btn btn-sm" onClick={() => setPage(1)}>
            FIRST
          </button>
          <button
            onClick={() => setPage((old: number) => old - 1)}
            className={`btn btn-sm ${
              customers.previous === null ? "btn-disabled" : ""
            }`}
          >
            PRE
          </button>

          {[...Array(pageLength)].map((_, i) => (
            <button
              key={`pageBtn${i}`}
              className={`btn btn-sm ${page === i + 1 ? "btn-active" : ""}`}
              onClick={() => setPage(i + 1)}
            >
              {i + 1}
            </button>
          ))}

          <button
            onClick={() => setPage((old: number) => old + 1)}
            className={`btn btn-sm ${
              customers.next === null ? "btn-disabled" : ""
            }`}
          >
            NEXT
          </button>
          <button className="btn btn-sm" onClick={() => setPage(pageLength)}>
            LAST
          </button>
        </div>
      </div>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  // session dataがない場合はログイン画面にリダイレクト
  const session = await getSession(context);
  if (!session) {
    return {
      redirect: {
        destination: "/api/auth/signin",
        permanent: false,
      },
    };
  }

  return {
    props: {
      session: session,
    },
  };
};
