import { Session } from "next-auth/core/types";

//next-auth interface
export interface UserInterface {
  id: number | string;
  name: string;
  email: string;
  is_active: boolean | string;
  is_staff: boolean | string;
  last_login: string;
}

export interface SessionAuthInterface {
  access_token?: string;
  access_token_expiration?: string;
  user?: UserInterface;
}
//next-auth interface
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
