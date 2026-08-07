"use client";

import { Box, Button, Container, Stack, Typography } from "@mui/material";
import Link from "next/link";
import Image from "next/image";

const styles = {
  root: {
    padding: { xs: "2rem", md: "3rem" },
    mb: 2
  },
};

export default function Hero() {
  return (
    <Container component="section" maxWidth={false} sx={{ maxWidth: "90%" }}>
      <Stack
        gap="2rem"
        justifyContent="space-between"
        alignItems="center"
        sx={{
          ...styles.root,
          flexDirection: "row",
          "@media (max-width: 1097px)": {
            flexDirection: "column",
          },
        }}
      >
        {/* بخش متن */}
        <Box
          sx={{
            "@media (max-width: 1097px)": {
              order: 2,
              textAlign: "center",
            },
            maxWidth: "40rem",
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
            height: "270px",
            flexShrink: 0, // مانع از مچاله شدن یا کوچک شدن عکس می‌شود
            display: "flex",
            justifyContent: "center",
            // در صفحات کوچک‌تر از 1097px ترتیب اول (بالا) قرار بگیرد
            "@media (max-width: 1097px)": {
              order: 1,
              width: "100%",
              maxWidth: "400px",
            },
          }}
        >
          <Image
            src="/qa.jpg"
            width={400}
            height={270}
            alt="qa"
            style={{
              width: "100%",
              height: "auto",
              objectFit: "cover",
            }}
          />
        </Box>
      </Stack>
    </Container>
  );
}
