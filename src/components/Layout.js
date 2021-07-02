import React from "react";
import Head from "next/head";

import { Header } from "./Header";
import { MainContent } from "./MainContent";
import { Footer } from "./Footer";

export const Layout = props => {
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
    </>
  )
}
