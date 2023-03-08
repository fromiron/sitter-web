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

// for mutation
export interface CustomerBaseInterface {
  id?: number | string;
  name: string;
  name_kana: string;
  tel: string;
  tel2: string;
  email: string;
  line: string;
  zipcode: string;
  address: string;
}

//next-auth interface
export interface CustomerInterface extends CustomerBaseInterface {
  id: number | string;
  memos: CustomerMemoInterface[];
  pets: PetInterface[];
}

export interface CustomerMemoInterface extends MemoInterface {
  customer_id: number | string;
  memo: string;
}

export interface MemoInterface {
  id: number;
  memo: string;
  customer_id: string | number;
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
  death: string | null;
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
  setIsModalOpen: Dispatch<SetStateAction<boolean>>;
  getCustomer: ({ id }: { id: number | string }) => Promise<
    | {
        data: CustomersInterface;
        error?: undefined;
      }
    | {
        data: null;
        error: unknown;
      }
  >;
}

export interface PetTableInterface extends BaseTableInterface {
  pets: PetsInterface | undefined;
  customerFilter: string | number;
  setCustomerFilter: Dispatch<SetStateAction<string | number>>;
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
