import CMSLayout from "@components/layout/cms/CMSLayout";

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
import {
  CustomerModalProvider,
  useCustomerModalContext,
} from "context/CustomerModalContext";
import { useCustomer } from "@hooks/useCustomer";
import Link from "next/link";

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
      <CustomerModalProvider>
        <Render token={token} />
      </CustomerModalProvider>
    </CMSLayout>
  );
}

function Render({ token }: { token?: string }) {
  const { setShowCustomerAddModal } = useCustomerModalContext();
  const {
    setQuery,
    query,
    resetListQuery,
    customerStat,
    list,
    isListLoading,

  } = useCustomer({ token });

  return (
    <div>
      <CustomerAddModal />
      <div className="flex items-end gap-4">
        <div>
          <div className="w-full ml-2 text-sm breadcrumbs">
            <ul>
              <li>
                <Link href={"/admin/dashboard"}>CMS</Link>
              </li>
              <li className="text-primary">Customers</li>
            </ul>
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
        </div>
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
      </div>
      <Table
        list={list}
        isListLoading={isListLoading}
        query={query}
        setQuery={setQuery}
      />
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
