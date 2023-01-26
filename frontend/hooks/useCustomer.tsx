import { CUSTOMERS } from "@constants/queryKeys";
import { CustomersInterface } from "@interfaces/cmsInterfaces";
import { axiosClient } from "@lib/axios-client";
import { Dispatch, SetStateAction, useCallback, useState } from "react";
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
  isLoading:boolean;
  setQuery: Dispatch<SetStateAction<string>>;
}

export function useCustomer({ token }: { token?: string }): UseCustomer {
  const [query, setQuery] = useState<string>("");
  const { data, isLoading } = useQuery(CUSTOMERS, () => getCustomer({ query, token }));
  return { data, isLoading, query, setQuery };
}
