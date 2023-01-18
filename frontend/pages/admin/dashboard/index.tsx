import CMSLayout from "@components/layout/CMSLayout";

import { getSession } from "next-auth/react";
import { GetServerSideProps, NextPageContext } from "next/types";
import { useQuery } from "react-query";
import { SessionAuthInterface } from "@interfaces/cmsInterfaces";

export default function Dashboard({
  session,
}: {
  session: SessionAuthInterface;
}) {
  //   console.log("session", session);

  return (
    <CMSLayout>
      <div>Dashboard</div>
      <div>mail {session?.user?.email}</div>
      <div>is Active {session?.user?.is_active?.toString()}</div>
      <div>is Staff {session?.user?.is_staff?.toString()}</div>
    </CMSLayout>
  );
}

export const getServerSideProps = async (context: NextPageContext) => {
  const session = await getSession(context);

  return {
    props: {
      session: session,
    },
  };
};
