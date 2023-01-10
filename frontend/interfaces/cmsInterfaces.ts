import { GetServerSidePropsContext } from "next/types";

export interface UserInterface {
  user: {
    name: string;
    email: string;
    image: string;
  };
  accessToken: string;
  expires: string;
}

export interface SessionInterface extends GetServerSidePropsContext {
  user?: {
    name: string;
    email: string;
    image: string;
  };
  accessToken?: string;
  expires?: string;
}

export interface CustomerInterface {
  id: string;
  name: string;
  name_kana: string;
  tel: string;
  tel2: string;
  address: "ㅁㄴㅇㅁㄴㄻ";
}

export interface CustomersInterface {
  count: number;
  next: number | null;
  previous: number | null;
  results: CustomerInterface[];
}

export interface PetInterface {
  id: number;
  name: "string";
  sex: boolean;
  birth: string;
  death: string;
  type: {
    id: number;
    name: "string";
  };
  breed: {
    id: number;
    name: "string";
  };
  customer: number;
  weight: number;
}

export interface PetsInterface {
  count: number;
  next: number | null;
  previous: number | null;
  results: PetInterface[];
}
