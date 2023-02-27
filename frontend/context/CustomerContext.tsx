import { useCustomer } from "@hooks/useCustomer";
import React, { createContext, ReactNode, useEffect, useContext } from "react";

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

  useEffect(() => {
    console.log("context");

    console.log(value.list);
  }, [value]);

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
