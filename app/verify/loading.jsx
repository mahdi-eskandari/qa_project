"use client"
import React from 'react'
import { CircularProgress, Box } from '@mui/material';

export default function loading() {
  return (
   <Box
  sx={{
    width: "100%",
    height: "100%",
        position: "fixed",
        inset: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        backgroundColor: "background.default",
      }}
>
  <CircularProgress size={60} thickness={4} color="primary" />
</Box>
  )
}
