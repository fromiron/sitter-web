import CMSLayout from "@components/layout/CMSLayout";
import {
  SessionInterface,
  SessionUserInterface,
} from "types/cmsInterfaces";
import { getSession } from "next-auth/react";
import { GetServerSideProps } from "next/types";

export default function Dashboard({
  session,
}: {
  session: SessionUserInterface;
}) {
  return (
    <CMSLayout>
      <div>Dashboard</div>
      <div>is Active {session?.user?.is_active.toString()}</div>
      <div>is Staff {session?.user?.is_staff.toString()}</div>
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
