import { SessionAuthInterface } from "@interfaces/cmsInterfaces";
import { getSession, signOut } from "next-auth/react";
import { GetServerSideProps } from "next/types";
import { useRouter } from "next/router";

export default function Me({ session }: { session: SessionAuthInterface }) {
  const router = useRouter();
  const handleLogOut = () => signOut();
  const handleGoToMain = () => router.push("/");

  if (!session) {
    return <div>error</div>;
  }

  return (
    <div>
      <table>
        <tr>
          <th>name</th>
          <td>{session?.user?.name}</td>
        </tr>
        <tr>
          <th>email</th>
          <td>{session?.user?.email}</td>
        </tr>

        <tr>
          <th>アカウント活性化</th>
          <td>{session?.user?.is_active.toString()}</td>
        </tr>
        <tr>
          <th>スタッフ権限</th>
          <td>{session?.user?.is_staff.toString()}</td>
        </tr>
      </table>
      <button className="btn" onClick={handleLogOut}>
        LOGOUT
      </button>
      <button className="btn" onClick={handleGoToMain}>
        GO TO MAIN
      </button>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);
  if (!session?.user) {
    return {
      redirect: {
        destination: "/",
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
