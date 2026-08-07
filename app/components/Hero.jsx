"use client";

import { Box, Button, Container, Stack, Typography } from "@mui/material";
import Link from "next/link";
import Image from "next/image";

const styles = {
  root: {
    padding: { xs: "2rem", md: "4rem" },
    bgcolor: "red",
  },
};

export default function Hero() {
  return (
    <Container component="section" maxWidth={false} sx={{ maxWidth: "90%" }}>
      <Stack
        gap="4rem"
        direction={{ xs: "column", md: "row" }}
        justifyContent="space-between"
        alignItems="center"
        sx={styles.root}
      >
        <Box
          sx={{
            order: { xs: 2, md: 1 },
            maxWidth: "40rem",
            textAlign: { xs: "center", md: "left" },
          }}
        >
          <Typography gutterBottom variant="h6" letterSpacing="5px">
            Find your Answers
          </Typography>
          <Typography component="h1" variant="h3" gutterBottom fontWeight="bold">
            Questions and Answers
          </Typography>
          <Typography gutterBottom marginBottom="2rem" variant="subtitle1">
            Looking for answers? You've come to the right place! Our community is here to help with reliable, insightful answers to all your questions.
            Whether you're here to learn, share your expertise, or just browse, we’re excited to have you.
          </Typography>
          <Link href="/questions">
            <Button variant="contained">Go to Questions</Button>
          </Link>
        </Box>

    <Box
  sx={{
    width: "400px",
    flexShrink: 0,
    display: "flex",
    justifyContent: "center",
  }}
>
  <Image
    src="/qa.jpg"
    width={400}
    height={270}
    alt="qa"
    style={{
      width: "400px",
      height: "auto",
      display: "block",
    }}
  />
</Box>

      </Stack>
    </Container>
  );
}
