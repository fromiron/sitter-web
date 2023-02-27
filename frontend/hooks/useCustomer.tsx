import { CUSTOMER_STAT, CUSTOMERS, CUSTOMER } from "@constants/queryKeys";
import { CustomerBaseInterface } from "@interfaces/cmsInterfaces";
import { useEffect, useState } from "react";
import { useMutation, useQuery } from "react-query";
import { queryClient } from "@lib/react-query-client";
import { toast } from "react-toastify";
import { AxiosError } from "axios/index";
import {
  addCustomerMutation,
  deleteCustomerMutation,
  fetchCustomer,
  fetchCustomers,
  fetchCustomerStat,
} from "./queries";
import { useCustomerModalContext } from "context/CustomerModalContext";

export function useCustomer({ token }: { token?: string }) {
  const { clearModal } = useCustomerModalContext();
  const [customerId, setCustomerId] = useState<number | string>(0);

  // Read customer list
  const defaultQuery = {
    search: "",
    ordering: "-id",
    page: 1,
  };
  const [query, setQuery] = useState<{
    search: string;
    ordering: string;
    page: number;
  }>(defaultQuery);

  const { data: list, isLoading: isListLoading } = useQuery(
    [CUSTOMERS, query],
    () => fetchCustomers({ query, token })
  );

  const resetListQuery = () => {
    setQuery(defaultQuery);
  };

  // Create customer
  const addCustomer = useMutation(
    (payload: CustomerBaseInterface) => addCustomerMutation({ token, payload }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(CUSTOMERS);
        queryClient.invalidateQueries(CUSTOMER_STAT);
        toast.success("顧客追加成功");
        clearModal();
      },
      onError: (errors: AxiosError) => {
        toast.error("顧客追加失敗");
        console.error("ERROR: " + errors);
      },
    }
  );

  // Read customer
  const { data: customer, isLoading: isCustomerLoading } = useQuery(
    [CUSTOMER, customerId],
    () => {
      if (customerId !== 0) return fetchCustomer({ token, id: customerId });
    },
    {
      refetchOnMount: true,
      refetchOnWindowFocus: true,
    }
  );

  // Update customer
  const editCustomer = useMutation(
    (payload: CustomerBaseInterface) => addCustomerMutation({ token, payload }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(CUSTOMERS);
        queryClient.invalidateQueries(CUSTOMER_STAT);
        toast.success("顧客追加成功");
      },
      onError: (errors: AxiosError) => {
        toast.error("顧客追加失敗");
        console.error("ERROR: " + errors);
      },
    }
  );

  // Delete customer
  const deleteCustomer = useMutation(
    ({ id }: { id: string | number }) => deleteCustomerMutation({ token, id }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(CUSTOMERS);
        queryClient.invalidateQueries(CUSTOMER_STAT);
        toast.success("顧客削除成功");
      },
      onError: (errors: AxiosError) => {
        toast.error("顧客削除失敗");
        console.error("ERROR: " + errors);
      },
    }
  );

  // Read Customer stat
  const customerStat = useQuery([CUSTOMER_STAT], () =>
    fetchCustomerStat({ token })
  );

  return {
    list,
    isListLoading,
    setQuery,
    query,
    resetListQuery,
    addCustomer,
    editCustomer,
    deleteCustomer,
    customerStat,
    customer,
    isCustomerLoading,
    setCustomerId,
  };
}
