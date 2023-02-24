import { createContext, Dispatch, SetStateAction, useState } from "react";

const ModalContext = createContext<{
  isCustomerAddModalOpen: boolean;
  isCustomerDetailModalOpen: boolean;
  setIsCustomerAddModalOpen: Dispatch<SetStateAction<boolean>>;
  setIsCustomerDetailModalOpen: Dispatch<SetStateAction<boolean>>;
  clearModal: () => void;
}>({
  isCustomerAddModalOpen: false,
  isCustomerDetailModalOpen: false,
  setIsCustomerAddModalOpen: () => {},
  setIsCustomerDetailModalOpen: () => {},
  clearModal: () => {},
});

interface Props {
  children: JSX.Element | JSX.Element[];
}

const ModalProvider = ({ children }: Props): JSX.Element => {
  const [isCustomerAddModalOpen, setIsCustomerAddModalOpen] =
    useState<boolean>(false);
  const [isCustomerDetailModalOpen, setIsCustomerDetailModalOpen] =
    useState<boolean>(false);

  const clearModal = () => {
    setIsCustomerAddModalOpen(false);
    setIsCustomerDetailModalOpen(false);
  };
  return (
    <ModalContext.Provider
      value={{
        isCustomerAddModalOpen,
        isCustomerDetailModalOpen,
        setIsCustomerAddModalOpen,
        setIsCustomerDetailModalOpen,
        clearModal,
      }}
    >
      {children}
    </ModalContext.Provider>
  );
};

export { ModalContext, ModalProvider };
