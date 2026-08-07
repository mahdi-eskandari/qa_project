"use client";

import { Box, Button, Typography } from "@mui/material";
import Link from "next/link";

export default function NotFound() {
  return (
    <Box
      sx={{
        minHeight: "70vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        gap: 2,
        px: 2,
      }}
    >
      <Typography variant="h3" fontWeight="bold">
        404
      </Typography>

      <Typography variant="h5">
        Page not found
      </Typography>

      <Typography variant="body1" color="text.secondary">
        The page you are looking for does not exist.
      </Typography>

      <Button component={Link} href="/" variant="contained" sx={{ mt: 2 }}>
        Back to Home
      </Button>
    </Box>
  );
}
