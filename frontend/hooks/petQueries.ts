import { PetInterface, PetsInterface } from "@interfaces/cmsInterfaces";
import { axiosClient } from "@lib/axios-client";
const BACKEND_API_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL;

export async function getPets({
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

export async function uploadPetImage({
  token,
  id,
  formData,
}: {
  token?: string;
  id?: number;
  formData: object;
}) {
  const { data } = await axiosClient.post(
    `${BACKEND_API_URL}/api/pet/pets/${id}/image-upload/`,
    formData,
    {
      headers: {
        Authorization: `JWT ${token}`,
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return null;
}

export async function getPetTypes({ token }: { token?: string }) {
  const { data } = await axiosClient.get(`${BACKEND_API_URL}/api/pet/types/`, {
    headers: {
      Authorization: `JWT ${token}`,
    },
  });
  return data;
}

export async function editPetMutation({
  token,
  payload,
}: {
  token?: string;
  payload: PetInterface;
}) {
  await axiosClient.patch(
    `${BACKEND_API_URL}/api/pet/pets/${payload.id}/`,
    payload,
    {
      headers: {
        Authorization: `JWT ${token}`,
      },
    }
  );
  return null;
}

export async function getPetBreeds({ token }: { token?: string }) {
  const { data } = await axiosClient.get(`${BACKEND_API_URL}/api/pet/breeds/`, {
    headers: {
      Authorization: `JWT ${token}`,
    },
  });
  return data;
}

export async function addPetTypeMutation({
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

export async function deletePetTypeMutation({
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

export async function addPetBreedMutation({
  token,
  payload,
}: {
  token?: string;
  payload: { type_id: number; name: string };
}) {
  await axiosClient.post(`${BACKEND_API_URL}/api/pet/breeds/`, payload, {
    headers: {
      Authorization: `JWT ${token}`,
    },
  });
  return null;
}

export async function deletePetBreedMutation({
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
