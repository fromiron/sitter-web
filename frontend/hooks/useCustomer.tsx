import {
  CUSTOMER_STAT,
  CUSTOMERS,
  CUSTOMER,
  PETS,
  PET_STAT,
} from "@constants/queryKeys";
import { CustomerBaseInterface } from "@interfaces/cmsInterfaces";
import { useState } from "react";
import { useMutation, useQuery } from "react-query";
import { queryClient } from "@lib/react-query-client";
import { toast } from "react-toastify";
import { AxiosError } from "axios/index";
import {
  addCustomerMemoMutation,
  addCustomerMutation,
  deleteCustomerMemoMutation,
  deleteCustomerMutation,
  deleteCustomersMutation,
  editCustomerMutation,
  fetchCustomer,
  fetchCustomers,
  fetchCustomerStat,
} from "./customerQueries";
import { useCustomerModalContext } from "context/CustomerModalContext";
import { CustomerMemoInterface } from "../interfaces/cmsInterfaces";

export function useCustomer({
  token,
  id,
}: {
  token?: string;
  id?: number | string;
}) {
  const { clearModal } = useCustomerModalContext();

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

  const {
    data: list,
    isLoading: isListLoading,
    refetch: listRefetch,
  } = useQuery([CUSTOMERS, query], () => fetchCustomers({ query, token }));

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
  const {
    data: customer,
    isLoading: isCustomerLoading,
    refetch: customerRefetch,
  } = useQuery([CUSTOMER, id], () => fetchCustomer({ token, id: id }), {
    enabled: !!id,
  });

  // Update customer
  const editCustomer = useMutation(
    (payload: CustomerBaseInterface) =>
      editCustomerMutation({ token, payload }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(CUSTOMERS);
        queryClient.invalidateQueries(CUSTOMER_STAT);
        toast.success("顧客情報修正成功");
      },
      onError: (errors: AxiosError) => {
        toast.error("顧客情報修正失敗");
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
  // Delete customers
  const deleteCustomers = useMutation(
    ({ ids }: { ids: number[] }) => deleteCustomersMutation({ token, ids }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(CUSTOMERS);
        queryClient.invalidateQueries(CUSTOMER_STAT);
        queryClient.invalidateQueries(PETS);
        queryClient.invalidateQueries(PET_STAT);
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

  // add memo

  const addCustomerMemo = useMutation(
    (payload: CustomerMemoInterface) =>
      addCustomerMemoMutation({ token, payload }),
    {
      onSuccess: () => {
        toast.success("メモ追加成功");
        queryClient.invalidateQueries(CUSTOMER);
      },
      onError: (errors: AxiosError) => {
        toast.error("メモ追加失敗");
        console.error("ERROR: " + errors);
      },
    }
  );

  const deleteCustomerMemo = useMutation(
    ({ id }: { id: string | number }) =>
      deleteCustomerMemoMutation({ token, id }),
    {
      onSuccess: () => {
        toast.success("メモ削除成功");
        queryClient.invalidateQueries(CUSTOMER);
      },
      onError: (errors: AxiosError) => {
        toast.error("メモ削除失敗");
        console.error("ERROR: " + errors);
      },
    }
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
    deleteCustomers,
    customerStat,
    customer,
    customerRefetch,
    isCustomerLoading,
    addCustomerMemo,
    deleteCustomerMemo,
  };
}
