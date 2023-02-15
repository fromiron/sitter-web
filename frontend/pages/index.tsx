import Layout from "@components/layout/Layout";
import Link from "next/link";
import {signOut} from "next-auth/react";

export default function Home() {
    return (
        <Layout>
            <Link className="btn btn-primary" href="/api/auth/signin">
                Sigin in
            </Link>
            <br/>
            <button className="btn btn-secondary" onClick={() => signOut()}>
                Sign out
            </button>
        </Layout>
    );
}
