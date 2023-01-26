import { QueryClient } from "react-query";
import { toast } from "react-toastify";

function queryErrorHandler(error: unknown): void {
  const id = "react-query-error";
  const title =
    error instanceof Error
      ? // remove the initial 'Error: ' that accompanies many errors
        error.toString().replace(/^Error:\s*/, "")
      : "error connecting to server";
  toast.error(title);
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
    },
  },
});
