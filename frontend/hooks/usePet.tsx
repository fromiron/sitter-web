import { PETS } from "@constants/queryKeys";
import { QueryInterface, PetsInterface } from "@interfaces/cmsInterfaces";
import { axiosClient } from "@lib/axios-client";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useQuery } from "react-query";

const BACKEND_API_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL;

async function getPets({
  query,
  token,
}: {
  query: { ordering: string; search: string; page: number };
  token?: string;
}): Promise<PetsInterface> {
  const { data } = await axiosClient.get(
    `${BACKEND_API_URL}/api/pet/pets/?page=${query.page}&ordering=${query.ordering}&search=${query.search}`,
    {
      headers: {
        Authorization: `JWT ${token}`,
      },
    }
  );
  return data;
}

interface UsePet {
  data?: PetsInterface;
  isLoading: boolean;
  setQuery: Dispatch<SetStateAction<QueryInterface>>;
  query: QueryInterface;
}

export function usePet({ token }: { token?: string }): UsePet {
  const [query, setQuery] = useState<{
    search: string;
    ordering: string;
    page: number;
  }>({
    search: "",
    ordering: "-id",
    page: 1,
  });

  const { data, isLoading } = useQuery([PETS, query], () =>
    getPets({ query, token })
  );

  return { data, isLoading, setQuery, query };
}
