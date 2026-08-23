"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

import {
  Alert,
  AlertTitle,
  Box,
  Button,
  CircularProgress,
  Stack,
  TextField,
} from "@mui/material";
import Link from "next/link";

export default function RegisterForm() {
  const router = useRouter();

  const [status, setStatus] = useState({
    type: "",
    message: "",
  });

  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: "onTouched",
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = async (formData) => {
    setStatus({
      type: "",
      message: "",
    });

    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: formData.username.trim(),
          email: formData.email.trim().toLowerCase(),
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setStatus({
          type: "error",
          message:
            data.error ||
            data.message ||
            "Registration failed. Please try again.",
        });

        return;
      }

      setStatus({
        type: "success",
        message:
          data.message ||
          "Registration successful. You can now log in to your account.",
      });

      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } catch (error) {
      console.error("REGISTER ERROR:", error);

      setStatus({
        type: "error",
        message:
          "Unable to connect to the server. Please try again later.",
      });
    } finally {
      setIsLoading(false);
    }
  };

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
      <Stack spacing={2.5}>
        {status.message && (
          <Alert
            severity={status.type === "success" ? "success" : "error"}
            variant="standard"
          >
            <AlertTitle>
              {status.type === "success" ? "Success" : "Registration Error"}
            </AlertTitle>

            {status.message}
          </Alert>
        )}

        <TextField
          fullWidth
          label="Username"
          placeholder="Enter your username"
          type="text"
          autoComplete="username"
          error={Boolean(errors.username)}
          helperText={errors.username?.message}
          {...register("username", {
            required: "Username is required",
            minLength: {
              value: 3,
              message: "Username must be at least 3 characters",
            },
            maxLength: {
              value: 30,
              message: "Username must not exceed 30 characters",
            },
            pattern: {
              value: /^[a-zA-Z0-9_]+$/,
              message:
                "Username can only contain letters, numbers, and underscores",
            },
          })}
        />

        <TextField
          fullWidth
          label="Email"
          placeholder="Enter your email"
          type="email"
          autoComplete="email"
          error={Boolean(errors.email)}
          helperText={errors.email?.message}
          {...register("email", {
            required: "Email is required",
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: "Please enter a valid email address",
            },
          })}
        />

        <TextField
          fullWidth
          label="Password"
          placeholder="Enter your password"
          type="password"
          autoComplete="new-password"
          error={Boolean(errors.password)}
          helperText={
            errors.password?.message ||
            "Password must contain at least 6 characters"
          }
          {...register("password", {
            required: "Password is required",
            minLength: {
              value: 6,
              message: "Password must be at least 6 characters",
            },
          })}
        />


   <Box sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                gap: 2
            }}>

            
            
        <Button
          type="submit"
          variant="contained"
          fullWidth
          disabled={isLoading}
          sx={{
            minHeight: 48,
            textTransform: "none",
            fontSize: "1rem",
            fontWeight: 600,
          }}
        >
          {isLoading ? (
            <Stack direction="row" spacing={1} alignItems="center">
              <CircularProgress size={22} color="inherit" />
              <span>Creating account...</span>
            </Stack>
          ) : (
            "Create Account"
          )}
        </Button>
            

            <Link
                sx={{
                   fontSize: '8px',
              textDecoration: 'none',

                }}
                style={{fontSize: "14px",
                    color: "gray"
                }}
                href="/login"
                
            > Don't have an account? Sign up
            </Link>
            </Box>


      </Stack>
    </Box>
  );
}
