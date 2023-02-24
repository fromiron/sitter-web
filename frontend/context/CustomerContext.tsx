import { useCustomer } from "@hooks/useCustomer";
import React, { createContext, ReactNode, useContext } from "react";

type CustomerContextType = ReturnType<typeof useCustomer>;

const CustomerContext = createContext<CustomerContextType | null>(null);

export function CustomerProvider({
  token,
  children,
}: {
  token?: string;
  children: ReactNode;
}) {
  const value = useCustomer({ token });
  return (
    <CustomerContext.Provider value={value}>
      {children}
    </CustomerContext.Provider>
  );
}

export function useCustomerContext() {
  const context = useContext(CustomerContext);
  if (!context) {
    throw new Error(
      "useCustomerContextは、カスタマープロバイダー内で使用する必要があります。"
    );
  }
  return context;
}
