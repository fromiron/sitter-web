import Layout from "@components/layout/Layout";
import Link from "next/link";

export default function Home() {


  return (
    <Layout>
      lalala
      <Link href="/api/auth/signin">Sigin in</Link>

      <br/>
      <Link href="/api/auth/signout">Sigin out</Link>
    </Layout>
  );
}
