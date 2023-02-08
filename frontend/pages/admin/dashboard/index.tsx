import CMSLayout from "@components/layout/cms/CMSLayout";

import { getSession } from "next-auth/react";
import { NextPageContext } from "next/types";
import { SessionAuthInterface } from "@interfaces/cmsInterfaces";
import { useState } from "react";

export default function Dashboard({
  session,
}: {
  session: SessionAuthInterface;
}) {
  //   console.log("session", session);

  const [test, setIsTest] = useState(false);

  return (
    <CMSLayout>
      <div>Dashboard</div>
      <div>mail {session?.user?.email}</div>

      <div
        className={`${
          test ? "translate-x-0" : "translate-x-11"
        } transform text-white transition-all text-xs mt-3 bg-black text-white w-full `}
        onClick={() => setIsTest(!test)}
      >
        asdasds
      </div>
      <button className="btn" onClick={() => setIsTest(!test)}>
        asdasdsa
      </button>
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
