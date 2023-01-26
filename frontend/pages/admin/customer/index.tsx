import CMSLayout from "@components/layout/CMSLayout";

import { useQuery } from "react-query";
import { CUSTOMERS } from "@constants/queryKeys";
import axios from "axios";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { GetServerSideProps } from "next";
import { getSession } from "next-auth/react";
import {
  CustomerInterface,
  CustomersInterface,
} from "@interfaces/cmsInterfaces";
import { Session } from "next-auth/core/types";
import { axiosClient } from "../../../lib/axios-client";
import { useCustomer } from "@hooks/useCustomer";

export default function Customers({ session }: { session: Session }) {
  const [page, setPage] = useState<number>(1);

  const { data: customers, isLoading } = useCustomer({
    token: session.access_token,
  });

  const [customerCount, setCustomerCount] = useState<number | null>(null);

  useEffect(() => {
    if (customers?.count !== undefined) setCustomerCount(customers.count - 2);
  }, [customers]);

  useEffect(() => {
    if (customers?.count !== undefined) {
      if (customerCount === null) return;
      if (customers.count > customerCount) {
        setTimeout(() => setCustomerCount(customerCount + 1), 400);
      }
    }
  }, [customerCount, customers?.count]);

  if (isLoading) {
    <CMSLayout>Loading...</CMSLayout>;
  }

  return (
    <CMSLayout>
      <div className="shadow stats">
        <div className="stat bg-primary">
          <div className="stat-title text-base-100">Total Customer</div>
          <div className="stat-value">{customerCount}</div>
        </div>
      </div>
      {customers && <CustomerBoard customers={customers} />}
    </CMSLayout>
  );
}

function CustomerBoard({ customers }: { customers: CustomersInterface }) {
  return (
    <div className="overflow-auto">
      <table className="table w-full table-compact">
        <thead>
          <tr>
            <th></th>
            <th>Name</th>
            <th>Kana</th>
            <th>Tel</th>
            <th>Address</th>
          </tr>
        </thead>
        <tbody>
          {customers.results.map((customer) => {
            return (
              <tr key={customer.id}>
                <th>{customer.id}</th>
                <td>{customer.name}</td>
                <td>{customer.name_kana}</td>
                <td>{customer.tel}</td>
                <td>{customer.address}</td>
              </tr>
            );
          })}
        </tbody>
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

//   const getCustomers = async (page: number) => {
//     const res = await axiosClient.get(
//       `${BACKEND_API_URL}/api/customer/customers/?ordering=${ordering}&page=${page}&search=${search}&sort=${sort}`,
//       {
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `JWT ${session.access_token}`,
//         },
//       }
//     );
//     if (res.status === 200) {
//       return res.data;
//     }
//   };
