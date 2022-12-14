import { ReactNode } from "react";
import { UserInterface } from "../../interfaces/cmsInterfaces";
import CMSNavigation from "./partial/CMSNavigation";
import { useSession } from "@lib/next-auth-react-query";
import Link from "next/link";

export default function CMSLayout(
  { children }: { children: ReactNode },
  { user }: { user: UserInterface }
) {
  const [session, loading] = useSession({
    required: true,
    redirectTo: "http://localhost:3000",
    queryConfig: {
      staleTime: 60 * 1000 * 3, // 3hours
      refetchInterval: 60 * 1000 * 60, // 1hours
    },
  });
  if (loading) {
    //todo create loading component
    return <h1>Loading...</h1>;
  }

  const SIDE_MENU_WIDTH = "250px";
  const WIDTH = "w-[250px]";
  const TRANSLATE_X = "translate-x-[250px]";
  const TRANSLATE_X_ZERO = "translate-x-0";
  const NEGATIVE_TRANSLATE_X = "-translate-x-[250px]";

  const sideMenuToggle = () => {
    const sideMenu = document.getElementById("side-menu");
    const contentCanvas = document.getElementById("content-canvas");
    if (sideMenu?.className.includes(NEGATIVE_TRANSLATE_X)) {
      console.log("menu on");
      sideMenu?.classList.remove(NEGATIVE_TRANSLATE_X);
      sideMenu?.classList.add(TRANSLATE_X_ZERO);
      contentCanvas?.classList.remove(TRANSLATE_X_ZERO);
      contentCanvas?.classList.add(TRANSLATE_X);
    } else {
      console.log("menu off");
      sideMenu?.classList.add(NEGATIVE_TRANSLATE_X);
      sideMenu?.classList.remove(TRANSLATE_X_ZERO);
      contentCanvas?.classList.add(TRANSLATE_X_ZERO);
      contentCanvas?.classList.remove(TRANSLATE_X);
    }
  };
  return (
    <div>
      <div className={"flex bg-base-100"}>
        <div
          id={"side-menu"}
          className={`${NEGATIVE_TRANSLATE_X} ${WIDTH} px-4 pt-20 h-screen bg-white transition duration-500`}
        >
          <li>
            <Link href="/api/auth/signin">Sigin in</Link>
          </li>
          <li>
            <Link href="/api/auth/signout">Sigin out</Link>
          </li>
          <li>
            <Link href="/customers">Customers</Link>
          </li>
          <li>
            <Link href="/pets">Pets</Link>
          </li>
          {session?.user?.email}
        </div>
        <div className={"max-w-full "}>
          <div
            id={"content-canvas"}
            className={`${TRANSLATE_X_ZERO} left-0  h-screen w-full bg-base-100  transition fixed duration-500`}
          >

            {/* main */}
            <button onClick={sideMenuToggle}>menu</button>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
