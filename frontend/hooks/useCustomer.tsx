import { CUSTOMERS } from "@constants/queryKeys";
import { CustomersInterface } from "@interfaces/cmsInterfaces";
import { axiosClient } from "@lib/axios-client";
import { useSession } from "next-auth/react";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useQuery } from "react-query";

const BACKEND_API_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL;

async function getCustomer({
  query,
  token,
}: {
  query: string;
  token?: string;
}): Promise<CustomersInterface> {
  const { data } = await axiosClient.get(
    `${BACKEND_API_URL}/api/customer/customers/${query}`,
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
  query: string;
  isLoading: boolean;
  setQuery: Dispatch<SetStateAction<string>>;
  handlePage: (page: number) => void;
  page: number;
}

export function useCustomer(): UseCustomer {
  const session = useSession();
  const token = session.data?.access_token;
  const [page, setPage] = useState<number>(1);

  const [query, setQuery] = useState<string>("?ordering=-id");

  const { data, isLoading, refetch } = useQuery(CUSTOMERS, () =>
    getCustomer({ query, token })
  );

  const handlePage = (page: number) => {
    setPage(page);
    setQuery(`${query}&page=${page}`);
  };

  useEffect(() => {
    refetch();
  }, [query, refetch]);
  return { data, isLoading, query, setQuery, handlePage, page };
}
