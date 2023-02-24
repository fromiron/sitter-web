import CMSLayout from "@components/layout/cms/CMSLayout";

import {
  useCustomer,
  useCustomerMutation,
  useCustomerStat,
} from "@hooks/useCustomer";
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
import { useContext, useState } from "react";
import { CustomerDetailModal } from "./partials/CustomerDetailModal";
import { ModalContext } from "context/ModalContext";

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
  const {
    data: customers,
    isLoading,
    query,
    setQuery,
    resetQuery,
  } = useCustomer({ token });

  const {
    isCustomerAddModalOpen,
    isCustomerDetailModalOpen,
    setIsCustomerAddModalOpen,
    setIsCustomerDetailModalOpen,
  } = useContext(ModalContext);

  const customerMutation = useCustomerMutation({ token });

  const { data: customerStat } = useCustomerStat({
    token: session.access_token,
  });

  const openCustomerAddModal = () => setIsCustomerAddModalOpen(true);

  return (
    <CMSLayout>
      <CustomerAddModal
        isModalOpen={isCustomerAddModalOpen}
        addCustomer={customerMutation.addCustomer}
        setIsModalOpen={setIsCustomerAddModalOpen}
      />
      <CustomerDetailModal
        isModalOpen={isCustomerDetailModalOpen}
        editCustomer={customerMutation.editCustomer}
        deleteCustomer={customerMutation.deleteCustomer}
        setIsModalOpen={setIsCustomerDetailModalOpen}
      />
      <div className="flex gap-4 mb-4 w-fit">
        <NumberCountWidget
          count={customerStat?.total_customers}
          title={"総顧客"}
        />
        <NumberCountWidget
          count={customerStat?.recent_created}
          title={"新規顧客"}
        />
        <NumberCountWidget
          count={Number(customerStat?.average_pets?.toFixed(2))}
          title={"平均ペット"}
        />
        <FeatureWidget Icon={RiUserAddLine} onClick={openCustomerAddModal} />
      </div>
      <div className="flex">
        <SearchInput
          query={query}
          setQuery={setQuery}
          options={options}
          placeholder={"Search for customer"}
        />
        <ResetButton onClick={resetQuery} />
      </div>
      <Table
        customers={customers}
        query={query}
        setQuery={setQuery}
        isLoading={isLoading}
        setIsModalOpen={setIsCustomerDetailModalOpen}
      />
    </CMSLayout>
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
