import {
  PET_BREEDS,
  PET_STAT,
  PET_TYPES,
  PETS,
  CUSTOMER_STAT,
  CUSTOMER,
  CUSTOMERS,
} from "@constants/queryKeys";
import {
  PetBreedInterface,
  PetInterface,
  PetsInterface,
  PetTypeInterface,
  QueryInterface,
} from "@interfaces/cmsInterfaces";
import { axiosClient } from "@lib/axios-client";
import { queryClient } from "@lib/react-query-client";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useMutation, useQuery } from "react-query";
import { toast } from "react-toastify";
import { AxiosError } from "axios";
import {
  addPetBreedMutation,
  addPetTypeMutation,
  deletePetBreedMutation,
  deletePetTypeMutation,
  editPetMutation,
  getPetBreeds,
  getPets,
  getPetTypes,
  uploadPetImage,
} from "./petQueries";

const BACKEND_API_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL;

interface UsePetTypeInterface {
  data?: PetTypeInterface[];
  isLoading: boolean;
}

interface UsePetBreedInterface {
  data?: PetBreedInterface[];
  isLoading: boolean;
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
    (payload: { name: string }) => addPetTypeMutation({ token, payload }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(PET_TYPES);
        queryClient.invalidateQueries(PET_STAT);
        toast.success("タイプ追加成功");
      },
      onError: (errors: AxiosError) => {
        toast.error("タイプ追加失敗");
        console.error("ERROR: " + errors);
      },
    }
  );

  const deletePetType = useMutation(
    (payload: { id: number }) => deletePetTypeMutation({ token, payload }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(PET_TYPES);
        queryClient.invalidateQueries(PET_BREEDS);
        queryClient.invalidateQueries(PET_STAT);
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

async function getPetStat({
  token,
}: {
  token?: string;
}): Promise<PetStatInference> {
  const { data } = await axiosClient.get(`${BACKEND_API_URL}/api/pet/stat`, {
    headers: {
      Authorization: `JWT ${token}`,
    },
  });
  return data;
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

export function usePetMutation({ token }: { token?: string }) {
  const uploadImage = useMutation(
    ({ id, formData }: { id?: number; formData: object }) =>
      uploadPetImage({ token, id, formData }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries([CUSTOMER]);
        toast.success("プロフィールイメージ登録成功");
        queryClient.invalidateQueries([CUSTOMERS]);
      },
      onError: (errors: AxiosError) => {
        toast.error("プロフィールイメージ登録失敗");
        console.error("ERROR: " + errors);
      },
    }
  );
  const editPet = useMutation(
    (payload: PetInterface) => editPetMutation({ token, payload }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries([CUSTOMER]);
        queryClient.invalidateQueries(CUSTOMER_STAT);
        toast.success("ペット情報修正成功");
      },
      onError: (errors: AxiosError) => {
        toast.error("ペット情報修正失敗");
        console.error("ERROR: " + errors);
      },
    }
  );
  return { uploadImage, editPet };
}

export function usePetBreedMutation({ token }: { token?: string }) {
  const addPetBreed = useMutation(
    (payload: { name: string; type_id: number }) =>
      addPetBreedMutation({ token, payload }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(PET_BREEDS);
        queryClient.invalidateQueries(PET_STAT);
        toast.success("品種追加成功");
      },
      onError: (errors: AxiosError) => {
        toast.error("品種追加失敗");
        console.error("ERROR: " + errors);
      },
    }
  );

  const deletePetBreed = useMutation(
    (payload: { id: number }) => deletePetBreedMutation({ token, payload }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(PET_BREEDS);
        queryClient.invalidateQueries(PET_STAT);
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

interface UsePetStatInterface {
  data?: PetStatInference;
  isLoading: boolean;
}

interface PetStatInference {
  pet_count: number;
  male_count: number;
  female_count: number;
  dead_count: number;
  type_count: number;
  breed_count: number;
}

export function usePetStat({ token }: { token?: string }): UsePetStatInterface {
  const { data, isLoading } = useQuery([PET_STAT], () => getPetStat({ token }));

  return { data, isLoading };
}
