import CMSLayout from "@components/layout/CMSLayout";

import { useEffect, useState } from "react";
import { useCustomer } from "@hooks/useCustomer";
import { RiUserAddLine } from "react-icons/ri";
import { SearchInput } from "./partials/SearchInput";
import { Table } from "./partials/Table";
import { GetServerSideProps } from "next";
import { getSession } from "next-auth/react";
import { SessionAuthInterface } from "@interfaces/cmsInterfaces";

export default function Customers({
  session,
}: {
  session: SessionAuthInterface;
}) {
  const {
    data: customers,
    isLoading,
    query,
    setQuery,
  } = useCustomer({ token: session.access_token });

  return (
    <CMSLayout>
      <div className="grid grid-cols-2 gap-4 w-fit">
        <CustomerCounterBanner customerCountOrigin={customers?.count} />

        <div className="flex items-center justify-center w-24 h-24 mb-4 overflow-hidden text-4xl border border-opacity-50 rounded-lg cursor-pointer text-primary-content bg-primary border-base-200 ">
          <RiUserAddLine/>
        </div>
      </div>
      <SearchInput query={query} setQuery={setQuery} />

      <Table
        customers={customers}
        query={query}
        setQuery={setQuery}
        isLoading={isLoading}
      />
    </CMSLayout>
  );
}

function CustomerCounterBanner({
  customerCountOrigin,
}: {
  customerCountOrigin: number | undefined;
}) {
  const [customerCount, setCustomerCount] = useState<number | undefined>(
    undefined
  );

  useEffect(() => {
    if (customerCountOrigin !== undefined && customerCount === undefined) {
      setCustomerCount(customerCountOrigin - 2);
    }

    if (
      customerCountOrigin !== undefined &&
      customerCount !== undefined &&
      customerCountOrigin > customerCount
    ) {
      setTimeout(() => setCustomerCount(customerCount + 1), 400);
    }
  }, [customerCount, customerCountOrigin]);

  if (customerCountOrigin === undefined) {
    return null;
  }
  return (
    <div className="w-auto h-24 px-4 flex justify-center flex-col max-w-xs min-w-[10em] mb-4 overflow-hidden border border-opacity-50 rounded-lg bg-neutral-content text-neutral border-base-200">
      <div className="text-sm">Total Customer</div>
      <div className="text-5xl text-center">{customerCount}</div>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);
  return {
    props: {
      session: session,
    },
  };
};
