import { ReactNode, useContext, useState } from "react";
import {
  FaTablet,
  FaUser,
  FaFile,
  FaBookmark,
  FaCalendar,
  FaCalculator,
  FaCog,
  FaAngleLeft,
  FaAngleRight,
} from "react-icons/fa";
import { IoSunny } from "react-icons/io5";
import { RiMoonClearFill } from "react-icons/ri";
import RabbitIcon from "@images/rabbit_icon.svg";
import { IconType } from "react-icons";
import { useTheme } from "next-themes";
import { useRouter } from "next/router";
import Link from "next/link";
import { WideModeContext } from "context/WideModeContext";

import CircleLogo from "@images/circle_logo.svg";
import CircleLogoDark from "@images/circle_logo_dark.svg";
import { useSession } from "@lib/next-auth-react-query";

export default function CMSLayout({ children }: { children: ReactNode }) {
  const sessionOption = {
    required: true,
    redirectTo: "/api/auth/signin?error=SessionExpired",
    queryConfig: {},
  };
  useSession(sessionOption);

  return (
    <div className={"flex w-screen h-screen"}>
      <SideBar />
      <div className="p-10">{children}</div>
    </div>
  );
}

function CategoryRender({ category }: { category: string }) {
  const context = useContext(WideModeContext);
  const { isWideMode } = context;

  return (
    <div
      className={`truncate rounded-lg ${
        isWideMode ? "h-4 text-opacity-100" : "h-0 text-opacity-0"
      }   text-white mt-4 text-xs  max-h-4  select-none duration-1000 `}
    >
      {category}
    </div>
  );
}

function SideBar() {
  const router = useRouter();
  const context = useContext(WideModeContext);
  const { isWideMode } = context;
  const { theme } = useTheme();

  function isOpened(menuName: string) {
    return router.asPath.includes(menuName);
  }

  return (
    <div className="flex flex-col justify-between transition-all duration-500 bg-neutral text-neutral-content shadow-[5px_1px_33px_-4px_rgba(0,0,0,0.4)]">
      <div>
        <WideModeButton />
        <div className="flex justify-center w-full mt-4 transition duration-500 group avatar drop-shadow-glow hover:drop-shadow-glow-hover">
          <div className="w-2/3 py-4 mask mask-squircle">
            <div className="flex items-center justify-center w-full h-full transition duration-500 scale-125 group-hover:saturate-200">
              {theme === "lop" ? <CircleLogoDark /> : <CircleLogo />}
            </div>
          </div>
        </div>
      </div>
      <div
        className={`flex flex-col items-center transition-all duration-500 ${
          isWideMode ? "w-48" : "w-16"
        }`}
      >
        <div className="grid grid-cols-1 px-2 divide-y divide-neutral-focus ">
          <div>
            <CategoryRender category={"Overview"} />
            <MenuIconContainer
              Icon={FaTablet}
              isOpened={isOpened("dashboard")}
              url={"/admin/dashboard"}
              name={"ダッシュボード"}
            />
          </div>

          <div>
            <CategoryRender category={"Management"} />
            <MenuIconContainer
              Icon={RabbitIcon}
              isOpened={isOpened("pet")}
              url={"/admin/pet"}
              name={"ペット"}
            />
            <MenuIconContainer
              Icon={FaUser}
              isOpened={isOpened("customer")}
              url={"/admin/customer"}
              name={"カスタマー"}
            />
            <MenuIconContainer
              Icon={FaFile}
              isOpened={isOpened("karte")}
              url={"/admin/dashboard"}
              name={"カルテ"}
            />
          </div>
          <div>
            <CategoryRender category={"Reservation"} />
            <MenuIconContainer
              Icon={FaCalendar}
              isOpened={isOpened("reservation")}
              url={"/admin/dashboard"}
              name={"予約情報"}
            />
          </div>
          <div>
            <CategoryRender category={"Utility"} />
            <MenuIconContainer
              Icon={FaCalculator}
              isOpened={isOpened("accounting")}
              url={"/admin/dashboard"}
              name={"経理"}
            />
            <MenuIconContainer
              Icon={FaBookmark}
              isOpened={isOpened("bookmark")}
              url={"/admin/dashboard"}
              name={"ブックマーク"}
            />
          </div>
          <div>
            <CategoryRender category={"Settings"} />
            <MenuIconContainer
              Icon={FaCog}
              isOpened={isOpened("settings")}
              url={"/admin/settings"}
              name={"設定"}
            />
          </div>
        </div>
      </div>
      <div className="flex justify-center w-full">
        <ThemeToggleButton />
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
    <Link href={url} className={"flex items-center overflow-hidden  w-full"}>
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

function WideModeButton() {
  const context = useContext(WideModeContext);
  const { isWideMode, wideModeToggle } = context;
  const handleClick = () => {
    wideModeToggle();
  };

  return (
    <div
      className="relative flex justify-end w-full mb-2 cursor-pointer bg-neutral-focus group"
      onClick={handleClick}
    >
      <div
        className={
          "absolute text-xs select-none inset-0 flex items-center justify-center truncate "
        }
      >
        <div
          className={`${
            isWideMode ? "opacity-100" : "opacity-0"
          } transition duration-500 max-w-full text-secondary-focus`}
        >
          Sitter Management System
        </div>
      </div>
      <label
        className={`swap swap-rotate  group-hover:animate-pulse ${
          isWideMode ? "swap-active" : ""
        }`}
      >
        <FaAngleRight className={"swap-off text-accent"} size={"1.5em"} />
        <FaAngleLeft className={"swap-on  text-accent-focus"} size={"1.5em"} />
      </label>
    </div>
  );
}

function ThemeToggleButton() {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const { theme, setTheme } = useTheme();
  function handleThemeToggle() {
    setIsDarkMode(!isDarkMode);
    if (theme === "lop") {
      setTheme("dwarf");
    } else {
      setTheme("lop");
    }
  }
  return (
    <div
      onClick={handleThemeToggle}
      className="flex items-center justify-center w-12 h-12 mb-4 cursor-pointer rounded-xl bg-neutral-focus"
    >
      <label className={`swap swap-rotate ${isDarkMode ? "swap-active" : ""}`}>
        <IoSunny className={"swap-off"} size={"1.5em"} color={"#ffd82e"} />
        <RiMoonClearFill
          className={"swap-on"}
          size={"1.5em"}
          color={"#d9e7fb"}
        />
      </label>
    </div>
  );
}
