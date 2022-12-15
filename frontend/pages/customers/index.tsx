import {GetServerSideProps, GetServerSidePropsContext} from "next";
import {getSession} from "next-auth/react";
import CMSLayout from "../../components/layout/CMSLayout";
import {
    CustomerInterface,
    CustomersInterface,
    SessionUserInterface,
} from "../../interfaces/cmsInterfaces";
import {useQuery} from "react-query";
import {CUSTOMERS} from "../../constants/queryKeys";
import axios from "axios";
import {Dispatch, SetStateAction, useEffect, useState} from "react";

export default function Customers({
                                      session,
                                  }: {
    session: SessionUserInterface;
}) {
    const [page, setPage] = useState<number>(1);
    const [sort, setSort] = useState<string>('DESC');
    const [ordering, setOrdering] = useState<string>('');
    const [search, setSearch] = useState<string>('');
    const [searchTemp, setSearchTemp] = useState<string>('');
    const [pageLength, setPageLength] = useState<number>(1);

    const getCustomers = async (page: number) => {
        const res = await axios.get(
            `http://localhost:8000/api/customer/customers/?ordering=${ordering}&page=${page}&search=${search}&sort=${sort}`,
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `JWT ${session.accessToken}`,
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
        data: customers,
        refetch,
    } = useQuery([CUSTOMERS, search, ordering, page, sort], () => getCustomers(page), {
        keepPreviousData: true,
    });

    /**
     * react-queryの自動Refetch時、Enter(submit)してないフィルターが反映されないよう
     * tempデータを利用する
     */
    const handlerChange = async (e: { target: { value: SetStateAction<string>; }; }) => {
        setSearchTemp(e.target.value)
    }
    const handleKeyDown = async (e: { key: string; }) => {
        if (e.key === 'Enter') {
            setSearch(searchTemp);
            setPage(1);
            await refetch();
        }
    }
    const handleOrdering = async (value: string) => {
        if (ordering === value) {
            if (value.includes('-')) {
                value = value.replace('-', '')
            } else {
                value = `-${value}`
            }
        }
        setOrdering(value)
        await refetch()
    };
    const handleSort = async () => {
        if (sort === 'ASC') {
            setSort('DESC')
        } else {
            setSort('ASC')
        }

        await refetch()
    };

    useEffect(() => {
        const PAGE_SIZE: number =
            Number(process.env.PAGE_SIZE) > 1 ? Number(process.env.PAGE_SIZE) : 20;
        if (customers) {
            const length = Math.ceil(customers.count / PAGE_SIZE);
            setPageLength(length);
        } else {
            setPageLength(1);
        }
    }, [customers, search]);

    if (!session.user || isError) {
        return (
            // TODO  rendering error page design
            <CMSLayout>
                <div>
                    <h1>ログイン情報がありません。</h1>
                    <p>再度ログインしてください。</p>
                </div>
            </CMSLayout>
        );
    }
    return (
        <CMSLayout>
            <div>Dashboard</div>
            <div>{pageLength}</div>
            <div>{session.accessToken}</div>
            <input type="text"
                   placeholder="Searching..."
                   className="input w-full max-w-xs"
                   onChange={handlerChange}
                   onKeyDown={handleKeyDown}
            />

            {isLoading && <div>Loading...</div>}
            {isError && <div>Error...</div>}
            {customers && (
                <CustomerTable customers={customers} handleOrdering={handleOrdering} handleSort={handleSort}/>
            )}
            <Pagination previous={customers?.previous} next={customers?.next} page={page} pageLength={pageLength}
                        setPage={setPage}/>
        </CMSLayout>
    );
}

function Pagination({
                        page,
                        pageLength,
                        setPage,
                        previous,
                        next
                    }:
                        {
                            page: number;
                            pageLength: number;
                            setPage: Dispatch<SetStateAction<number>>;
                            previous: string | null;
                            next: string | null;
                        }
) {

    return (
        <div className="flex justify-center w-full">
            <div className="btn-group">
                <button className="btn btn-sm" onClick={() => setPage(1)}>
                    FIRST
                </button>
                <button
                    onClick={() => setPage((old: number) => old - 1)}
                    className={`btn btn-sm ${
                        previous === null ? "btn-disabled" : ""
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
                    className={`btn btn-sm ${
                        next === null ? "btn-disabled" : ""
                    }`}
                >
                    NEXT
                </button>
                <button className="btn btn-sm" onClick={() => setPage(pageLength)}>
                    LAST
                </button>
            </div>
        </div>
    )

}

function CustomerTable({customers, handleOrdering, handleSort}: {
    customers: CustomersInterface,
    handleOrdering: (value: string) => void,
    handleSort: () => void
}) {
    return (
        <div className="overflow-x-auto">
            <table className="table w-full table-compact">
                <thead>
                <tr>
                    <th className='select-none cursor-pointer' onClick={() => handleSort()}>ID</th>
                    <th className='select-none cursor-pointer' onClick={() => handleOrdering('-name')}>名前</th>
                    <th className='select-none cursor-pointer' onClick={() => handleOrdering('-name_kana')}>かな名</th>
                    <th className='select-none cursor-pointer' onClick={() => handleOrdering('-tel')}>電話</th>
                    <th className='select-none cursor-pointer' onClick={() => handleOrdering('-tel2')}>電話2</th>
                    <th className='select-none cursor-pointer' onClick={() => handleOrdering('-address')}>住所</th>
                    <th>ペット</th>
                </tr>
                </thead>
                <tbody>
                {customers.results.map((customer: CustomerInterface, i) => (
                    <tr key={`row${i}`}>
                        <th>{customer.id}</th>
                        <td>{customer.name}</td>
                        <td>{customer.name_kana}</td>
                        <td>{customer.tel}</td>
                        <td>{customer.tel2}</td>
                        <td>{customer.address}</td>
                        <td>
                            <button>ペット情報</button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>

        </div>
    );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    // session dataがない場合はログイン画面にリダイレクト
    const session = await getSession(context);
    if (!session) {
        return {
            redirect: {
                destination: "/api/auth/signin",
                permanent: false,
            },
        };
    }

    return {
        props: {
            session: session,
        },
    };
};
