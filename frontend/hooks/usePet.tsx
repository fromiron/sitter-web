import { PETS, PET_TYPES } from "@constants/queryKeys";
import {
  QueryInterface,
  PetsInterface,
  PetTypeInterface,
} from "@interfaces/cmsInterfaces";
import { axiosClient } from "@lib/axios-client";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useQuery } from "react-query";

const BACKEND_API_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL;

async function getPets({
  query,
  token,
  typeFilter,
}: {
  query: { ordering: string; search: string; page: number };
  token?: string;
  typeFilter: number | string;
}): Promise<PetsInterface> {
  let filterString = "";
  if (typeof typeFilter === "number") {
    filterString += `&type_id=${typeFilter}`;
  }

  const { data } = await axiosClient.get(
    `${BACKEND_API_URL}/api/pet/pets/?page=${query.page}&ordering=${query.ordering}&search=${query.search}${filterString}`,
    {
      headers: {
        Authorization: `JWT ${token}`,
      },
    }
  );
  return data;
}

async function getPetTypes({ token }: { token?: string }) {
  const { data } = await axiosClient.get(`${BACKEND_API_URL}/api/pet/types`, {
    headers: {
      Authorization: `JWT ${token}`,
    },
  });
  return data;
}

interface UsePetInterface {
  data?: PetsInterface;
  isLoading: boolean;
  setQuery: Dispatch<SetStateAction<QueryInterface>>;
  query: QueryInterface;
  typeFilter: number | string;
  typeFilterClear: () => void;
  setTypeFilter: Dispatch<SetStateAction<string | number>>;
}

interface UsePetTypeInterface {
  data?: PetTypeInterface[];
  isLoading: boolean;
}

export function usePet({ token }: { token?: string }): UsePetInterface {
  const [query, setQuery] = useState<{
    search: string;
    ordering: string;
    page: number;
  }>({
    search: "",
    ordering: "-id",
    page: 1,
  });
  const [typeFilter, setTypeFilter] = useState<number | string>("all");
  useEffect(() => setQuery({ ...query, page: 1 }), [typeFilter]);

  const typeFilterClear = () => setTypeFilter("all");
  const { data, isLoading } = useQuery([PETS, query, typeFilter], () =>
    getPets({ query, token, typeFilter })
  );

  return {
    data,
    isLoading,
    setQuery,
    query,
    typeFilterClear,
    setTypeFilter,
    typeFilter,
  };
}

export function usePetType({ token }: { token?: string }): UsePetTypeInterface {
  const { data, isLoading } = useQuery([PET_TYPES], () =>
    getPetTypes({ token })
  );
  return { data, isLoading };
}
