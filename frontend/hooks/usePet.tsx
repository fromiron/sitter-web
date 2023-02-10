import { PETS, PET_BREEDS, PET_TYPES } from "@constants/queryKeys";
import {
  QueryInterface,
  PetsInterface,
  PetTypeInterface,
  PetBreedInterface,
} from "@interfaces/cmsInterfaces";
import { axiosClient } from "@lib/axios-client";
import { queryClient } from "@lib/react-query-client";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useMutation, useQuery } from "react-query";
import { toast } from "react-toastify";
import { AxiosError } from "axios";

const BACKEND_API_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL;

interface UsePetTypeInterface {
  data?: PetTypeInterface[];
  isLoading: boolean;
}
interface UsePetBreedInterface {
  data?: PetBreedInterface[];
  isLoading: boolean;
}

async function getPets({
  query,
  token,
  typeFilter,
  breedFilter,
  customerFilter,
}: {
  query: { ordering: string; search: string; page: number };
  token?: string;
  typeFilter: number | string;
  breedFilter: number | string;
  customerFilter: number | string;
}): Promise<PetsInterface> {
  let typeFilterString = "";
  if (typeof typeFilter === "number") {
    typeFilterString += `&type_id=${typeFilter}`;
  }
  let breedFilterString = "";
  if (typeof breedFilter === "number") {
    breedFilterString += `&breed_id=${breedFilter}`;
  }
  let customerFilterString = "";
  if (typeof customerFilter === "number") {
    customerFilterString += `&customer_id=${customerFilter}`;
  }
  const { data } = await axiosClient.get(
    `${BACKEND_API_URL}/api/pet/pets/?page=${query.page}&ordering=${query.ordering}&search=${query.search}${typeFilterString}${breedFilterString}${customerFilterString}`,
    {
      headers: {
        Authorization: `JWT ${token}`,
      },
    }
  );
  return data;
}

async function getPetTypes({ token }: { token?: string }) {
  const { data } = await axiosClient.get(`${BACKEND_API_URL}/api/pet/types/`, {
    headers: {
      Authorization: `JWT ${token}`,
    },
  });
  return data;
}

async function getPetBreeds({ token }: { token?: string }) {
  const { data } = await axiosClient.get(`${BACKEND_API_URL}/api/pet/breeds/`, {
    headers: {
      Authorization: `JWT ${token}`,
    },
  });
  return data;
}

async function addPetTypes({
  token,
  payload,
}: {
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

async function deletePetTypes({
  token,
  payload,
}: {
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

async function addPetBreeds({
  token,
  payload,
}: {
  token?: string;
  payload: { type_id: number; name: string };
}) {
  console.log(payload);
  await axiosClient.post(`${BACKEND_API_URL}/api/pet/breeds/`, payload, {
    headers: {
      Authorization: `JWT ${token}`,
    },
  });
  return null;
}

async function deletePetBreeds({
  token,
  payload,
}: {
  token?: string;
  payload: { id: number };
}) {
  await axiosClient.delete(`${BACKEND_API_URL}/api/pet/breeds/${payload.id}/`, {
    headers: {
      Authorization: `JWT ${token}`,
    },
  });
  return null;
}

interface UsePetInterface {
  data?: PetsInterface;
  isLoading: boolean;
  setQuery: Dispatch<SetStateAction<QueryInterface>>;
  query: QueryInterface;
  typeFilter: number | string;
  typeFilterClear: () => void;
  setTypeFilter: Dispatch<SetStateAction<string | number>>;
  breedFilter: number | string;
  breedFilterClear: () => void;
  setBreedFilter: Dispatch<SetStateAction<string | number>>;
  resetQuery: () => void;
  customerFilter: number | string;
  setCustomerFilter: Dispatch<SetStateAction<string | number>>;
  customerFilterClear: () => void;
}

export function usePet({ token }: { token?: string }): UsePetInterface {
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
  const [typeFilter, setTypeFilter] = useState<number | string>("all");
  const [breedFilter, setBreedFilter] = useState<number | string>("all");
  const [customerFilter, setCustomerFilter] = useState<number | string>("all");
  const typeFilterClear = () => setTypeFilter("all");
  const breedFilterClear = () => setBreedFilter("all");
  const customerFilterClear = () => setCustomerFilter("all");

  const resetQuery = () => {
    typeFilterClear();
    breedFilterClear();
    customerFilterClear();
    setQuery(defaultQuery);
  };

  useEffect(() => {
    breedFilterClear();
    setQuery({ ...query, page: 1 });
  }, [typeFilter]);
  useEffect(() => setQuery({ ...query, page: 1 }), [breedFilter]);

  useEffect(() => {
    breedFilterClear();
    typeFilterClear();
    setQuery({ ...query, page: 1 });
  }, [customerFilter]);

  const { data, isLoading } = useQuery(
    [PETS, query, typeFilter, breedFilter, customerFilter],
    () => getPets({ query, token, typeFilter, breedFilter, customerFilter })
  );

  return {
    data,
    isLoading,
    setQuery,
    query,
    typeFilterClear,
    setTypeFilter,
    typeFilter,
    breedFilter,
    setBreedFilter,
    breedFilterClear,
    resetQuery,
    customerFilter,
    setCustomerFilter,
    customerFilterClear,
  };
}

export function usePetType({ token }: { token?: string }): UsePetTypeInterface {
  const { data, isLoading } = useQuery([PET_TYPES], () =>
    getPetTypes({ token })
  );

  return { data, isLoading };
}

export function usePetTypeMutation({ token }: { token?: string }) {
  const addPetType = useMutation(
    (payload: { name: string }) => addPetTypes({ token, payload }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(PET_TYPES);
        toast.success("タイプ追加成功");
      },
      onError: (errors: AxiosError) => {
        toast.error("タイプ追加失敗");
        console.error("ERROR: " + errors);
      },
    }
  );

  const deletePetType = useMutation(
    (payload: { id: number }) => deletePetTypes({ token, payload }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(PET_TYPES);
        toast.success("タイプ削除成功");
      },
      onError: (errors: AxiosError) => {
        toast.error("タイプ削除失敗");
        console.error("ERROR: " + errors);
      },
    }
  );

  return { addPetType, deletePetType };
}

export function usePetBreed({
  token,
}: {
  token?: string;
}): UsePetBreedInterface {
  const { data, isLoading } = useQuery([PET_BREEDS], () =>
    getPetBreeds({ token })
  );

  return { data, isLoading };
}

export function usePetBreedMutation({ token }: { token?: string }) {
  const addPetBreed = useMutation(
    (payload: { name: string; type_id: number }) =>
      addPetBreeds({ token, payload }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(PET_BREEDS);
        toast.success("品種追加成功");
      },
      onError: (errors: AxiosError) => {
        toast.error("品種追加失敗");
        console.error("ERROR: " + errors);
      },
    }
  );

  const deletePetBreed = useMutation(
    (payload: { id: number }) => deletePetBreeds({ token, payload }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(PET_BREEDS);
        toast.success("品種削除成功");
      },
      onError: (errors: AxiosError) => {
        toast.error("品種削除失敗");
        console.error("ERROR: " + errors);
      },
    }
  );

  return { addPetBreed, deletePetBreed };
}
