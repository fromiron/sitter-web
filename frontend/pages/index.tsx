import axios from "axios";
import { useSession } from "next-auth/react";
import { useState } from "react";
import Layout from "../components/Layout";

export default function Home() {
  const [customers, setCustomers] = useState([]);
  const { data: session, status } = useSession();
  console.log(session);

  const handleGoogleLogin = async () => {
    const API_URL = "http://localhost:8000";

    const res: any = await axios
      .post(`${API_URL}/api/social/google/`, {
        access_token: "access_token",
        id_token: "id_token",
      })
      .then((r) => console.log(r))
      .catch((error) => console.log(error));
  };

  console.log(session);

  const fetching = async () =>
    await axios
      .get("http://localhost:8000/api/customer/customers/")
      .then((r) => console.log(setCustomers(r.data.results)));

  return (
    <Layout>
      <div>
        <a href="/api/auth/signin">Sign in email</a>
      </div>
      <div>
        <button onClick={fetching}>fetching</button>
      </div>
      <div>
        <button onClick={handleGoogleLogin}>google</button>
      </div>
      {customers && customers.map((customer) => <div>{customer.name}</div>)}
      {session && session.user && session.user.name ? (
        <div>
          <div>{session.user.email}</div>
          <div>{session.user.name}</div>
          <div>{session.accessToken}</div>
        </div>
      ) : (
        <></>
      )}
    </Layout>
  );
}
