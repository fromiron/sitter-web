import { getSession, signIn } from "next-auth/react";
import { GetServerSideProps } from "next/types";
import { useForm } from "react-hook-form";

import { FaLock, FaEnvelope, FaSignInAlt } from "react-icons/fa";

import LogoVertical from "@images/logo_vertical.svg";
import LogoGoogle from "@images/logo_google.svg";
import { TextInput } from "@components/inputs";
import { FieldValues, SubmitHandler } from "react-hook-form/dist/types";
import Link from "next/link";

interface LoginValuesInterface extends FieldValues {
  email: string;
  password: string;
}

export default function SignIn() {
  const CALLBACK_URL = "/admin/dashboard";

  const handleGoogleLogin = async () => {
    await signIn("google", {
      callbackUrl: CALLBACK_URL,
    });
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginValuesInterface>();
  const onSubmit: SubmitHandler<LoginValuesInterface> = async (
    data: LoginValuesInterface
  ) => {
    await signIn("credential", {
      email: data.email,
      password: data.password,
      callbackUrl: CALLBACK_URL,
    });
  };
  return (
    <div className="min-h-screen hero bg-base-100">
      <div className="flex p-10 bg-white shadow-xl rounded-2xl">
        <div className="min-w-[200px] h-auto px-10">
          <LogoVertical />
        </div>
        <div className="divider divider-horizontal before:bg-base-100 after:bg-base-100" />
        <div className="flex flex-col justify-center px-10">
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col">
            <TextInput
              label="Mail"
              placeholder="admin@example.com"
              Icon={FaEnvelope}
              register={register("email", {
                required: "メールアドレスを入力してください。",
                pattern: {
                  value:
                    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                  message: "正しいメールを入力してください。",
                },
              })}
              errorMsg={errors.mail?.message}
            />
            <TextInput
              label="Password"
              placeholder="●●●●●●●●"
              type="password"
              Icon={FaLock}
              register={register("password", {
                required: "パスワードを入力してください。",
                minLength: {
                  value: 8,
                  message: "8桁以上のパスワードを入力してください。",
                },
              })}
              errorMsg={errors.password?.message}
            />

            <button type="submit" className="mt-4 btn btn-primary">
              <FaSignInAlt className="mr-2 text-2xl" />
              SIGN IN
            </button>
            <button
              type="button"
              className="mt-4 btn btn-outline border-base-300"
              onClick={handleGoogleLogin}
            >
              <LogoGoogle className="mr-2" />
              Google
            </button>
          </form>
          <div className="mt-4 ml-2 text-xs">
            ※管理アカウント登録は
            <Link href={"/"} className={"underline text-primary font-bold"}>
              こちら
            </Link>
            です。
          </div>
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
