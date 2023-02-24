import "../styles/globals.css";
import type { AppProps } from "next/app";
import { SessionProvider } from "next-auth/react";
import Head from "next/head";
import { QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
import { Slide, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ThemeProvider } from "next-themes";
import { WideModeProvider } from "context/WideModeContext";
import { queryClient } from "@lib/react-query-client";
import { ModalProvider } from "context/ModalContext";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <SessionProvider
      session={pageProps.session}
      refetchInterval={5 * 60}
      refetchOnWindowFocus={true}
    >
      <QueryClientProvider client={queryClient}>
        <Head>
          <meta
            name="viewport"
            content="initial-scale=1.0, width=device-width"
          />
        </Head>
        <ThemeProvider>
          <WideModeProvider>
            <ModalProvider>
              <ToastContainer
                position="top-center"
                autoClose={1000}
                transition={Slide}
                hideProgressBar
              />
              <Component {...pageProps} />
            </ModalProvider>
          </WideModeProvider>
        </ThemeProvider>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </SessionProvider>
  );
}
