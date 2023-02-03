import { QueryInterface } from "@interfaces/cmsInterfaces";
import { Dispatch, ReactNode, SetStateAction } from "react";
import { MdNavigateBefore, MdNavigateNext } from "react-icons/md";

interface TableLayoutInterface {
  theadList: string[];
  TbodyRow: () => JSX.Element;
  from: number;
  to: number;
  count: number;
  setQuery: Dispatch<SetStateAction<QueryInterface>>;
  previous: number | null;
  next: number | null;
  pageArray: (string | number)[];
  query: QueryInterface;
}

export function TableLayout({
  theadList,
  TbodyRow,
  from,
  to,
  count,
  setQuery,
  previous,
  next,
  pageArray,
  query,
}: TableLayoutInterface) {
  return (
    <div className="w-full max-w-5xl overflow-x-auto border border-opacity-50 rounded-lg border-base-200 text-neutral">
      <table className="w-full table-compact">
        <thead>
          <tr>
            {theadList.map((thead) => (
              <th key={thead}>{thead}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y bg-neutral-content ">
          <TbodyRow />
        </tbody>
        <tfoot>
          <tr>
            <th colSpan={100} className="normal-case">
              <div className="flex items-center justify-between w-full">
                <div className="text-base-200">
                  {from}~{to} of {count}
                </div>
                <ul className="flex text-2x">
                  <li
                    onClick={() => setQuery({ ...query, page: query.page - 1 })}
                    className={`btn btn-ghost btn-sm btn-square 
                    ${previous ? null : "btn-disabled bg-base-100"}`}
                  >
                    <MdNavigateBefore />
                  </li>

                  {pageArray.map((pageNum, i) => (
                    <li
                      key={`page-btn-${i}`}
                      className={`btn btn-ghost btn-sm btn-square ${
                        query.page === pageNum ? "btn-active" : ""
                      } ${
                        typeof pageNum === "string"
                          ? "btn-disabled bg-base-100"
                          : null
                      }`}
                      onClick={() =>
                        setQuery({ ...query, page: pageNum as number })
                      }
                    >
                      {pageNum}
                    </li>
                  ))}

                  <li
                    onClick={() => setQuery({ ...query, page: query.page + 1 })}
                    className={`btn btn-ghost btn-sm btn-square ${
                      next ? null : "btn-disabled bg-base-100"
                    }`}
                  >
                    <MdNavigateNext />
                  </li>
                </ul>
              </div>
            </th>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}
