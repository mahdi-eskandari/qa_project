'use client'

import { Box, Button, CircularProgress, TextField } from '@mui/material'
import Link from 'next/link'
import React from 'react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useRouter } from "next/navigation"

export default function LoginForm() {
    const [formData, setFormData] = useState(null)
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [sendLoading, setSendLoading] = useState(false)
    const [needsVerification, setNeedsVerification] = useState(false);
    const [email, setEmail] = useState("");
  const [isResending, setIsResending] = useState(false);

    const helperText = {
        email: {
            required: 'Email is required',
            pattern: 'Please enter a valid email address',
            default: 'Enter your registered email address',
        },
        password: {
            required: 'Password is required',
            minLength: 'Password must be at least 6 characters',
            maxLength: 'Password must be at most 30 characters',
            default: 'Enter your account password',
        },
    }

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset
    } = useForm()

    const onSubmit = async (data) => {
        try {
            setFormData(data)
            setLoading(true)

            const res = await fetch("/api/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data)

            })

            const result = await res.json();

            if (!res.ok) {
                //  setMessage(data.error);
                 alert(result.error);
                // reset()
                  if (result.code === "EMAIL_NOT_VERIFIED") {
                    setNeedsVerification(true);
                    }
                  else {
                    setNeedsVerification(false);
                    }
                    return
            }

            setNeedsVerification(false);
            router.replace("/")
            



        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false)
        }




    }



    const handleResendVerification = async () => {
try {
    setSendLoading(true)
    const resendEmail = formData?.email
    console.log(resendEmail)
    if(!resendEmail) {
    alert("Please enter your email first.");
    return
    }

    const res = await fetch("/api/auth/resend-verification", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({email: resendEmail})
    })
    const result = await res.json()
    if(!res.ok) {
        alert(result.error || "Could not resend verification email");
        return
    }
    alert(result.message || "Verification email sent successfully");



} catch (error) {
        console.log("Resend error:", error);
    alert("Something went wrong");
} finally {
    setSendLoading(false)
}
    }



    return (
        <Box
            component="form"
            onSubmit={handleSubmit(onSubmit)}
            sx={{
                width: "45%",
                mx: "auto",
                // mt: 12,
                display: "flex",
                flexDirection: "column",
                gap: 3

            }}
        >

            <TextField
                label="Email"
                variant="outlined"
                fullWidth
                error={!!errors.email}
                helperText={
                    errors.email
                        ? helperText.email[errors.email.type]
                        : helperText.email.default
                }
                {...register('email', {
                    required: true,
                    minLength: 10,
                    maxLength: 50,
                    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                })}

                sx={{
                    '& .MuiOutlinedInput-root': {
                        borderRadius: '6px',
                        backgroundColor: '#f5f5f5',
                    },
                }}
            />

            <TextField
                label="Password"
                variant="outlined"
                fullWidth
                error={!!errors.password}
                helperText={
                    errors.password
                        ? helperText.password[errors.password.type]
                        : helperText.password.default
                }
                {...register('password', {
                    required: true,
                    minLength: 10,
                    maxLength: 50,
                    pattern: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{6,}$/,
                })}

                // multiline
                // rows={4}
                sx={{
                    '& .MuiOutlinedInput-root': {
                        borderRadius: '6px',
                        backgroundColor: '#f5f5f5',
                    },
                }}
            />

            <Button
                variant='filled'
                disabled={loading}
                fullWidth
                sx={{
                    backgroundColor: "blue",
                    borderRadius: "10px",
                    textTransform: "none",
                    py: "12px",
                    backgroundColor: "#64a8f5"
                }}
                type='submit'
            >
                {
                    loading ? (
                        <CircularProgress size={24} color="inherit" />
                    ) : (
                        "LOGIN"
                    )
                }
            </Button>

            <Box sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: 5
            }}>

            {needsVerification && (
             <Button variant="outlined" color="black" onClick={handleResendVerification} disabled={sendLoading}>
             {
                sendLoading ? (
                    <CircularProgress size={24} color="inherit" />
                ) : (
                    "Resend verification email"
                )
             }
             </Button>
            )}

            <Link
                sx={{
                    fontSize: "14px",
                    textAlign: "center",
                    color: "black"
                }}
                href="/register"
                
            > Don't have an account? Sign up
            </Link>
            </Box>

        </Box>

    )
}
