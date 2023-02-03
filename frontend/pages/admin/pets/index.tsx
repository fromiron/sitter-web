import { getSession } from "next-auth/react";
import { GetServerSideProps } from "next";
import CMSLayout from "@components/layout/CMSLayout";
import { SessionAuthInterface } from "@interfaces/cmsInterfaces";
import { Table } from "./partials/Table";
import { usePet } from "@hooks/usePet";

export default function Pet({ session }: { session: SessionAuthInterface }) {
  const {
    data: pets,
    isLoading,
    query,
    setQuery,
  } = usePet({ token: session.access_token });

  return (
    <CMSLayout>
      <Table
        pets={pets}
        query={query}
        setQuery={setQuery}
        isLoading={isLoading}
      />
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
