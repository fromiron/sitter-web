import CMSLayout from "@components/layout/cms/CMSLayout";

import { RiUserAddLine, RiUserUnfollowLine } from "react-icons/ri";
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
import { useEffect, useState } from "react";
import { FeatureWarningWidget } from "../../../components/widgets/FeatureWidget";

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
    deleteCustomers,
    list,
    isListLoading,
  } = useCustomer({ token });

  const [selectedItems, setSelectedItems] = useState<number[]>([]);

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;

    if (event.target.checked) {
      setSelectedItems([...selectedItems, parseInt(value)]);
    } else {
      setSelectedItems(selectedItems.filter((id) => id !== parseInt(value)));
    }
  };

  const handleDelete = () => {
    if (selectedItems.length === 0) {
      alert("削除する顧客を選択してください");
    } else {
      if (confirm(`${selectedItems.length}件を削除しますか？`)) {
        deleteCustomers.mutate({ ids: selectedItems });
      }
    }
  };

  useEffect(() => {
    console.log(selectedItems);
  }, [selectedItems]);

  function Breadcrumbs() {
    return (
      <div className="w-full ml-2 text-sm breadcrumbs">
        <ul>
          <li>
            <Link href={"/admin/dashboard"}>CMS</Link>
          </li>
          <li className="text-primary">Customers</li>
        </ul>
      </div>
    );
  }

  return (
    <div>
      <CustomerAddModal />
      <div className="flex items-end gap-4">
        <div>
          <Breadcrumbs />
          <div className="flex">
            <SearchInput
              query={query}
              setQuery={setQuery}
              options={options}
              placeholder={"Search for customer"}
            />
            <ResetButton onClick={resetListQuery} />
            <FeatureWidget
              Icon={RiUserAddLine}
              onClick={() => setShowCustomerAddModal(true)}
            />
            <FeatureWarningWidget
              Icon={RiUserUnfollowLine}
              onClick={handleDelete}
            />
          </div>
        </div>
      </div>
      <div className="flex">
        <div className="w-full max-w-5xl ">
          <Table
            list={list}
            isListLoading={isListLoading}
            query={query}
            setQuery={setQuery}
            selectedItems={selectedItems}
            handleCheckboxChange={handleCheckboxChange}
          />
        </div>
        <div className="flex flex-col gap-4 mb-4 ml-4 w-fit">
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
        </div>
      </div>
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
