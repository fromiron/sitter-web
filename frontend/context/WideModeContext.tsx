import { createContext, useState } from "react";

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
