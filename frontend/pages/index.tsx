import axios from "axios";
import { getSession, useSession } from "next-auth/react";
import { useState } from "react";
import Layout from "../components/Layout";

export default function Home({ session }) {
  console.log(session);

  return (
    <Layout>
      <div>home</div>
      <div>{session.user.name}</div>
      <div>{session.user.email}</div>
    </Layout>
  );
}
export async function getServerSideProps(context) {
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
}
