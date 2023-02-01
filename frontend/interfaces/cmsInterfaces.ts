import { Session } from "next-auth/core/types";
import { Dispatch, SetStateAction } from "react";

export interface LoginFormInterface {
  email: string;
  password: string;
}

export interface UserInterface {
  id: number | string;
  name: string;
  email: string;
  is_active: boolean | string;
  is_staff: boolean | string;
  last_login: string;
}

export interface RefreshTokenInterface {
  access?: string;
  access_token_expiration?: string;
  detail?: string;
  code?: string;
}

export interface SessionAuthInterface {
  access_token?: string;
  access_token_expiration?: string;
  refresh_token?: string;
  refresh_token_expiration?: string;
  user?: UserInterface;
}
//next-auth interface
export interface CustomerInterface {
  id: string;
  name: string;
  name_kana: string;
  tel: string;
  tel2: string;
  address: string;
  memos: CustomerMemoInterface[];
  pets: PetInterface[];
}
export interface CustomerMemoInterface extends MemoInterface {
  customer_id: number;
}

export interface MemoInterface {
  id: number;
  memo: string;
}
export interface MemoInterface {
  id: number;
  memo: string;
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

export interface QueryInterface {
  search: string;
  ordering: string;
  page: number;
}

export interface SearchValuesInterface {
  ordering?: string;
  search?: string;
}

export interface SearchInputInterface {
  setQuery: Dispatch<SetStateAction<QueryInterface>>;
  query: QueryInterface;
}

export interface CustomerTableInterface extends SearchInputInterface {
  customers: CustomersInterface | undefined;
  isLoading: boolean;
}
