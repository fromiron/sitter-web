import { getSession } from "next-auth/react";
import { GetServerSideProps } from "next";
import CMSLayout from "@components/layout/cms/CMSLayout";
import {
  SearchSelectOptionInterface,
  SessionAuthInterface,
} from "@interfaces/cmsInterfaces";
import { Table } from "./partials/Table";
import { usePet, usePetType } from "@hooks/usePet";
import SearchInput from "@components/layout/cms/SearchInput";
import { TypeFilter } from "./partials/TypeFilter";

const options: SearchSelectOptionInterface = {
  idDESC: {
    query: "-id",
    string: "登録日",
  },
  idASC: {
    query: "id",
    string: "登録日",
  },
  nameDESC: {
    query: "-name",
    string: "名前",
  },
  nameASC: {
    query: "name",
    string: "名前",
  },
  kanaDESC: {
    query: "-birth",
    string: "誕生日",
  },
  kanaASC: {
    query: "birth",
    string: "誕生日",
  },
};

export default function Pet({ session }: { session: SessionAuthInterface }) {
  const {
    data: pets,
    isLoading,
    query,
    setQuery,
    typeFilter,
    typeFilterClear,
    setTypeFilter,
  } = usePet({ token: session.access_token });

  const { data: types, isLoading: typeLoading } = usePetType({
    token: session.access_token,
  });

  return (
    <CMSLayout>
      <SearchInput
        query={query}
        setQuery={setQuery}
        options={options}
        placeholder={"Search for pet"}
      />
      <div className="flex">
        <Table
          pets={pets}
          query={query}
          setQuery={setQuery}
          isLoading={isLoading}
        />
        <TypeFilter
          types={types}
          setTypeFilter={setTypeFilter}
          typeFilter={typeFilter}
          typeFilterClear={typeFilterClear}
        />
      </div>
    </CMSLayout>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);
  return {
    props: {
      session: session,
    },
  };
};
