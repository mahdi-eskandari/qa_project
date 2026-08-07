"use client";

import {
  Box,
  Button,
  Container,
  Paper,
  Stack,
  Typography,
} from "@mui/material";

export default function Page() {
  const features = [
    {
      title: "Focused Questions",
      description:
        "Users can ask clear and precise questions to reach the right answer faster.",
    },
    {
      title: "Reliable Answers",
      description:
        "We focus on answers that are clear, practical, and grounded in real knowledge or experience.",
    },
    {
      title: "A Growing Community",
      description:
        "Q&A is more than a website. It is a living learning space that becomes better with active participation.",
    },
  ];

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "background.default",
      }}
    >
      <Container maxWidth="lg">
        <Box>
          {/* Hero Section */}
          <Box
            sx={{
              maxWidth: 900,
              mx: "auto",
              textAlign: "center",
              pb: 3
            }}
          >
            <Typography
              variant="overline"
              sx={{
                color: "primary.main",
                fontWeight: 700,
                letterSpacing: 2,
              }}
            >
              ABOUT US
            </Typography>

            <Typography
              variant="h2"
              component="h1"
              sx={{
                mt: 1,
                fontWeight: 800,
                lineHeight: 1.15,
                fontSize: {
                  xs: "2.1rem",
                  sm: "3rem",
                  md: "4rem",
                },
              }}
            >
              A place to ask, learn, and share experience
            </Typography>

            <Typography
              variant="h6"
              sx={{
                mt: 3,
                color: "text.secondary",
                lineHeight: 2,
                fontWeight: 400,
                fontSize: {
                  xs: "1rem",
                  md: "1.1rem",
                },
              }}
            >
              Q&A is a community-driven platform built to help people ask
              questions, receive useful answers, and share what they know with
              others. Our goal is to create a simple, trustworthy, and practical
              space for everyday learning.
            </Typography>
          </Box>

          {/* Mission Section */}
          <Paper
            elevation={0}
            sx={{
              p: { xs: 3, md: 5 },
              border: "1px solid",
              borderColor: "divider",
              borderRadius: 3,
              bgcolor: "background.paper",
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: {
                  xs: "column",
                  md: "row",
                },
                gap: { xs: 4, md: 5 },
                alignItems: "stretch",
              }}
            >
              {/* Mission Text */}
              <Box
                sx={{
                  flex: 1,
                  minWidth: 0,
                }}
              >
                <Typography
                  variant="h4"
                  component="h2"
                  fontWeight={800}
                  mb={2}
                >
                  Our Mission
                </Typography>

                <Typography
                  sx={{
                    color: "text.secondary",
                    lineHeight: 2,
                    fontSize: "1rem",
                  }}
                >
                  We want to make useful, clear, and understandable information
                  easier to access. We believe the best answers do not come from
                  expertise alone, but also from real user experience. That is why
                  we created this space for questions, answers, and shared learning.
                </Typography>
              </Box>

              {/* Why Q&A */}
              <Box
                sx={{
                  flex: 1,
                  minWidth: 0,
                  p: { xs: 3, md: 4 },
                  borderRadius: 3,
                  bgcolor: "primary.main",
                  color: "primary.contrastText",
                }}
              >
                <Typography variant="h5" fontWeight={800} mb={2}>
                  Why Q&A?
                </Typography>

                <Typography
                  sx={{
                    lineHeight: 2,
                    opacity: 0.96,
                  }}
                >
                  Because every question can lead to a new lesson. We built a
                  place where users can find better answers, gain practical
                  insight, and grow together without unnecessary complexity.
                </Typography>
              </Box>
            </Box>
          </Paper>

          {/* Features Section */}
          <Box>
            <Typography
              variant="h4"
              component="h2"
              textAlign="center"
              fontWeight={800}
              mt={6}
              mb={3}
            >
              What Makes Us Different
            </Typography>

            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                gap: 3,
                alignItems: "stretch",
              }}
            >
              {features.map((feature) => (
                <Paper
                  key={feature.title}
                  elevation={0}
                  sx={{
                    flex: {
                      xs: "1 1 100%",
                      sm: "1 1 calc(50% - 12px)",
                      md: "1 1 0",
                    },
                    minWidth: 0,
                    p: 3,
                    border: "1px solid",
                    borderColor: "divider",
                    borderRadius: 3,
                    bgcolor: "background.paper",
                    transition: "transform 0.25s ease, box-shadow 0.25s ease",
                    "&:hover": {
                      transform: "translateY(-5px)",
                      boxShadow: 4,
                    },
                  }}
                >
                  <Box
                    sx={{
                      width: 54,
                      height: 54,
                      mb: 2,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      borderRadius: 2,
                      bgcolor: "action.hover",
                      color: "primary.main",
                      fontSize: "1.5rem",
                      fontWeight: 800,
                    }}
                  >
                    {feature.title.charAt(0)}
                  </Box>

                  <Typography variant="h6" fontWeight={800} mb={1}>
                    {feature.title}
                  </Typography>

                  <Typography
                    sx={{
                      color: "text.secondary",
                      lineHeight: 1.9,
                    }}
                  >
                    {feature.description}
                  </Typography>
                </Paper>
              ))}
            </Box>
          </Box>

          {/* CTA Section */}
          <Paper
            elevation={0}
            sx={{
              p: { xs: 3, md: 5 },
              border: "1px solid",
              borderColor: "divider",
              borderRadius: 3,
              textAlign: "center",
              my: 5,
              bgcolor: (theme) =>
                theme.palette.mode === "dark"
                  ? "rgba(25, 118, 210, 0.12)"
                  : "rgba(25, 118, 210, 0.06)",
            }}
          >
            <Typography variant="h4" fontWeight={800} mb={2}>
              Join Our Community
            </Typography>

            <Typography
              sx={{
                maxWidth: 760,
                mx: "auto",
                mb: 3,
                color: "text.secondary",
                lineHeight: 2,
              }}
            >
              Ask questions, share answers, contribute your experience, and help
              build a more useful community for everyone.
            </Typography>

            <Button
              variant="contained"
              size="large"
              sx={{
                px: 4,
                borderRadius: 2,
                fontWeight: 700,
              }}
            >
              Get Started
            </Button>
          </Paper>
        </Box>
      </Container>
    </Box>
  );
}
