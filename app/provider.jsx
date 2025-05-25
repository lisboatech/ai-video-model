"use client";

import { ConvexProvider, ConvexReactClient } from "convex/react";
import React from 'react'
import { SessionProvider } from '../components/session/SessionProvider'

function Provider({ children }) {
    const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL);

    return (
        <ConvexProvider client={convex}>
            <SessionProvider>
                <div>{children}</div>
            </SessionProvider>
        </ConvexProvider>
    )
}

export default Provider