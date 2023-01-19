import { useQuery } from "react-query";
import { PETS } from "@constants/queryKeys";
import axios from "axios";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { getSession } from "next-auth/react";
import { GetServerSideProps } from "next";
import CMSLayout from "@components/layout/CMSLayout";
import {
  PetInterface,
  PetsInterface,
  SessionAuthInterface,
} from "@interfaces/cmsInterfaces";
import { axiosClient } from "@lib/axios-client";


const BACKEND_API_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL;
export default function Pets({ session }: { session: SessionAuthInterface }) {
  const [page, setPage] = useState<number>(1);
  const [pageLength, setPageLength] = useState<number>(1);


  const getPets = async (page: number) => {
    const res = await axiosClient.get(
      `${BACKEND_API_URL}/api/pet/pets/?page=${page}`,
      {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
          Authorization: `JWT ${session?.access_token}`,
        },
      }
    );
    if (res.status === 200) {
      return res.data;
    }
  };

  const {
    isLoading,
    isError,
    data: pets,
  } = useQuery([PETS, page], () => getPets(page), {
    keepPreviousData: true,
  });

  const handlePageLength = () => {
    const PAGE_SIZE: number =
      Number(process.env.PAGE_SIZE) > 1 ? Number(process.env.PAGE_SIZE) : 20;

    if (pets) {
      const length = Math.ceil(pets.count / PAGE_SIZE);
      setPageLength(length);
    } else {
      setPageLength(1);
    }
  };

  useEffect(() => {
    handlePageLength();
  }, [pets]);

  return (
    <CMSLayout>
      <div>pets</div>
      <div>{pageLength}</div>
      <div>{session?.access_token}</div>

      {isLoading && <div>Loading...</div>}
      {isError && <div>Error...</div>}
      {pets && (
        <PetTable
          pets={pets}
          setPage={setPage}
          page={page}
          pageLength={pageLength}
        />
      )}
    </CMSLayout>
  );
}

const booleanToSexString = (boolean: boolean): string =>
  boolean ? "オス" : "めす";

function PetTable({
  pets,
  page,
  pageLength,
  setPage,
}: {
  pets: PetsInterface;
  page: number;
  pageLength: number;
  setPage: Dispatch<SetStateAction<number>>;
}) {
  return (
    <div className="overflow-x-auto">
      <table className="table w-full table-compact">
        <thead>
          <tr>
            <th>ID</th>
            <th>名前</th>
            <th>性別</th>
            <th>誕生日</th>
            <th>タイプ</th>
            <th>品種</th>
            <th>体重</th>
            <th className="text-2xl">飼い主</th>
          </tr>
        </thead>
        <tbody>
          {pets.results.map((pet: PetInterface, i: number) => (
            <tr key={`row${i}`}>
              <th>{pet.id}</th>
              <td>{pet.name}</td>
              <td>{booleanToSexString(pet.sex)}</td>
              <td>{pet.birth}</td>
              <td>{pet.type.name}</td>
              <td>{pet.breed.name}</td>
              <td>{pet.weight}</td>
              <td>
                <button>飼い主</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex justify-center w-full">
        <div className="btn-group">
          <button className="btn btn-sm" onClick={() => setPage(1)}>
            FIRST
          </button>
          <button
            onClick={() => setPage((old: number) => old - 1)}
            className={`btn btn-sm ${
              pets.previous === null ? "btn-disabled" : ""
            }`}
          >
            PRE
          </button>

          {[...Array(pageLength)].map((_, i) => (
            <button
              key={`pageBtn${i}`}
              className={`btn btn-sm ${page === i + 1 ? "btn-active" : ""}`}
              onClick={() => setPage(i + 1)}
            >
              {i + 1}
            </button>
          ))}

          <button
            onClick={() => setPage((old: number) => old + 1)}
            className={`btn btn-sm ${pets.next === null ? "btn-disabled" : ""}`}
          >
            NEXT
          </button>
          <button className="btn btn-sm" onClick={() => setPage(pageLength)}>
            LAST
          </button>
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
