"use client";

import { Box, Skeleton } from "@mui/material";

export default function QuestionsLoading() {
  const renderCard = (key) => (
    <Box
      key={key}
      sx={{
        width: "100%",
        minHeight: 250,
        borderRadius: { xs: 3, sm: 4 },
        // استفاده از رنگ‌های داینامیک تم برای بوردر
        border: "1px solid",
        borderColor: "divider",
        // استفاده از سایه و رنگ پس‌زمینه پیش‌فرض کارت در تم فعلی
        boxShadow: (theme) =>
          theme.palette.mode === "dark"
            ? "0 6px 18px rgba(0,0,0,0.4)"
            : "0 6px 18px rgba(0,0,0,0.08)",
        p: { xs: 1.6, sm: 2.2 },
        bgcolor: "background.paper", // این مقدار در لایت‌مود سفید و در دارک‌مود خاکستری تیره می‌شود
        boxSizing: "border-box",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 2,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.2 }}>
          <Skeleton variant="circular" width={42} height={42} />
          <Box>
            <Skeleton variant="text" width={110} height={22} />
            <Skeleton variant="text" width={130} height={18} />
          </Box>
        </Box>
        <Skeleton variant="circular" width={28} height={28} />
      </Box>

      <Skeleton variant="text" width="70%" height={28} />
      <Skeleton variant="text" width="100%" height={22} />
      <Skeleton variant="text" width="92%" height={22} />
      <Skeleton variant="text" width="85%" height={22} />

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mt: 2,
        }}
      >
        <Skeleton variant="text" width={90} height={22} />
        <Skeleton variant="rounded" width={68} height={24} sx={{ borderRadius: 10 }} />
      </Box>
    </Box>
  );

  return (
    <Box
      sx={{
        gridColumn: "1 / -1",
        display: "grid",
        gridTemplateColumns: {
          xs: "1fr",
          md: "repeat(2, minmax(0, 1fr))",
        },
        gap: { xs: 2, sm: 2.5, md: 3 },
        width: "100%",
      }}
    >
      {renderCard(1)}
      {renderCard(2)}
    </Box>
  );
}
