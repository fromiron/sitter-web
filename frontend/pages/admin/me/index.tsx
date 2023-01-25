import { SessionAuthInterface } from "@interfaces/cmsInterfaces";
import { getSession, signOut } from "next-auth/react";
import { GetServerSideProps } from "next/types";
import { useRouter } from "next/router";
import DisabledProfile from "@images/logo_profile_disabled.svg";
import ActiveProfile from "@images/logo_profile.svg";

export default function Me({ session }: { session: SessionAuthInterface }) {
  const router = useRouter();
  const handleLogOut = () => signOut();
  const handleLink = (url: string) => router.push(url);

  const isActive = session?.user?.is_active === true;
  const isStaff = session?.user?.is_staff === true;

  const boolToString = (flg: boolean) => {
    if (flg) return "活性化済";
    return "活性前";
  };

  return (
    <div className="flex flex-col items-center justify-center w-full h-screen bg-neutral text-neutral-content">
      <div className="shadow-xl card max-w-[600px] hover:bg-neutral-focus transition duration-500">
        <div className="px-10 pt-10">
          {isActive && isStaff ? <ActiveProfile /> : <DisabledProfile />}
        </div>
        <div className="items-center card-body">
          <h2 className="card-title">
            {isActive && isStaff
              ? "Rabbit Sitter HANA"
              : "管理者に問い合わせてください"}
          </h2>
          <p
            className={`text-sm ${
              isActive && isStaff ? "text-secondary" : "text-error"
            }`}
          >
            {isActive && isStaff
              ? "顧客管理システム"
              : "管理パネルにアクセスする権限がありません"}
          </p>
          <table className="text-left border-separate border-spacing-1">
            <tbody>
              <tr>
                <th>ユーザー名</th>
                <td>{session?.user?.name}</td>
              </tr>
              <tr>
                <th>登録メール</th>
                <td>{session?.user?.email}</td>
              </tr>

              <tr>
                <th className="pr-4">アカウント活性化</th>
                <td>
                  <div
                    className={`badge badge-lg ${
                      isActive ? "badge-success" : "badge-warning"
                    }`}
                  >
                    {boolToString(isActive)}
                  </div>
                </td>
              </tr>
              <tr>
                <th>スタッフ権限</th>
                <td>
                  <div
                    className={`badge badge-lg ${
                      isStaff ? "badge-success" : "badge-error"
                    }`}
                  >
                    {boolToString(isStaff)}
                  </div>
                </td>
              </tr>
            </tbody>
          </table>

          <div className="mt-4 btn-group">
            <button
              className="btn btn-primary"
              onClick={() => handleLink("/")}
              type="button"
            >
              メインに移動
            </button>
            {isActive && isStaff ? (
              <button
                className="btn btn-primary"
                onClick={() => handleLink("/admin/dashboard")}
                type="button"
              >
                ダッシュボード
              </button>
            ) : (
              <button className="m-0 btn btn-primary">メール送信</button>
            )}
            <button
              className="btn btn-primary"
              onClick={handleLogOut}
              type="button"
            >
              ログアウト
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);
  if (!session?.user) {
    return {
      redirect: {
        destination: "/api/auth/signIn",
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
