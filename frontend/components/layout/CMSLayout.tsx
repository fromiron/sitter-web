import { ReactNode } from "react";
import CMSNavigation from "./partial/CMSNavigation";


export default function Layout({ children }: { children: ReactNode }, {user}:{user:UserInterface}) {

  return (
    <>
      <CMSNavigation />
      {children}
    </>
  );
}
