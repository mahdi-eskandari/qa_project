'use client'

import {
  Alert,
  AlertTitle,
  Box,
  Button,
  CircularProgress,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'

export default function LoginForm() {
  const router = useRouter()

  const [status, setStatus] = useState({
    type: '', // 'success' | 'error'
    message: '',
  })

  const [loading, setLoading] = useState(false)
  const [sendLoading, setSendLoading] = useState(false)
  const [needsVerification, setNeedsVerification] = useState(false)
  const [lastSubmittedEmail, setLastSubmittedEmail] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: 'onTouched',
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const onSubmit = async (formData) => {
    setStatus({ type: '', message: '' })
    setLoading(true)
    setLastSubmittedEmail(formData.email.trim().toLowerCase())

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email.trim().toLowerCase(),
          password: formData.password,
        }),
      })

      const result = await res.json()

      if (!res.ok) {
        setStatus({
          type: 'error',
          message: result.error || result.message || 'Invalid email or password.',
        })

        if (result.code === 'EMAIL_NOT_VERIFIED' || result.error?.toLowerCase().includes('verify')) {
          setNeedsVerification(true)
        } else {
          setNeedsVerification(false)
        }
        return
      }

      setNeedsVerification(false)
      setStatus({
        type: 'success',
        message: result.message || 'Login successful. Redirecting...',
      })

        router.replace('/')
    } catch (error) {
      console.error('LOGIN ERROR:', error)
      setStatus({
        type: 'error',
        message: 'Unable to connect to the server. Please try again later.',
      })
    } finally {
      setLoading(false)
    }
  }

  const handleResendVerification = async () => {
    if (!lastSubmittedEmail) {
      setStatus({
        type: 'error',
        message: 'Please enter your email address first.',
      })
      return
    }

    try {
      setSendLoading(true)
      setStatus({ type: '', message: '' })

      const res = await fetch('/api/auth/resend-verification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: lastSubmittedEmail }),
      })

      const result = await res.json()

      if (!res.ok) {
        setStatus({
          type: 'error',
          message: result.error || 'Could not resend verification email.',
        })
        return
      }

      setStatus({
        type: 'success',
        message:
          result.message ||
          'Verification email sent successfully. Please check your inbox.',
      })
    } catch (error) {
      console.error('RESEND ERROR:', error)
      setStatus({
        type: 'error',
        message: 'Something went wrong while sending the email.',
      })
    } finally {
      setSendLoading(false)
    }
  }

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      sx={{
        width: "45%",
        mx: 'auto',
      }}
    >
      <Stack spacing={2.5}>
        {status.message && (
  <Typography
    role="alert"
    sx={{
      width: "100%",
      px: 2,
      py: 1.5,
      borderRadius: "8px",
      textAlign: "center",
      fontSize: "14px",
      lineHeight: 1.8,
      fontWeight: 500,
      color:
        status.type === "success"
          ? "#292c2b"
          : "#292c2b",
      backgroundColor:
        status.type === "success"
          ? "#62cb91"
          : "#d46a6a",
      border: "1px solid",
      borderColor:
        status.type === "success"
          ? "#62cb91"
          : "#d46a6a",
    }}
  >
    {status.message}
  </Typography>
)}

        <TextField
          fullWidth
          label="Email"
          placeholder="Enter your email"
          type="email"
          autoComplete="email"
          error={Boolean(errors.email)}
          helperText={errors.email?.message}
          {...register('email', {
            required: 'Email is required',
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: 'Please enter a valid email address',
            },
          })}
        />

        <TextField
          fullWidth
          label="Password"
          placeholder="Enter your password"
          type="password"
          autoComplete="current-password"
          error={Boolean(errors.password)}
          helperText={errors.password?.message}
          {...register('password', {
            required: 'Password is required',
            minLength: {
              value: 6,
              message: 'Password must be at least 6 characters',
            },
          })}
        />

        <Button
          type="submit"
          variant="contained"
          fullWidth
          disabled={loading}
          sx={{
            minHeight: 48,
            textTransform: 'none',
            fontSize: '1rem',
            fontWeight: 600,
          }}
        >
          {loading ? (
            <Stack direction="row" spacing={1} alignItems="center">
              <CircularProgress size={22} color="inherit" />
              <span>Logging in...</span>
            </Stack>
          ) : (
            'Login'
          )}
        </Button>

        {needsVerification && (
          <Button
            variant="outlined"
            color="warning"
            fullWidth
            onClick={handleResendVerification}
            disabled={sendLoading}
            sx={{
              textTransform: 'none',
              fontWeight: 500,
            }}
          >
            {sendLoading ? (
              <Stack direction="row" spacing={1} alignItems="center">
                <CircularProgress size={20} color="inherit" />
                <span>Sending email...</span>
              </Stack>
            ) : (
              'Resend Verification Email'
            )}
          </Button>
        )}

        <Box sx={{ textAlign: 'center' }}>
                     <Link
                sx={{
                   fontSize: '12px',
              color: '#da6666',
              textDecoration: 'none',
              '&:hover': {
                color: 'primary.main',
              },
                }}

                                style={{fontSize: "14px",
                    color: "gray"
                }}
                href="/register"
                
            > Don't have an account? Sign up
            </Link>
        </Box>
      </Stack>
    </Box>
  )
}
