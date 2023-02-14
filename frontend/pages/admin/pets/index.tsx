import { getSession } from "next-auth/react";
import { GetServerSideProps } from "next";
import CMSLayout from "@components/layout/cms/CMSLayout";
import {
  SearchSelectOptionInterface,
  SessionAuthInterface,
} from "@interfaces/cmsInterfaces";
import { Table } from "./partials/Table";
import {
  usePet,
  usePetBreed,
  usePetBreedMutation,
  usePetType,
  usePetTypeMutation,
} from "@hooks/usePet";
import SearchInput from "@components/layout/cms/SearchInput";
import { TypeFilter } from "./partials/TypeFilter";
import { useState } from "react";
import { TypeControlModal } from "./partials/TypeControlModal";
import { BreedFilter } from "./partials/BreedFilter";
import { ResetButton } from "@components/layout/buttons";
import { BreedControlModal } from "./partials/BreedControlModal";
import NumberCountWidget from "@components/widget/NumberCountWidget";
import { FeatureWidget } from "@components/widget/FeatureWidget";
import NumberRatioWidget from "@components/widget/NumberRatioWidget";
import AddPetIcon from "@images/add_pet.svg";

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
    string: "名前",
  },
  nameASC: {
    query: "name",
    string: "名前",
  },
  kanaDESC: {
    query: "-birth",
    string: "誕生日",
  },
  kanaASC: {
    query: "birth",
    string: "誕生日",
  },
};

export default function Pet({ session }: { session: SessionAuthInterface }) {
  const [isTypeModalOpen, setIsTypeModalOpen] = useState(false);
  const [isBreedModalOpen, setIsBreedModalOpen] = useState(false);

  const token = session.access_token;
  const {
    data: pets,
    isLoading,
    query,
    setQuery,
    typeFilter,
    typeFilterClear,
    setTypeFilter,
    breedFilter,
    setBreedFilter,
    breedFilterClear,
    resetQuery,
    customerFilter,
    setCustomerFilter,
  } = usePet({ token });

  const { data: types } = usePetType({ token });
  const { data: breeds } = usePetBreed({ token });
  const petTypeMutation = usePetTypeMutation({ token });
  const petBreedMutation = usePetBreedMutation({ token });
  const openTypeModal = () => setIsTypeModalOpen(true);
  const openBreedModal = () => setIsBreedModalOpen(true);

  const filteredBreeds = breeds?.filter(
    (breed) => breed.type_id === typeFilter
  );

  return (
    <CMSLayout>
      <TypeControlModal
        isModalOpen={isTypeModalOpen}
        setIsModalOpen={setIsTypeModalOpen}
        types={types}
        mutation={petTypeMutation}
      />
      <BreedControlModal
        isModalOpen={isBreedModalOpen}
        setIsModalOpen={setIsBreedModalOpen}
        breeds={breeds}
        types={types}
        mutation={petBreedMutation}
      />
      <div className="flex gap-4 mb-4 w-fit">
        <NumberCountWidget count={pets?.count} title={"総登録ペット数"} />
        <NumberCountWidget count={4} title={"虹の橋"} />
        <NumberRatioWidget count1={29} count2={20} title={"性比"} />
        <NumberCountWidget count={4} title={"タイプ"} />
        <NumberCountWidget count={12} title={"品種"} />
        <FeatureWidget Icon={AddPetIcon} onClick={() => console.log("click")} />
      </div>

      <div className="flex">
        <SearchInput
          query={query}
          setQuery={setQuery}
          options={options}
          placeholder={"Search for pet"}
        />
        <ResetButton onClick={resetQuery} />
      </div>
      <div className="flex gap-4">
        <div className="flex-1 max-w-5xl">
          <Table
            pets={pets}
            query={query}
            setQuery={setQuery}
            isLoading={isLoading}
            customerFilter={customerFilter}
            setCustomerFilter={setCustomerFilter}
          />
        </div>
        <div>
          <TypeFilter
            types={types}
            setTypeFilter={setTypeFilter}
            typeFilter={typeFilter}
            typeFilterClear={typeFilterClear}
            openModal={openTypeModal}
          />
          <BreedFilter
            breeds={filteredBreeds}
            setBreedFilter={setBreedFilter}
            breedFilter={breedFilter}
            breedFilterClear={breedFilterClear}
            openModal={openBreedModal}
          />
        </div>
      </div>
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
