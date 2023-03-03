import CMSLayout from "@components/layout/cms/CMSLayout";

import { getSession } from "next-auth/react";
import { NextPageContext } from "next/types";
import { SessionAuthInterface } from "@interfaces/cmsInterfaces";
import { useEffect, useState } from "react";
import {
  Responsive,
  WidthProvider,
  Layout as LayoutInterface,
  Layouts as LayoutsInterface,
} from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import { GRID_LAYOUT_BREAKPOINTS, GRID_LAYOUT_COLS } from "@constants/layout";
const ResponsiveGridLayout = WidthProvider(Responsive);

export default function Dashboard({
  session,
}: {
  session: SessionAuthInterface;
}) {
  const [isReady, setIsReady] = useState<boolean>(false);
  const [layout, setLayout] = useState<LayoutsInterface>({ lg: [] });
  const LAYOUT_lOCAL_STORAGE_KEY = "dashboard-layout";

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedLayout = localStorage.getItem(LAYOUT_lOCAL_STORAGE_KEY);

      if (storedLayout) {
        setLayout(JSON.parse(storedLayout!));
      }
      setIsReady(true);
    }
  }, []);
  const onLayoutChange = (_: LayoutInterface[], layouts: LayoutsInterface) => {
    if (typeof window !== "undefined" && isReady) {
      setLayout(layouts);
      localStorage.setItem(LAYOUT_lOCAL_STORAGE_KEY, JSON.stringify(layouts));
    }
  };

  return (
    <CMSLayout>
      <div className="w-full h-auto">
        <ResponsiveGridLayout
          layouts={layout}
          breakpoints={GRID_LAYOUT_BREAKPOINTS}
          cols={GRID_LAYOUT_COLS}
          measureBeforeMount={true}
          onLayoutChange={onLayoutChange}
          isResizable={true}
        >
          <div key={1} className="bg-red-300">
            1
          </div>
          <div key={2} className="bg-blue-300">
            2
          </div>
          <div key={3} className="bg-green-300">
            3
          </div>
          <div key={4} className="bg-purple-300">
            4
          </div>
          <div key={5} className="bg-yellow-300">
            5
          </div>
          <div key={6} className="bg-fuchsia-300">
            6
          </div>
        </ResponsiveGridLayout>
      </div>
    </CMSLayout>
  );
}

export const getServerSideProps = async (context: NextPageContext) => {
  const session = await getSession(context);

  if (!session?.user?.is_staff) {
    return {
      redirect: {
        destination: "/admin/me",
        permanent: false,
      },
    };
  }
  return {
    props: {
      session,
    },
  };
};
