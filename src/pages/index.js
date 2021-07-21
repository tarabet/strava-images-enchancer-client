import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useSession } from 'next-auth/client'

import { Layout } from '../components/Layout'

export default function Home() {
    const [session, loading] = useSession()

    return (
        <Layout>

        </Layout>
    )
}
