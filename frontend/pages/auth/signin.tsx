import { getSession, signIn } from "next-auth/react";
import { GetServerSideProps } from "next/types";
import { useForm } from "react-hook-form";

import LogoVertical from "@images/logo_vertical.svg";
import LogoGoogle from "@images/logo_google.svg";
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

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();
  const onSubmit = (data: any) => console.log(data);

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
      <div className="flex p-10 bg-white shadow-xl rounded-2xl">
        <div className="min-w-[200px] h-auto px-10">
          <LogoVertical />
        </div>
        <div className="divider divider-horizontal before:bg-base-100 after:bg-base-100" />
        <div className="flex flex-col justify-center px-10">
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col">
            <div className="w-full max-w-xs form-control">
              <label className="label">
                <span className="label-text">■ Mail</span>
              </label>
              <input
                type="text"
                placeholder="user@example.com"
                className="w-full max-w-xs border-2 input focus:border-primary"
              />
            </div>

            <div className="w-full max-w-xs form-control">
              <label className="label">
                <span className="label-text">✿ Password</span>
              </label>
              <input
                type="text"
                placeholder="*******"
                className="w-full max-w-xs border-2 input focus:border-primary"
              />
            </div>

            <button type="submit" className="mt-4 btn btn-primary">
              SIGN IN
            </button>
            <button
              type="button"
              className="mt-4 btn btn-outline border-base-300"
            >
              <LogoGoogle className="mr-2" /> Google
            </button>
          </form>
        </div>
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
