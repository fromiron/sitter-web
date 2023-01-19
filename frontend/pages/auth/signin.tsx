import { getSession, signIn } from "next-auth/react";
import { GetServerSideProps } from "next/types";

export default function SignIn() {
  const CALLBACK_URL = "/admin/dashboard";
  const login = async (e: any) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;
    await signIn("credential", {
      email,
      password,
      callbackUrl: CALLBACK_URL,
    });
  };
  const handleGoogleLogin = async () => {
    await signIn("google", {
      callbackUrl: CALLBACK_URL,
    });
  };
  return (
    // <div className="min-h-screen hero bg-base-100">
    //   <div className="flex-col hero-content lg:flex-row-reverse">
    //     <div className="text-center lg:text-left">
    //       <h1 className="text-5xl font-bold">管理パネル</h1>
    //       <p className="py-6">login page!</p>
    //     </div>
    //     <div className="flex-shrink-0 w-full max-w-sm shadow-2xl card bg-base-100">
    //       <form className="card-body" onSubmit={login}>
    //         <div className="form-control">
    //           <label className="label">
    //             <span className="label-text">Email</span>
    //           </label>
    //           <input
    //             name="email"
    //             type="email"
    //             placeholder="email"
    //             className="input input-bordered"
    //           />
    //         </div>
    //         <div className="form-control">
    //           <label className="label">
    //             <span className="label-text">Password</span>
    //           </label>
    //           <input
    //             name="password"
    //             type="text"
    //             placeholder="password"
    //             className="input input-bordered"
    //           />
    //           <label className="label">
    //             <a href="#" className="label-text-alt link link-hover">
    //               Forgot password?
    //             </a>
    //           </label>
    //         </div>
    //         <div className="mt-6 form-control">
    //           <button type="submit" className="btn btn-primary">
    //             Login
    //           </button>
    //         </div>
    //       </form>
    //     </div>
    //     <button
    //       type="button"
    //       className="btn btn-secondary"
    //       onClick={handleGoogleLogin}
    //     >
    //       google
    //     </button>
    //   </div>
    // </div>
 <div className="min-h-screen hero bg-base-100">
        <div>


        </div>
        
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);

  //    TODO session ユーザーデータでログインを判断しリダイレクト（ページも作成必要）
  return {
    props: {},
  };
};
