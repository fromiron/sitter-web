import {
  Dispatch,
  SetStateAction,
  createContext,
  ReactNode,
  useState,
  useContext,
} from "react";

interface ModalInterface {
  showCustomerAddModal: boolean;
  setShowCustomerAddModal: Dispatch<SetStateAction<boolean>>;
  showCustomerDetailModal: boolean;
  setShowCustomerDetailModal: Dispatch<SetStateAction<boolean>>;
}

const ModalContext = createContext<ModalInterface | null>({
  showCustomerAddModal: false,
  setShowCustomerAddModal: () => {},
  showCustomerDetailModal: false,
  setShowCustomerDetailModal: () => {},
});

export const ModalProvider = ({ children }: { children: ReactNode }) => {
  const [showCustomerAddModal, setShowCustomerAddModal] =
    useState<boolean>(false);
  const [showCustomerDetailModal, setShowCustomerDetailModal] =
    useState<boolean>(false);

  return (
    <ModalContext.Provider
      value={{
        showCustomerAddModal,
        setShowCustomerAddModal,
        showCustomerDetailModal,
        setShowCustomerDetailModal,
      }}
    >
      {children}
    </ModalContext.Provider>
  );
};

export function useModalContext() {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error(
      "useModalContextは、カスタマープロバイダー内で使用する必要があります。"
    );
  }
  return context;
}
