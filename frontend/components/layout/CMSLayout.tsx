import { memo, ReactNode, useContext, useEffect, useState } from "react";
import {
  FaTablet,
  FaUser,
  FaFile,
  FaBookmark,
  FaCalendar,
  FaCalculator,
  FaCog,
  FaSun,
  FaMoon,
  FaAngleLeft,
  FaAngleRight,
} from "react-icons/fa";
import RabbitIcon from "@images/rabbit_icon.svg";
import { IconType } from "react-icons";
import { useTheme } from "next-themes";
import { useRouter } from "next/router";
import Link from "next/link";
import { WideModeContext } from "context/WideModeContext";

export default function CMSLayout({ children }: { children: ReactNode }) {
  return (
    <div className={"flex w-screen h-screen overflow-hidden"}>
      <SideBar />
      <div className="max-w-[900px]">{children}</div>
    </div>
  );
}

function SideBar() {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const { theme, setTheme } = useTheme();
  const router = useRouter();
  const context = useContext(WideModeContext);
  const { isWideMode, wideModeToggle } = context;

  function handleThemeToggle() {
    setIsDarkMode(!isDarkMode);
    if (theme === "lop") {
      setTheme("dwarf");
    } else {
      setTheme("lop");
    }
  }

  function isOpened(menuName: string) {
    return router.asPath.includes(menuName);
  }

  function ThemeToggleBtn() {
    return (
      <div className="flex items-center justify-center w-12 h-12 mt-4 rounded-xl bg-neutral-focus">
        <label
          className={`swap swap-rotate ${isDarkMode ? "swap-active" : ""}`}
          onClick={handleThemeToggle}
        >
          <FaSun className={"swap-off"} size={"1.5em"} color={"#ffd82e"} />
          <FaMoon className={"swap-on"} size={"1.5em"} color={"#d9e7fb"} />
        </label>
      </div>
    );
  }

  return (
    <div className="w-auto h-full ">
      <div
        className="flex justify-end w-full p-2 bg-primary"
        onClick={wideModeToggle}
      >
        <label
          className={`swap swap-rotate ${isWideMode ? "swap-active" : ""}`}
        >
          <FaAngleRight
            className={"swap-off"}
            size={"1.5em"}
            color={"#ffd82e"}
          />
          <FaAngleLeft className={"swap-on"} size={"1.5em"} color={"#d9e7fb"} />
        </label>
      </div>
      <div
        className={`flex flex-col items-center justify-between h-full  bg-neutral text-neutral-content transition-all duration-500  ${
          isWideMode ? "w-48" : "w-16"
        }`}
      >
        <ThemeToggleBtn />

        <div className="grid grid-cols-1 px-2 divide-y divide-neutral-focus">
          <div>
            <MenuIconContainer
              Icon={FaTablet}
              isOpened={isOpened("dashboard")}
              url={"/admin/dashboard"}
              name={"ダッシュボード"}
            />
          </div>
          <div>
            <MenuIconContainer
              Icon={RabbitIcon}
              isOpened={isOpened("pet")}
              url={"/admin/pet"}
              name={"ダッシュボード"}
            />
            <MenuIconContainer
              Icon={FaUser}
              isOpened={isOpened("customer")}
              url={"/admin/customer"}
              name={"ダッシュボード"}
            />
          </div>
          <div>
            <MenuIconContainer
              Icon={FaFile}
              isOpened={isOpened("karte")}
              url={"/admin/dashboard"}
              name={"ダッシュボード"}
            />
            <MenuIconContainer
              Icon={FaCalendar}
              isOpened={isOpened("reservation")}
              url={"/admin/dashboard"}
              name={"ダッシュボード"}
            />
          </div>
          <div>
            <MenuIconContainer
              Icon={FaCalculator}
              isOpened={isOpened("accounting")}
              url={"/admin/dashboard"}
              name={"ダッシュボード"}
            />
            <MenuIconContainer
              Icon={FaBookmark}
              isOpened={isOpened("bookmark")}
              url={"/admin/dashboard"}
              name={"ダッシュボード"}
            />
          </div>
        </div>
        <div>
          <MenuIconContainer
            Icon={FaCog}
            isOpened={isOpened("settings")}
            url={"/admin/dashboard"}
            name={"ダッシュボード"}
          />
        </div>
      </div>
    </div>
  );
}

function MenuIconContainer({
  Icon,
  isOpened,
  url,
  name,
}: {
  Icon: IconType;
  isOpened: boolean;
  url: string;
  name: string;
}) {
  return (
    <Link href={url} className={"flex items-center overflow-hidden"}>
      <div
        className={`${
          isOpened ? "bg-neutral-focus" : ""
        } flex flex-col items-center justify-center my-2 btn btn-square`}
      >
        <Icon />
      </div>
      <span className="ml-2 truncate text-base-300">{name}</span>
    </Link>
  );
}
