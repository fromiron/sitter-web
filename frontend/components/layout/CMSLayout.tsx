import {ReactNode} from "react";
import {UserInterface} from "../../interfaces/cmsInterfaces";
import CMSNavigation from "./partial/CMSNavigation";


export default function Layout({children}: { children: ReactNode }, {user}: { user: UserInterface }) {

    return (
        <div className={'flex justify-center'}>
            <div className={'max-w-screen-xl'}>
                <CMSNavigation/>
                {children}
            </div>
        </div>
    );
}
