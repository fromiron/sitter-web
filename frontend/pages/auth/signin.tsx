import { getSession, signIn, useSession } from "next-auth/react";
import { GetServerSideProps } from "next/types";
import { useForm } from "react-hook-form";
import { getCsrfToken } from "next-auth/react";
import { FaLock, FaEnvelope, FaSignInAlt } from "react-icons/fa";

import LogoVertical from "@images/logo_vertical.svg";
import LogoGoogle from "@images/logo_google.svg";
import { TextInput } from "@components/inputs";
import { SubmitHandler } from "react-hook-form/dist/types";
import Link from "next/link";
import { LoginFormInterface } from "@interfaces/cmsInterfaces";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import { useState } from "react";

export default function SignIn({
  csrfToken,
}: {
  csrfToken: string | undefined;
}) {
  const [signInDisabled, setSignInDisabled] = useState<boolean>(false);

  const router = useRouter();
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
  } = useForm<LoginFormInterface>();
  const onSubmit: SubmitHandler<LoginFormInterface> = async (
    data: LoginFormInterface
  ) => {
    setSignInDisabled(true);
    const res = await signIn("credential", {
      email: data.email,
      password: data.password,
      redirect: false,
    });
    if (res?.status !== 200) {
      toast.error(res?.error);
    }
    if (res?.ok === true) {
      router.push("/admin/dashboard");
    }
    setTimeout(() => setSignInDisabled(false), 1000);
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
            <input name="csrfToken" type="hidden" defaultValue={csrfToken} />
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
              errorMsg={errors.email?.message}
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

            <button
              type="submit"
              className="mt-4 btn btn-primary"
              disabled={signInDisabled}
            >
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

  if (session?.user?.is_active && session.user?.is_staff) {
    return {
      redirect: {
        permanent: false,
        destination: "/admin/dashboard",
      },
    };
  }

  if (session?.user?.is_active && !session.user?.is_staff) {
    return {
      redirect: {
        permanent: false,
        destination: "/admin/me",
      },
    };
  }

  return {
    props: {
      csrfToken: await getCsrfToken(context),
    },
  };
};
