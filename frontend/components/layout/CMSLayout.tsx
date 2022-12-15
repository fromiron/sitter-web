import {ReactNode} from "react";
import {UserInterface} from "../../interfaces/cmsInterfaces";
import CMSNavigation from "./partial/CMSNavigation";
import {useSession} from "@lib/next-auth-react-query";


export default function Layout({children}: { children: ReactNode }, {user}: { user: UserInterface }) {
    const [session, loading] = useSession({
        required: true,
        redirectTo: 'http://localhost:3000',
        queryConfig: {
            staleTime: 60 * 1000 * 3, // 3hours
            refetchInterval: 60 * 1000 * 5 //5minutes
        }
    })
    console.log('ss!')
    if (loading) {
        //todo create loading component
        return <h1>Loading...</h1>
    }

    return (
        <div className={'flex justify-center'}>
            <div className={'max-w-screen-xl'}>
                <CMSNavigation/>
                {children}
            </div>
        </div>
    );
}
