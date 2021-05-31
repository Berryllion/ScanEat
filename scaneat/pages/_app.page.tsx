import { useEffect, useState } from 'react';
import { Provider, useDispatch, useSelector } from 'react-redux';
import Head from "next/head";
import { useRouter } from 'next/router';
import type { AppProps } from 'next/app'
import { ThemeProvider } from 'styled-components';

import { defaultTheme } from '../modules/theme'
import '../style/style.css';
import { ReduxState, useStore } from '../logic';
import { getMe } from '../logic/api';
import { SET_ON_SITE, SET_TABLE } from '../logic/actions/general';
import { UserType } from '../logic/types';

enum Loading {
  NOT_LOADED = 0,
  ME_LOADED = 1,
  LOADED = 2,
  ALL_LOADED = 3,
}

function Loader({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const dispatch = useDispatch();
  const ws = useSelector((state: ReduxState) => state.ws);
  const me = useSelector((state: ReduxState) => state.me);
  const [loaded, setLoaded] = useState(Loading.NOT_LOADED);

  const load = async () => {
    if (localStorage.getItem("token")) {
      const res = await getMe(dispatch, ws);
      if (res.success === true) {
        if (res.data.type !== UserType.PRO && router.asPath.startsWith('/manage')) {
          router.push('/');
        } else if (res.data.type === UserType.PRO && !router.asPath.startsWith('/manage')) {
          router.push('/manage');
        }
        setLoaded(Loading.ME_LOADED);
        return;
      }
    }
    localStorage.removeItem("token");
    if (router.asPath.startsWith('/manage'))
      router.push('/');
    setLoaded(Loading.LOADED);
  }
  const loadAssets = async () => {
    setLoaded(Loading.ALL_LOADED)
  }

  useEffect(() => {
    const onsite = (router.query.onsite as string) || sessionStorage.getItem('onsite');
    const table = (router.query.table as string) || sessionStorage.getItem('table');

    if (onsite !== null && table !== null && router.asPath.startsWith('/restaurant')) {
      dispatch({
        type: SET_ON_SITE,
        payload: true,
      });
      dispatch({
        type: SET_TABLE,
        payload: Number(table)
      });
    } else {
      dispatch({
        type: SET_ON_SITE,
        payload: false,
      });
      dispatch({
        type: SET_TABLE,
        payload: null,
      });
    }
  }, [router]);
  useEffect(() => {
    load();
    return () => {
      if (ws)
        ws.close();
    }
  }, []);

  useEffect(() => {
    if (loaded <= Loading.LOADED && me/* && ws*/)
      loadAssets();
  }, [loaded, ws, me]);

  return (
    <>
      {loaded >= Loading.LOADED && (
        <Component {...pageProps}/>
      )}
    </>
  )
}

function MyApp({ Component, pageProps }: AppProps) {
  const store = useStore(pageProps.initialReduxState);

  return (
    <>
      <Head>
        <link
          rel="preload"
          href="/fonts/SEGOEUI.TTF"
          as="font"
          crossOrigin=""
        />
        <link
          rel="preload"
          href="/fonts/SEGOEUISB.TTF"
          as="font"
          crossOrigin=""
        />
        <link
          rel="preload"
          href="/fonts/SEGOEUIB.TTF"
          as="font"
          crossOrigin=""
        />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link href="https://fonts.googleapis.com/css2?family=Fredoka+One&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Montserrat&display=swap" rel="stylesheet" />
        <title>ScanEat</title>
      </Head>
      <ThemeProvider theme={defaultTheme}>
        <Provider store={store}>
          <Loader Component={Component} {...pageProps} />
        </Provider>
      </ThemeProvider>
    </>
  )
}

export default MyApp
