import { createContext, useEffect, useState } from "react";

const WideModeContext = createContext({
  isWideMode: false,
  wideModeToggle: () => {},
});

interface Props {
  children: JSX.Element | JSX.Element[];
}

const WideModeProvider = ({ children }: Props): JSX.Element => {
  const [isWideMode, setIsWideMode] = useState<boolean>(false);

  const wideModeToggle = (): void => {
    const value = !isWideMode;
    localStorage.setItem("wideMode", value.toString());
    setIsWideMode(value);
  };

  useEffect(() => {
    const wideMode = localStorage.getItem("wideMode") === "true";
    setIsWideMode(wideMode);
  }, []);

  return (
    <WideModeContext.Provider
      value={{
        isWideMode,
        wideModeToggle,
      }}
    >
      {children}
    </WideModeContext.Provider>
  );
};

export { WideModeContext, WideModeProvider };
