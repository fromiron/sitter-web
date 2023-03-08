import CMSLayout from "@components/layout/cms/CMSLayout";
import { useCustomer } from "@hooks/useCustomer";
import { PetInterface, SessionAuthInterface } from "@interfaces/cmsInterfaces";
import { GetServerSideProps } from "next";
import { getSession } from "next-auth/react";
import { FaExchangeAlt, FaUser } from "react-icons/fa";
import Link from "next/link";
import CustomerPanel from "./partials/CustomerPanel";
import CustomerMemoPanel from "./partials/CustomerMemoPanel";
import NumberCountWidget from "@components/widgets/NumberCountWidget";
import { FeatureWidget } from "@components/widgets/FeatureWidget";
import { useEffect, useState } from "react";
import AddPetIcon from "@images/add_pet.svg";
import PetsSliderPanel from "./partials/PetSliderPanel";
import PetInfoPanel from "./partials/PetInfoPanel";
import { usePetMutation } from "@hooks/usePet";

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

  const [showPetInfo, setShowPetInfo] = useState<boolean>(false);
  const [selectedPet, setSelectedPet] = useState<PetInterface | null>(null);
  const [selectedPetIndex, setSelectedPetIndex] = useState<number>(0);

  const { editPet, uploadImage } = usePetMutation({ token });

  useEffect(() => {
    setShowPetInfo(false);
  }, []);

  useEffect(() => {
    if (customer) {
      setSelectedPet(customer.pets[selectedPetIndex]);
    }
  }, [customer, selectedPetIndex]);

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

      <div className="w-full overflow-hidden border border-opacity-50 rounded-md border-base-200 text-neutral">
        <div className="flex items-center p-4">
          <div className="text-xl font-medium">{customer.name}</div>
          <div className="divider divider-horizontal" />
          <div className="text-xs text-base-200">
            customer No.
            <span className="text-sm text-base-300">{customer.id}</span>
          </div>
        </div>
        <div className="px-20 py-8 bg-neutral-content">
          <div className="flex w-full gap-20">
            <div className="flex flex-col gap-4 pr-20 border-r">
              <NumberCountWidget
                count={customer.pets.length}
                title={"総登録ペット数"}
              />
              {/* todo バックエンド実装後アップデート */}
              <NumberCountWidget count={4} title={"総依頼数"} />
              <NumberCountWidget count={4} title={"未完了予約数"} />
              <NumberCountWidget count={customer.memos.length} title={"メモ"} />

              <FeatureWidget
                disabled={customer?.pets?.length === 0}
                Icon={FaExchangeAlt}
                size={24}
                onClick={() => {
                  setShowPetInfo(!showPetInfo);
                }}
              />

              <FeatureWidget
                Icon={AddPetIcon}
                size={24}
                iconSize={10}
                onClick={() => console.log("click")}
              />
            </div>
            <div className="relative flex w-full overflow-hidden">
              <div
                className={`absolute h-full w-full flex gap-10 transition ${
                  !showPetInfo
                    ? "opacity-100 -translate-y-0"
                    : "opacity-0 -translate-y-full"
                }`}
              >
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
              </div>
              <div
                className={`absolute  h-full w-full  flex gap-10 transition ${
                  showPetInfo
                    ? "opacity-100 -translate-y-0"
                    : "opacity-0 -translate-y-full"
                }`}
              >
                <PetsSliderPanel
                  pets={customer.pets}
                  setSelectedPetIndex={setSelectedPetIndex}
                />
                <PetInfoPanel
                  selectedPet={selectedPet}
                  editPet={editPet}
                  uploadImage={uploadImage}
                />
              </div>
            </div>
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
