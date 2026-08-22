"use client"
import React from 'react'
import { usePathname } from 'next/navigation'

export default function MtChilden({children}) {
    const path = usePathname()

    if(path === "/register" || path === "/login" || path === "forgot-password") {

        return <div style={{marginTop: "70px"}}>
            {children}
        </div>
    }
    else {
        return children
    }

}
