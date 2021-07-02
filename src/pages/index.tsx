import React, { useState } from "react";
import { useSelector } from "react-redux";

import { Layout } from '../components/Layout'
import { RootState } from "../store/store";


export default function Home() {
    const { isAuthenticated, username, email } = useSelector((store: RootState) => store.auth)

    return (
        <Layout>
            {username && <p>Username is: {username}</p>}
            {email && <p>Email is: {email}</p>}
        </Layout>
    )
}
