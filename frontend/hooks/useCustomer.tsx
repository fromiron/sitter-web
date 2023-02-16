import {CUSTOMER_STAT, CUSTOMERS} from "@constants/queryKeys";
import {CustomersInterface, QueryInterface} from "@interfaces/cmsInterfaces";
import {axiosClient} from "@lib/axios-client";
import {Dispatch, SetStateAction, useState} from "react";
import {useMutation, useQuery} from "react-query";
import {queryClient} from "@lib/react-query-client";
import {toast} from "react-toastify";
import {AxiosError} from "axios/index";

const BACKEND_API_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL;

async function getCustomers({query, token}: {
    query: { ordering: string; search: string; page: number };
    token?: string;
}): Promise<CustomersInterface> {
    const {data} = await axiosClient.get(
        `${BACKEND_API_URL}/api/customer/customers/?page=${query.page}&ordering=${query.ordering}&search=${query.search}`,
        {
            headers: {
                Authorization: `JWT ${token}`,
            },
        }
    );
    return data;
}

async function getCustomerStat({token}: {
    token?: string;
}): Promise<CustomerStatInference> {
    const {data} = await axiosClient.get(
        `${BACKEND_API_URL}/api/customer/stat`,
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
    resetQuery: () => void;
}

interface UseCustomerStatInterface {
    data?: CustomerStatInference;
    isLoading: boolean;
}

export function useCustomer({token}: { token?: string }): UseCustomer {
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

    const {data, isLoading} = useQuery([CUSTOMERS, query], () =>
        getCustomers({query, token})
    );

    const resetQuery = () => setQuery(defaultQuery);
    return {data, isLoading, setQuery, query, resetQuery};
}

interface CustomerStatInference {
    "total_customers": number,
    "average_pets": number,
    "recent_created": number
}

export function useCustomerStat({token}: { token?: string }): UseCustomerStatInterface {
    const {data, isLoading} = useQuery([CUSTOMER_STAT], () =>
        getCustomerStat({token})
    );

    return {data, isLoading};
}

async function addCustomerMutation({token, payload}: {
    token?: string;
    payload: any;
}) {
    await axiosClient.post(`${BACKEND_API_URL}/api/pet/types/`, payload, {
        headers: {
            Authorization: `JWT ${token}`,
        },
    });
    return null;
}

async function deleteCustomerMutaion({token, payload}: {
    token?: string;
    payload: { id: number };
}) {
    await axiosClient.delete(`${BACKEND_API_URL}/api/pet/types/${payload.id}/`, {
        headers: {
            Authorization: `JWT ${token}`,
        },
    });
    return null;
}

export function useCustomerMutation({token}: { token?: string }) {
    const addCustomer = useMutation(
        (payload: { name: string; }) =>
            addCustomerMutation({token, payload}),
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

    const deleteCustomer = useMutation(
        (payload: { id: number }) => deleteCustomerMutaion({token, payload}),
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

    return {addCustomer, deleteCustomer};
}