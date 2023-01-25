import CMSLayout from "@components/layout/CMSLayout";

import { getSession } from "next-auth/react";
import { GetServerSideProps, NextPageContext } from "next/types";
import { useQuery } from "react-query";
import { SessionAuthInterface } from "@interfaces/cmsInterfaces";
import { useState } from "react";

export default function Dashboard({
  session,
}: {
  session: SessionAuthInterface;
}) {
  //   console.log("session", session);
  const [action, isAction] = useState(false);

  return (
    <CMSLayout>
      <div>Dashboard</div>
      <div>mail {session?.user?.email}</div>
      {/* <div>token {session?.access_token}</div>
      <div>expiration {session?.access_token_expiration}</div>

      <div>refresh {session?.refresh_token}</div>
      <div>refresh expiration {session?.refresh_token_expiration}</div>
      <div>is Active {session?.user?.is_active?.toString()}</div>
      <div>is Staff {session?.user?.is_staff?.toString()}</div> */}

      <div className={`h-24 bg-lime-600 transition-all ${action ? "w-48" : "w-24 "}`}></div>
      <button className="btn btn-primary" onClick={()=>isAction(!action)}>test</button>
    </CMSLayout>
  );
}

export const getServerSideProps = async (context: NextPageContext) => {
  const session = await getSession(context);

  if (!session?.user?.is_staff) {
    return {
      redirect: {
        destination: "/admin/me",
        permanent: false,
      },
    };
  }
  return {
    props: {
      session: session,
    },
  };
};
