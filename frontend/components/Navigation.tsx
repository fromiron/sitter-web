import { signIn, signOut, useSession } from "next-auth/react";

export default function Navigation() {
  const { data: session } = useSession();
    console.log(session);
    
  return (
    <div>
      Navigation
      {session ? (
        <>
          <div>
            <button onClick={() => signOut()}>Sign out</button>
          </div>
        </>
      ) : (
        <div>
          <button onClick={() => signIn("google")}>Sign in</button>
        </div>
      )}
    </div>
  );
}
