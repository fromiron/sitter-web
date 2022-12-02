import { useRouter } from "next/router";
import { ReactNode } from "react";
import Navigation from "./Navigation";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <>
      <Navigation />
      {children}
    </>
  );
}
