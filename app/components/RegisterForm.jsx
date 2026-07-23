'use client'

import { Box, Button, TextField, CircularProgress } from '@mui/material'
import Link from 'next/link'
import React from 'react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/navigation'

export default function RegisterForm() {
    const [formData, setFormData] = useState(null)
    const router = useRouter()
    const [loading, setLoading] = useState(false)


    const helperText = {
        username: {
            // default: "Enter your full name",
            required: "Name is required",
            minLength: "Name must be at least 3 characters",
            maxLength: "Name must be less than 30 characters",
        },
        email: {
            required: 'Email is required',
            pattern: 'Please enter a valid email address',
            // default: 'Enter your registered email address',
        },
        password: {
            required: 'Password is required',
            minLength: 'Password must be at least 6 characters',
            maxLength: 'Password must be at most 30 characters',
            // default: 'Enter your account password',
        },
    }

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset
    } = useForm()

    const onSubmit = async (data) => {
        setFormData(data)

        setLoading(true);


        try {
            const res = await fetch("/api/auth/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });

            const result = await res.json();

            if (res.ok) {
                router.push("/login")
                reset();
            } else {
                alert(result.error);
            }

        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
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
                label="UserName"
                variant="outlined"
                fullWidth
                error={!!errors.username}
                helperText={
                    errors.username
                        ? helperText.username?.[errors.username.type]
                        : helperText.username.default
                }
                {...register("username", {
                    required: true,
                    minLength: 3,
                    maxLength: 30,
                })}
                sx={{
                    "& .MuiOutlinedInput-root": {
                        borderRadius: "6px",
                        backgroundColor: "#f5f5f5",
                    },
                }}
            />


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
                type="submit"
            >
                {loading ? (
                    <CircularProgress size={24} color="inherit" />
                ) : (
                    "REGISTER"
                )}
            </Button>

            <Link
                style={{
                    fontSize: "14px",
                    textAlign: "center"
                }}
                href="/login"
            > Already have an account? Log in</Link>

        </Box>

    )
}
