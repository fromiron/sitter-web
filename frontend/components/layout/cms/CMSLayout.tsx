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

export default function CMSLayout({ children }: { children: ReactNode }) {
  return (
    <div className={"flex w-screen h-screen"}>
      <SideBar />
      <div className="w-full p-10 overflow-auto">{children}</div>
    </div>
  );
}

function CategoryRender({ category }: { category: string }) {
  const context = useContext(WideModeContext);
  const { isWideMode } = context;

  return (
    <div
      className={`truncate rounded-md ${
        isWideMode ? "mt-4  mb-2 h-4 text-opacity-100" : "h-0 text-opacity-0"
      }   text-white ml-2 text-xs  max-h-4  select-none duration-1000`}
    >
      {category}
    </div>
  );
}

function SideBar() {
  const router = useRouter();
  const context = useContext(WideModeContext);
  const { isWideMode } = context;

  function isOpened(menuName: string) {
    return router.asPath.includes(menuName);
  }

  return (
    <div
      className={`flex flex-col transition-all h-full duration-500 border-r justify-between border-neutral-focus bg-neutral text-neutral-content ${
        isWideMode ? "w-52" : "w-16"
      }`}
    >
      <WideModeButton />
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
            isOpened={isOpened("pets")}
            url={"/admin/pets"}
            name={"ペット"}
          />
          <MenuIconContainer
            Icon={FaUser}
            isOpened={isOpened("customers")}
            url={"/admin/customers"}
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
  const context = useContext(WideModeContext);
  const { isWideMode } = context;
  return (
    <Link
      href={url}
      className={
        "flex items-center overflow-hidden rounded-md transition duration-500 hover:bg-secondary px-2 w-full group"
      }
    >
      <div
        className={`${
          isOpened ? "bg-neutral-focus" : ""
        } transition duration-500 my-2 btn btn-sm btn-square group-hover:bg-primary`}
      >
        <Icon className="text-sm" />
      </div>
      <span
        className={`${
          isWideMode ? " text-opacity-100" : "text-opacity-0"
        }  ml-2 text-sm truncate transition duration-500 text-base-300 group-hover:text-primary`}
      >
        {name}
      </span>
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
      className="relative flex justify-end w-full h-6 mb-2 cursor-pointer bg-neutral-focus group"
      onClick={handleClick}
    >
      <div
        className={
          "absolute text-xs select-none inset-0 flex items-center justify-center truncate"
        }
      >
        <div
          className={`${
            isWideMode ? "opacity-100" : "opacity-0"
          } transition duration-500 max-w-full text-neutral-content group-hover:text-secondary`}
        >
          Rabbit Sitter Hana CMS
        </div>
      </div>
      <label className={`swap swap-rotate ${isWideMode ? "swap-active" : ""}`}>
        <FaAngleRight className={"swap-off text-secondary"} />
        <FaAngleLeft className={"swap-on text-secondary"} />
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
      className="flex items-center justify-center w-12 h-12 mb-4 rounded-md cursor-pointer bg-neutral-focus"
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
