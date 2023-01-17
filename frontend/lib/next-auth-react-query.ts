import { useQuery } from "react-query";
import { useRouter } from "next/router";

export async function fetchSession() {
  const res = await fetch("/api/auth/session");
  const session = await res.json();
  if (Object.keys(session).length) {
    return session;
  }
  return null;
}

export async function useSession({
  required = true,
  redirectTo = "/api/auth/signin?error=SessionExpired",
  queryConfig = {},
}: {
  required: boolean;
  redirectTo: string;
  queryConfig: {
    onSettled?: any;
    staleTime?: number;
    refetchInterval?: number;
  };
}) {
  const router = useRouter();
  const query = useQuery(["session"], fetchSession, {
    ...queryConfig,
    onSettled(data, error) {
      if (queryConfig.onSettled) queryConfig.onSettled(data, error);
      if (data || !required) return;
      router.push(redirectTo);
    },
  });
  return [query.data, query.status === "loading"];
}
