import Layout from '@components/layout/CMSLayout';
import {useSession} from "@lib/next-auth-react-query";

export default function Home() {

    const [session, loading] = useSession({
        required: true,
        redirectTo: 'http://localhost:3000',
        queryConfig: {
            staleTime: 60 * 1000 * 3, // 3hours
            refetchInterval: 60 * 1000 * 5 //5minutes
        }
    })

    if (loading) {
        return <h1>Loading...</h1>
    }
    if (session) {
        return (
            <Layout>
                {session.user?.email}<br/>
                <div>session</div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div>not have session data</div>
        </Layout>
    );
}
