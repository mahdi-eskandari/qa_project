'use client'
import { Box, Button, Typography } from '@mui/material'
import React from 'react'
import Link from 'next/link';
import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

export default function page() {
    const params = useSearchParams()
    const token = params.get("token")

    useEffect(() => {
        async function verify() {

            const res = await fetch("/api/auth/verify", {
                method: "POST",
                headers: {
                    "content-type": "application/json"
                },
                body: JSON.stringify({ token })
            })

            const data = await res.json()
            console.log(data)


        }

        if (token) {
            verify()
        }

    }, [token])

    return (
        <Box sx={{
            py: 5,
            display: 'flex',
            justifyContent: "center",
            alignItems: "center",
        }}>
            <Box
                sx={{
                    maxWidth: "500px",
                    display: 'flex',
                    justifyContent: "center",
                    alignItems: "center",
                    flexDirection: "column",
                    gap: 4,
                }}
            >
                <Typography
                    variant='h2'
                    sx={{ letterSpacing: '3px' }}
                >
                    you verified
                </Typography>
                <Button
                    variant='filled'
                    fullWidth
                    sx={{
                        // backgroundColor: "blue",
                        borderRadius: "10px",
                        textTransform: "none",
                        py: "10px",
                        backgroundColor: "#6d737a",

                    }}
                    type="submit"
                >
                    <Link
                        style={{
                            fontSize: "14px",
                            textAlign: "center",
                            fontSize: "17px"
                        }}
                        href="/login"
                    > back to main page
                    </Link>
                </Button>

            </Box>
        </Box>
    )
}
