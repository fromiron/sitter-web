import {
  CustomerInterface,
  CustomersInterface,
} from "@interfaces/cmsInterfaces";
import { axiosClient } from "@lib/axios-client";
const BACKEND_API_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL;

export async function addCustomerMutation({
  token,
  payload,
}: {
  token?: string;
  payload: any;
}) {
  await axiosClient.post(
    `${BACKEND_API_URL}/api/customer/customers/`,
    payload,
    {
      headers: {
        Authorization: `JWT ${token}`,
      },
    }
  );
  return null;
}

export async function editCustomerMutation({
  token,
  payload,
}: {
  token?: string;
  payload: any;
}) {
  await axiosClient.patch(
    `${BACKEND_API_URL}/api/customer/customers/${payload.id}/`,
    payload,
    {
      headers: {
        Authorization: `JWT ${token}`,
      },
    }
  );
  return null;
}

export async function deleteCustomerMutation({
  token,
  id,
}: {
  token?: string;
  id: string | number;
}) {
  await axiosClient.delete(`${BACKEND_API_URL}/api/customer/customers/${id}`, {
    headers: {
      Authorization: `JWT ${token}`,
    },
  });
  return null;
}

// TODO loopではなくバックエンドで処理するようリファクタリング
export async function deleteCustomersMutation({
  token,
  ids,
}: {
  token?: string;
  ids: number[];
}) {
  await axiosClient.delete(`${BACKEND_API_URL}/api/customer/customers/delete`, {
    headers: {
      Authorization: `JWT ${token}`,
    },
    data: { ids },
  });
  return null;
}

export async function fetchCustomers({
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

export async function fetchCustomer({
  id,
  token,
}: {
  id?: number | string;
  token?: string;
}): Promise<CustomerInterface> {
  const { data } = await axiosClient.get(
    `${BACKEND_API_URL}/api/customer/customers/${id}`,
    {
      headers: {
        Authorization: `JWT ${token}`,
      },
    }
  );
  return data;
}

interface CustomerStatInference {
  total_customers: number;
  average_pets: number;
  recent_created: number;
}

export async function fetchCustomerStat({
  token,
}: {
  token?: string;
}): Promise<CustomerStatInference> {
  const { data } = await axiosClient.get(
    `${BACKEND_API_URL}/api/customer/stat`,
    {
      headers: {
        Authorization: `JWT ${token}`,
      },
    }
  );
  return data;
}

export async function addCustomerMemoMutation({
  token,
  payload,
}: {
  token?: string;
  payload: any;
}) {
  await axiosClient.post(`${BACKEND_API_URL}/api/customer/memos/`, payload, {
    headers: {
      Authorization: `JWT ${token}`,
    },
  });
  return null;
}
export async function deleteCustomerMemoMutation({
  token,
  id,
}: {
  token?: string;
  id: string | number;
}) {
  await axiosClient.delete(`${BACKEND_API_URL}/api/customer/memos/${id}`, {
    headers: {
      Authorization: `JWT ${token}`,
    },
  });
  return null;
}
