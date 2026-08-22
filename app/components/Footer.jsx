"use client";

import { Box, Container, IconButton, Link, Stack, Typography } from "@mui/material";
import { GitHub, Twitter, LinkedIn, Email } from "@mui/icons-material";
import { usePathname } from "next/navigation";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const path = usePathname()

      if(path === "/register" || path === "/login" || path === "forgot-password" || path === "/verify") {
        return null
    }

  return (
    <Box
      component="footer"
      sx={{
        display: "block",
        py: 4, // پدینگ کمتر برای جلوگیری از ارتفاع زیاد
        px: 2,
        mt: "auto",
        bgcolor: "primary.main",
        color: "primary.contrastText",
        borderTop: "1px solid",
        borderColor: "rgba(255, 255, 255, 0.1)",
      }}
    >
      <Container maxWidth="lg">
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            justifyContent: "space-between",
            alignItems: "center",
            gap: 3,
          }}
        >
          {/* بخش اول: لوگو و کپی‌رایت */}
          <Box 
            sx={{ 
              textAlign: { xs: "center", md: "left" },
              minWidth: 200 
            }}
          >
            <Typography variant="h6" fontWeight={855} sx={{ letterSpacing: 0.5 }}>
              Q&A Platform
            </Typography>
            <Typography 
              variant="caption" 
              sx={{ color: "rgba(255, 255, 255, 0.6)", display: "block", mt: 0.5 }}
            >
              © {currentYear} All rights reserved.
            </Typography>
          </Box>

          {/* بخش دوم: لینک‌های افقی و جمع‌وجور */}
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
              gap: { xs: 2.5, sm: 4 },
            }}
          >
            <Link href="/" underline="none" sx={linkStyle}>Questions</Link>
            <Link href="/tags" underline="none" sx={linkStyle}>Tags</Link>
            <Link href="/about" underline="none" sx={linkStyle}>About Us</Link>
            <Link href="/contact" underline="none" sx={linkStyle}>Contact</Link>
            <Link href="/privacy" underline="none" sx={linkStyle}>Privacy</Link>
          </Box>

          {/* بخش سوم: شبکه‌های اجتماعی */}
          <Stack 
            direction="row" 
            spacing={1} 
            justifyContent="center"
            sx={{ minWidth: 200 }}
          >
            <IconButton size="small" aria-label="GitHub" sx={iconStyle}>
              <GitHub fontSize="small" />
            </IconButton>
            <IconButton size="small" aria-label="Twitter" sx={iconStyle}>
              <Twitter fontSize="small" />
            </IconButton>
            <IconButton size="small" aria-label="LinkedIn" sx={iconStyle}>
              <LinkedIn fontSize="small" />
            </IconButton>
            <IconButton size="small" aria-label="Email" sx={iconStyle}>
              <Email fontSize="small" />
            </IconButton>
          </Stack>
        </Box>
      </Container>
    </Box>
  );
}

const linkStyle = {
  fontSize: "0.875rem",
  fontWeight: 500,
  color: "rgba(255, 255, 255, 0.8)",
  transition: "color 0.2s ease",
  "&:hover": {
    color: "#fff",
  },
};

const iconStyle = {
  color: "rgba(255, 255, 255, 0.8)",
  transition: "all 0.2s ease",
  "&:hover": {
    color: "#fff",
    bgcolor: "rgba(255, 255, 255, 0.08)",
  },
};
