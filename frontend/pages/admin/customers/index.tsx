import CMSLayout from "@components/layout/cms/CMSLayout";

import { useCustomer } from "@hooks/useCustomer";
import { RiUserAddLine } from "react-icons/ri";
import { Table } from "./partials/Table";
import { GetServerSideProps } from "next";
import { getSession } from "next-auth/react";
import {
  SearchSelectOptionInterface,
  SessionAuthInterface,
} from "@interfaces/cmsInterfaces";
import SearchInput from "@components/layout/cms/SearchInput";
import { ResetButton } from "@components/layout/buttons";
import NumberCountWidget from "@components/widgets/NumberCountWidget";
import { FeatureWidget } from "@components/widgets/FeatureWidget";
import { CustomerAddModal } from "./partials/CustomerAddModal";
import { CustomerDetailModal } from "./partials/CustomerDetailModal";
import { CustomerProvider, useCustomerContext } from "context/CustomerContext";
import {
  CustomerModalProvider,
  useCustomerModalContext,
} from "context/CustomerModalContext";

const options: SearchSelectOptionInterface = {
  idDESC: {
    query: "-id",
    string: "登録日",
  },
  idASC: {
    query: "id",
    string: "登録日",
  },
  nameDESC: {
    query: "-name",
    string: "漢字名",
  },
  nameASC: {
    query: "name",
    string: "漢字名",
  },
  kanaDESC: {
    query: "-name_kana",
    string: "カナ名",
  },
  kanaASC: {
    query: "name_kana",
    string: "カナ名",
  },
};

export default function Customers({
  session,
}: {
  session: SessionAuthInterface;
}) {
  const token = session.access_token;

  return (
    <CMSLayout>
      <CustomerProvider token={token}>
        <CustomerModalProvider>
          <ProviderWrapper />
        </CustomerModalProvider>
      </CustomerProvider>
    </CMSLayout>
  );
}

function ProviderWrapper() {
  const { setQuery, query, resetListQuery, customerStat } =
    useCustomerContext();
  const { setShowCustomerAddModal } = useCustomerModalContext();
  return (
    <>
      <CustomerAddModal />
      <CustomerDetailModal />
      <div className="flex gap-4 mb-4 w-fit">
        <NumberCountWidget
          count={customerStat?.data?.total_customers}
          title={"総顧客"}
        />
        <NumberCountWidget
          count={customerStat?.data?.recent_created}
          title={"新規顧客"}
        />
        <NumberCountWidget
          count={Number(customerStat?.data?.average_pets?.toFixed(2))}
          title={"平均ペット"}
        />
        <FeatureWidget
          Icon={RiUserAddLine}
          onClick={() => setShowCustomerAddModal(true)}
        />
      </div>
      <div className="flex">
        <SearchInput
          query={query}
          setQuery={setQuery}
          options={options}
          placeholder={"Search for customer"}
        />
        <ResetButton onClick={resetListQuery} />
      </div>
      <Table />
    </>
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
