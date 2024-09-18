import { ChakraProvider } from "@chakra-ui/react";
import "@/styles/globals.css";

import { ReactElement } from "react";

interface AppProps {
  Component: React.ElementType;
  pageProps: Record<string, unknown>;
}

export default function App({ Component, pageProps }: AppProps): ReactElement {
  return (
    <ChakraProvider>
      <Component {...pageProps} />
    </ChakraProvider>
  );
}