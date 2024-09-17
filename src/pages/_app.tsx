import { ChakraProvider } from "@chakra-ui/react";
import "@/styles/globals.css";

import { ReactElement } from "react";

interface AppProps {
  Component: React.ElementType;
  pageProps: any;
}

export default function App({ Component, pageProps }: AppProps): ReactElement {
  return (
    <ChakraProvider>
      <Component {...pageProps} />
    </ChakraProvider>
  );
}