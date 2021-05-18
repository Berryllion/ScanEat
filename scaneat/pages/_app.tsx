import type { AppProps /*, AppContext */ } from 'next/app'
import { ThemeProvider } from 'styled-components';
import Head from "next/head";

import { defaultTheme } from '../modules/theme'
import '../style/style.css';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <link
          rel="preload"
          href="fonts/SEGOEUI.TTF"
          as="font"
          crossOrigin=""
        />
        <link
          rel="preload"
          href="fonts/SEGOEUISB.TTF"
          as="font"
          crossOrigin=""
        />
        <link
          rel="preload"
          href="fonts/SEGOEUIB.TTF"
          as="font"
          crossOrigin=""
        />
        <title>ScanEat</title>
      </Head>
      <ThemeProvider theme={defaultTheme}>
        <Component {...pageProps} />
      </ThemeProvider>
    </>
  )
}

export default MyApp
