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
  customer: {
    id: number;
    name: string;
    name_kana?: string;
  };
  weight: number;
  image: string | null;
  thumbnail: string | null;
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
  options: SearchSelectOptionInterface;
  placeholder?: string;
}

export interface BaseTableInterface {
  setQuery: Dispatch<SetStateAction<QueryInterface>>;
  query: QueryInterface;
  isLoading: boolean;
}
export interface CustomerTableInterface extends BaseTableInterface {
  customers: CustomersInterface | undefined;
}
export interface PetTableInterface extends BaseTableInterface {
  pets: PetsInterface | undefined;
}

export interface SearchSelectOptionInterface {
  [key: string]: { query: string; string: string };
}

export interface PetTypeInterface {
  id: number;
  name: string;
}

export interface PetBreedInterface {
  id: number;
  name: string;
  type_id: number;
}
