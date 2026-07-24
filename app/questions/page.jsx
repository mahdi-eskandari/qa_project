"use client";

import { Box, Button, TextField, Typography } from "@mui/material";
import React, { useEffect, useMemo, useState } from "react";
import QuestionCard from "../components/QuestionCard";
import QuestionsLoading from "../components/QuestionsLoading";

export default function Page() {
  const [questions, setQuestions] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [sortOrder, setSortOrder] = useState("newest");

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        setLoading(true);
        setError("");

        const res = await fetch("/api/questions");
        if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);

        const data = await res.json();
        const items = Array.isArray(data) ? data : data?.questions ?? [];
        setQuestions(items);
      } catch (error) {
        console.error(error);
        setError("Failed to load questions");
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, []);

  const filteredQuestions = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    const filtered = questions.filter((question) => {
      if (!normalizedSearch) return true;

      const title = question?.title?.toLowerCase() || "";
      const description = question?.description?.toLowerCase() || "";
      const authorName =
        question?.author?.username?.toLowerCase() ||
        question?.author?.name?.toLowerCase() ||
        "";

      return (
        title.includes(normalizedSearch) ||
        description.includes(normalizedSearch) ||
        authorName.includes(normalizedSearch)
      );
    });

    return filtered.sort((a, b) => {
      const dateA = new Date(a?.createdAt || 0).getTime();
      const dateB = new Date(b?.createdAt || 0).getTime();

      return sortOrder === "oldest" ? dateA - dateB : dateB - dateA;
    });
  }, [questions, search, sortOrder]);

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: "1200px",
        mx: "auto",
        px: { xs: 1.5, sm: 2.5, md: 3 },
        pb: { xs: 2, sm: 3 },
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: { xs: 2, sm: 2.5 },
        }}
      >
        <Typography
          variant="h4"
          sx={{
            textAlign: "center",
            fontWeight: 700,
            fontSize: { xs: "1.6rem", sm: "2rem" },
            color: "text.primary",
          }}
        >
          All Questions
        </Typography>

        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            alignItems: { xs: "stretch", md: "center" },
            justifyContent: "space-between",
            gap: 2,
            width: "100%",
          }}
        >
          <TextField
            fullWidth
            label="Search questions..."
            variant="outlined"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            sx={{
              flex: 1,
              minWidth: 0,
              "& .MuiOutlinedInput-root": {
                borderRadius: 3,
                bgcolor: "background.paper", // اصلاح شد: هماهنگی پس‌زمینه اینپوت در دارک‌مود و لایت‌مود
              },
            }}
          />

          <Box
            sx={{
              display: "flex",
              gap: 1,
              flexWrap: { xs: "wrap", sm: "nowrap" },
              width: { xs: "100%", md: "auto" },
            }}
          >
            {/* دکمه قدیمی‌ترین‌ها */}
            <Button
              variant={sortOrder === "oldest" ? "contained" : "outlined"}
              onClick={() => setSortOrder("oldest")}
              sx={{
                flex: { xs: 1, sm: 1, md: "unset" },
                minWidth: { xs: 0, sm: 150 },
                whiteSpace: "nowrap",
                borderRadius: 3,
                py: 1.2,
                fontWeight: 600,
                // استایل‌های شرطی بر اساس انتخاب دکمه و حالت تم:
                ...(sortOrder === "oldest"
                  ? {
                      bgcolor: "primary.main",
                      color: "primary.contrastText",
                    }
                  : {
                      color: "text.secondary", // خاکستری ملایم در هر دو حالت لایت/دارک
                      borderColor: (theme) =>
                        theme.palette.mode === "dark"
                          ? "rgba(255, 255, 255, 0.23)"
                          : "rgba(0, 0, 0, 0.23)",
                      "&:hover": {
                        borderColor: "text.primary",
                        bgcolor: (theme) =>
                          theme.palette.mode === "dark"
                            ? "action.hover"
                            : "action.hover",
                      },
                    }),
              }}
            >
              OLD TO NEW
            </Button>

            {/* دکمه جدیدترین‌ها */}
            <Button
              variant={sortOrder === "newest" ? "contained" : "outlined"}
              onClick={() => setSortOrder("newest")}
              sx={{
                flex: { xs: 1, sm: 1, md: "unset" },
                minWidth: { xs: 0, sm: 150 },
                whiteSpace: "nowrap",
                borderRadius: 3,
                py: 1.2,
                fontWeight: 600,
                // استایل‌های شرطی بر اساس انتخاب دکمه و حالت تم:
                ...(sortOrder === "newest"
                  ? {
                      bgcolor: "primary.main",
                      color: "primary.contrastText",
                    }
                  : {
                      color: "text.secondary", // خاکستری ملایم در هر دو حالت لایت/دارک
                      borderColor: (theme) =>
                        theme.palette.mode === "dark"
                          ? "rgba(255, 255, 255, 0.23)"
                          : "rgba(0, 0, 0, 0.23)",
                      "&:hover": {
                        borderColor: "text.primary",
                        bgcolor: (theme) =>
                          theme.palette.mode === "dark"
                            ? "action.hover"
                            : "action.hover",
                      },
                    }),
              }}
            >
              NEW TO OLD
            </Button>
          </Box>
        </Box>

        {error && (
          <Typography color="error" sx={{ textAlign: "center" }}>
            {error}
          </Typography>
        )}

        <Box
          sx={{
            width: "100%",
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              md: "repeat(2, minmax(0, 1fr))",
            },
            gap: { xs: 2, sm: 2.5, md: 3 },
            alignItems: "stretch",
          }}
        >
          {loading ? (
            <QuestionsLoading />
          ) : filteredQuestions.length > 0 ? (
            filteredQuestions.map((q) => (
              <Box key={q._id} sx={{ minWidth: 0, width: "100%" }}>
                <QuestionCard
                  link={`/questions/${q._id}`}
                  question={q}
                  onDelete={(id) =>
                    setQuestions((prev) =>
                      prev.filter((item) => item._id !== id)
                    )
                  }
                />
              </Box>
            ))
          ) : (
            <Box
              sx={{
                gridColumn: "1 / -1",
                textAlign: "center",
                py: 6,
                color: "text.secondary",
              }}
            >
              No questions found.
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
}
