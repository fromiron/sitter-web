import axios from "axios";
import { useSession } from "next-auth/react";
import { useState } from "react";
import Layout from "../components/Layout";

import { useQuery } from "react-query";

export default function Home() {
  const {
    isLoading,
    isError,
    data: customers,
    error,
    refetch,
  } = useQuery("customers", getCustomers);

  const { data: session, status } = useSession();

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

  async function getCustomers() {
    console.log("asd");
    if (session.accessToken) {
      const { accessToken } = session;
      const token = accessToken;
      const config = {
        headers: {
          Authorization: `JWT ${token}`,
        },
      };

      const res = await axios.get(
        "http://localhost:8000/api/customer/customers/",
        config
      );
      console.log(res.data);
      
      if (res.status === 200) {
        return res.data.results;
      }
    }
  }

  if (status === "loading") {
    return <p>Loading...</p>;
  }

  return (
    <Layout>
      <div>
        <a href="/api/auth/signin">Sign in email</a>
      </div>

      <div>
        <button onClick={handleGoogleLogin}>google</button>
      </div>
      {session && session.user && session.user.name ? (
        <div>
          <div>{session.user.email}</div>
          <div>{session.user.name}</div>
          <div>{session.accessToken}</div>
        </div>
      ) : (
        <></>
      )}

      <button type="button" onClick={() => refetch}>
        refetch
      </button>
      {customers &&
       customers.length >0 &&
        customers.map((customer: any) => (
          <div className="my-4 bg-red-300" key={customer.id}>
            {customer.name}
          </div>
        ))}
    </Layout>
  );
}
