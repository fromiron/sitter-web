import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useState,
} from "react";

interface PetModalInterface {
  showPetAddModal: boolean;
  setShowPetAddModal: Dispatch<SetStateAction<boolean>>;
}

const PetModalContext = createContext<PetModalInterface>({
  showPetAddModal: false,
  setShowPetAddModal: () => {},
});

const PetModalProvider = ({ children }: { children: ReactNode }) => {
  const [showPetAddModal, setShowPetAddModal] = useState<boolean>(false);

  return (
    <PetModalContext.Provider
      value={{
        showPetAddModal,
        setShowPetAddModal,
      }}
    >
      {children}
    </PetModalContext.Provider>
  );
};

export { PetModalContext, PetModalProvider };
