import { MouseEventHandler, ReactNode, useEffect, useState } from "react";
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
} from "react-icons/fa";
import RabbitIcon from "@images/rabbit_icon.svg";
import { IconType } from "react-icons";
import { useTheme } from "next-themes";

export default function CMSLayout({ children }: { children: ReactNode }) {
  return (
    <div className={"flex w-full h-screen overflow-hidden"}>
      {/* <div className="w-24 bg-neutral"></div> */}
      <SideBar />
      <div className={"container"}>{children}</div>
    </div>
  );
}

function MenuIconContainer({ Icon }: { Icon: IconType }) {
  return (
    <div className="flex flex-col items-center justify-center my-2 btn btn-square">
      <Icon />
    </div>
  );
}

function SideBar() {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const { theme, setTheme } = useTheme();
  function handleToggle() {
    setIsDarkMode(!isDarkMode);
    if (theme === "lop") {
      setTheme("dwarf");
    } else {
      setTheme("lop");
    }
  }

  return (
    <div className="flex flex-col items-center justify-between w-16 h-full bg-neutral text-neutral-content">
      <div className="flex items-center justify-center w-full bg-neutral-focus aspect-square">
        <label
          className={`w-full h-full swap swap-rotate relative ${
            isDarkMode ? "swap-active" : ""
          }`}
          onClick={handleToggle}
        >
          <FaSun className={"swap-off"} size={"1.5em"} color={"#ffd82e"} />
          <FaMoon className={"swap-on"} size={"1.5em"} color={"#d9e7fb"} />
        </label>
      </div>
      <div className="grid grid-cols-1 divide-y divide-neutral-focus">
        <div>
          <MenuIconContainer Icon={FaTablet} />
        </div>
        <div>
          <MenuIconContainer Icon={RabbitIcon} />
          <MenuIconContainer Icon={FaUser} />
        </div>
        <div>
          <MenuIconContainer Icon={FaFile} />
          <MenuIconContainer Icon={FaCalendar} />
        </div>
        <div>
          <MenuIconContainer Icon={FaCalculator} />
          <MenuIconContainer Icon={FaBookmark} />
        </div>
        <div>
          <MenuIconContainer Icon={FaCog} />
        </div>
      </div>
      <div></div>
    </div>
  );
}
