import {CUSTOMER_STAT, CUSTOMERS} from "@constants/queryKeys";
import {CustomersInterface, QueryInterface} from "@interfaces/cmsInterfaces";
import {axiosClient} from "@lib/axios-client";
import {Dispatch, SetStateAction, useState} from "react";
import {useQuery} from "react-query";

const BACKEND_API_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL;

async function getCustomers({
                                query,
                                token,
                            }: {
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

async function getCustomerStat({
                                   token,
                               }: {
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
