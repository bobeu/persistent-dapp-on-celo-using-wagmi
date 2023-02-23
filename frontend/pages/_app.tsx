import '../styles/globals.css'
import React from 'react';
import NextHead from 'next/head'
import type { AppProps } from 'next/app';
import { client } from '../wagmi'
import { ConnectKitProvider } from 'connectkit';
import { WagmiConfig } from 'wagmi'

export default function App({ Component, pageProps }: AppProps) {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => setMounted(true), []);

  return (
    <WagmiConfig client={client}>
      <ConnectKitProvider>
        <NextHead>
          <title>SwapLab</title>
        </NextHead>
          {
            mounted &&
              <Component 
                {...pageProps} 
              />
        }
      </ConnectKitProvider>
    </WagmiConfig>
  );
}

