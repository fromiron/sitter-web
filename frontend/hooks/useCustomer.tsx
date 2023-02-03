import { CUSTOMERS } from "@constants/queryKeys";
import { CustomersInterface, QueryInterface } from "@interfaces/cmsInterfaces";
import { axiosClient } from "@lib/axios-client";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useQuery } from "react-query";

const BACKEND_API_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL;

async function getCustomers({
  query,
  token,
}: {
  query: { ordering: string; search: string; page: number };
  token?: string;
}): Promise<CustomersInterface> {
  const { data } = await axiosClient.get(
    `${BACKEND_API_URL}/api/customer/customers/?page=${query.page}&ordering=${query.ordering}&search=${query.search}`,
    {
      headers: {
        Authorization: `JWT ${token}`,
      },
    }
  );
  return data;
}

interface UseCustomer {
  data?: CustomersInterface;
  isLoading: boolean;
  setQuery: Dispatch<SetStateAction<QueryInterface>>;
  query: QueryInterface;
}

export function useCustomer({ token }: { token?: string }): UseCustomer {
  const [query, setQuery] = useState<{
    search: string;
    ordering: string;
    page: number;
  }>({
    search: "",
    ordering: "-id",
    page: 1,
  });

  const { data, isLoading } = useQuery([CUSTOMERS, query], () =>
    getCustomers({ query, token })
  );

  return { data, isLoading, setQuery, query };
}
