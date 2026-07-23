"use client"
import React from 'react'
import { CircularProgress } from '@mui/material';

export default function loading() {
  return (
    <div>
      <CircularProgress size={20} color="inherit" />
    </div>
  )
}
