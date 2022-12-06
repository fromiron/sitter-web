import { GetServerSideProps, GetServerSidePropsContext } from "next";
import { getSession } from "next-auth/react";
import CMSLayout from "../../components/layout/CMSLayout";
import { SessionUserInterface } from "../../interfaces/cmsInterfaces";



export default function Dashboard({ session }: { session: SessionUserInterface }) {
  if (!session.user) {
    return (
        // TODO  rendering error page design
      <div>
        <h1>ログイン情報がありません。</h1>
        <p>再度ログ・インしてください。</p>
      </div>
    );
  }
  return (
    <CMSLayout>
      <div>Dashboard</div>
      <div>{session.user.name}</div>
    </CMSLayout>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);
  if (!session) {
    return {
      redirect: {
        destination: "/api/auth/signin",
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
