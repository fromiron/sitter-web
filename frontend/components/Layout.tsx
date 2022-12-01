import { GetServerSideProps } from "next";
import { Session } from "next-auth";
import { getSession, signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { ReactNode, useEffect } from "react";

interface UserInterface {
  id: string;
  name: string;
  email: string;
}

export default function Layout(
  { children }: { children: ReactNode },
  { user }: { user: string }
) {
  const router = useRouter();
  const { data: session, status } = useSession();
  console.log("Dashboard - access");
  console.log(session);
  async function handleLogout() {
    await signOut({ callbackUrl: `${window.location.origin}/login` });
  }
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status]);

  if(status==='loading'){
    return (
        <div>loading...</div>
    )
  }
  return (
    <div>
      <div>
        <div>{session?.user?.name}</div>
        <div>{session?.user?.email}</div>
        <button onClick={handleLogout}>Sign out</button>
      </div>
      {children}
    </div>
  );
}
