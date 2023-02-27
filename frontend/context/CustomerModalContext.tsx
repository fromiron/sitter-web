import { CustomerInterface } from "@interfaces/cmsInterfaces";
import {
  Dispatch,
  SetStateAction,
  createContext,
  ReactNode,
  useState,
  useContext,
} from "react";
import { useForm } from "react-hook-form";

interface ModalInterface {
  showCustomerAddModal: boolean;
  setShowCustomerAddModal: Dispatch<SetStateAction<boolean>>;
  showCustomerDetailModal: boolean;
  setShowCustomerDetailModal: Dispatch<SetStateAction<boolean>>;
  clearModal: () => void;
}

const ModalContext = createContext<ModalInterface | null>({
  showCustomerAddModal: false,
  setShowCustomerAddModal: () => {},
  showCustomerDetailModal: false,
  setShowCustomerDetailModal: () => {},
  clearModal: () => {},
});

export const CustomerModalProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [showCustomerAddModal, setShowCustomerAddModal] =
    useState<boolean>(false);
  const [showCustomerDetailModal, setShowCustomerDetailModal] =
    useState<boolean>(false);
  const { reset } = useForm<CustomerInterface>();
  const clearModal = () => {
    setShowCustomerDetailModal(false);
    setShowCustomerAddModal(false);
    reset({});
  };
  return (
    <ModalContext.Provider
      value={{
        showCustomerAddModal,
        setShowCustomerAddModal,
        showCustomerDetailModal,
        setShowCustomerDetailModal,
        clearModal,
      }}
    >
      {children}
    </ModalContext.Provider>
  );
};

export function useCustomerModalContext() {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error(
      "useModalContextは、カスタマープロバイダー内で使用する必要があります。"
    );
  }
  return context;
}
