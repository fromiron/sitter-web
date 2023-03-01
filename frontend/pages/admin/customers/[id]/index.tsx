import CMSLayout from "@components/layout/cms/CMSLayout";
import { useCustomer } from "@hooks/useCustomer";
import { SessionAuthInterface } from "@interfaces/cmsInterfaces";
import { GetServerSideProps } from "next";
import { getSession } from "next-auth/react";
import { FaExchangeAlt, FaUser } from "react-icons/fa";
import Link from "next/link";
import CustomerPanel from "./partials/CustomerPanel";
import CustomerMemoPanel from "./partials/CustomerMemoPanel";
import NumberCountWidget from "@components/widgets/NumberCountWidget";
import { FeatureWidget } from "@components/widgets/FeatureWidget";
import { useState } from "react";
import PetSlider from "./partials/PetSlider";
import AddPetIcon from "@images/add_pet.svg";

export default function Customer({
  session,
  id,
}: {
  session: SessionAuthInterface;
  id: number | string;
}) {
  const token = session.access_token;
  const {
    customer,
    isCustomerLoading,
    editCustomer,
    addCustomerMemo,
    deleteCustomerMemo,
  } = useCustomer({
    token,
    id,
  });

const [showPetInfo, setPetInfo] = useState<boolean>(false)


  if (isCustomerLoading) {
    return null;
  }

  if (!customer) {
    return null;
  }


  return (
    <CMSLayout>
      <div className="w-full ml-2 text-sm breadcrumbs">
        <ul>
          <li>
            <Link href={"/admin/dashboard"}>CMS</Link>
          </li>
          <li>
            <Link href={"/admin/customers"}>Customers</Link>
          </li>
          <li className="text-primary">{customer.name}</li>
        </ul>
      </div>

      <div className="w-full max-w-5xl overflow-hidden border border-opacity-50 rounded-md border-base-200 text-neutral">
        <div className="flex items-center p-4">
          <div className="text-xl font-medium">{customer.name}</div>
          <div className="divider divider-horizontal" />
          <div className="text-xs text-base-200">
            customer No.
            <span className="text-sm text-base-300">{customer.id}</span>
          </div>
        </div>
        <div className="flex p-8 bg-neutral-content">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex justify-between col-span-2">
              <div className="flex gap-4">
                <NumberCountWidget
                  count={customer.pets.length}
                  title={"総登録ペット数"}
                />
                {/* todo バックエンド実装後アップデート */}
                <NumberCountWidget count={4} title={"総依頼数"} />
                <NumberCountWidget count={4} title={"未完了予約数"} />
                <NumberCountWidget
                  count={customer.memos.length}
                  title={"メモ"}
                />
              </div>
              <div className="flex gap-4">
                <FeatureWidget
                  Icon={AddPetIcon}
                  onClick={() => console.log("click")}
                />
                {customer.pets.length >0 ?          <FeatureWidget
                  Icon={FaExchangeAlt}
                  onClick={() => {
                    setPetInfo(!showPetInfo);
                  }}
                />:null}
       
              </div>
            </div>

            {showPetInfo ? (
              <PetSlider pets={customer.pets} />
            ) : (
              <>
                <CustomerPanel
                  customer={customer}
                  editCustomer={editCustomer}
                />
                <CustomerMemoPanel
                  memos={customer.memos}
                  addCustomerMemo={addCustomerMemo}
                  deleteCustomerMemo={deleteCustomerMemo}
                  customerId={id}
                />
              </>
            )}
          </div>
        </div>
      </div>
    </CMSLayout>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);
  const { id } = context.query;

  return {
    props: {
      session,
      id,
    },
  };
};
