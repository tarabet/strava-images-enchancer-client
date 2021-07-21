import React, { PropsWithChildren } from "react";
import Head from "next/head";

import { Header } from "./Header";
import { MainContent } from "./MainContent";
import { Footer } from "./Footer";
import {PopupMapper} from "./PopupMapper";

type ProfileProps = {}

export const Layout = (props: PropsWithChildren<ProfileProps>) => {
  return (
    <>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Twitter aggregation app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
      <MainContent>
        {props.children}
      </MainContent>
      <Footer />
      <PopupMapper />
    </>
  )
}
