import { AxiosError } from "axios";
import { QueryClient } from "react-query";
import { toast } from "react-toastify";

function queryErrorHandler(error: unknown): void {
  const axiosError = error as AxiosError;
  const id = "react-query-error";
  const title =
    error instanceof Error
      ? // remove the initial 'Error: ' that accompanies many errors
        error.toString().replace(/^Error:\s*/, "")
      : "error connecting to server";

  if (axiosError.response?.status === 401) {
    toast.error("再ログインしてください");
    setTimeout(
      () => (window.location.href = `${window.location.origin}/auth/signin`),
      3000
    );
  } else {
    toast.error(title);
  }
}

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      onError: queryErrorHandler,
      staleTime: 600000, // 10 minutes
      cacheTime: 900000, // 15 minutes
      refetchOnMount: true,
      refetchOnReconnect: true,
      refetchOnWindowFocus: true,
      keepPreviousData: true,
    },
  },
});
