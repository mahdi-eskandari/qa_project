"use client";

import {
  Box,
  Card,
  CardContent,
  Typography,
  IconButton,
  Dialog,
  DialogTitle,
  DialogActions,
  Button,
  Divider,
  CircularProgress,
} from "@mui/material";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

export default function QuestionCard({ question, onDelete, link }) {
  const [openModal, setOpenModal] = useState(false);
  const [deleteButtonLoading, setDeleteButtonLoading] = useState(false);

  const handleDelete = async (id) => {
    try {
      setDeleteButtonLoading(true);

      const res = await fetch(`/api/questions/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete question");

      onDelete?.(id);
      setOpenModal(false);
    } catch (error) {
      console.error(error);
    } finally {
      setDeleteButtonLoading(false);
    }
  };

  return (
    <>
      <Card
        sx={{
          width: "100%",
          height: "100%",
          borderRadius: { xs: 3, sm: 4 },
          boxShadow: "0 6px 18px rgba(0,0,0,0.08)",
          border: "1px solid #ececec",
          transition: "all 0.25s ease",
          "&:hover": {
            transform: "translateY(-4px)",
            boxShadow: "0 12px 28px rgba(0,0,0,0.12)",
          },
        }}
      >
        <CardContent
          sx={{
            p: { xs: 1.6, sm: 2.2 },
            display: "flex",
            flexDirection: "column",
            height: "100%",
            minWidth: 0,
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "space-between",
              gap: { xs: 1, sm: 1.5 },
              mb: { xs: 1.2, sm: 1.5 },
            }}
          >
            <Link
              href={link}
              style={{
                textDecoration: "none",
                minWidth: 0,
                flex: 1,
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: { xs: 1, sm: 1.2 },
                  minWidth: 0,
                }}
              >
                <Image
                  src={question?.author?.image || "/user-icon.webp"}
                  alt={question?.author?.username || "user avatar"}
                  width={42}
                  height={42}
                  style={{
                    borderRadius: "50%",
                    objectFit: "cover",
                    flexShrink: 0,
                  }}
                />

                <Box sx={{ minWidth: 0, flex: 1 }}>
                  <Typography
                    variant="subtitle2"
                    sx={{
                      fontWeight: 700,
                      color: "#1f1f1f",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {question?.author?.username || "Unknown User"}
                  </Typography>

                  <Typography
                    variant="caption"
                    sx={{
                      color: "text.secondary",
                      display: "block",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {new Date(question.createdAt).toLocaleString()}
                  </Typography>
                </Box>
              </Box>
            </Link>

            <IconButton
              size="small"
              sx={{ color: "error.main", flexShrink: 0 }}
              onClick={(e) => {
                e.stopPropagation();
                setOpenModal(true);
              }}
            >
              <DeleteOutlineIcon fontSize="small" />
            </IconButton>
          </Box>

          <Divider sx={{ mb: { xs: 1.4, sm: 1.8 }, opacity: 0.7 }} />

          <Link
            href={link}
            style={{
              textDecoration: "none",
              minWidth: 0,
            }}
          >
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                  fontSize: { xs: "0.98rem", sm: "1rem" },
                  color: "#222",
                  mb: { xs: 0.8, sm: 1 },
                  lineHeight: 1.5,
                  overflowWrap: "anywhere",
                }}
              >
                {question.title}
              </Typography>

              <Typography
                variant="body2"
                sx={{
                  color: "text.secondary",
                  mb: 2,
                  display: "-webkit-box",
                  WebkitLineClamp: 4,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                  letterSpacing: "0.2px",
                  overflowWrap: "anywhere",
                }}
              >
                {question.description}
              </Typography>
            </Box>
          </Link>

          <Divider sx={{ mb: { xs: 1.2, sm: 1.4 }, opacity: 0.7 }} />

          <Box
            sx={{
              display: "flex",
              alignItems: { xs: "flex-start", sm: "center" },
              justifyContent: "space-between",
              gap: 1,
              mt: "auto",
              flexWrap: { xs: "wrap", sm: "nowrap" },
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.8 }}>
              <ChatBubbleOutlineIcon sx={{ fontSize: 18, color: "#666" }} />
              <Typography
                variant="body2"
                sx={{ color: "#444", fontWeight: 500 }}
              >
                {question?.answers?.length || 0} Answers
              </Typography>
            </Box>

            <Typography
              variant="caption"
              sx={{
                px: 1.2,
                py: 0.5,
                borderRadius: 10,
                bgcolor: "#f5f5f5",
                color: "#666",
              }}
            >
              Question
            </Typography>
          </Box>
        </CardContent>
      </Card>

      <Dialog
        open={openModal}
        onClose={() => setOpenModal(false)}
        PaperProps={{
          sx: {
            width: "400px",
            maxWidth: "90vw",
            borderRadius: "12px",
            p: 1,
          },
        }}
      >
        <DialogTitle>
          {`Are you sure you want to delete "${question.title}"?`}
        </DialogTitle>
        <DialogActions>
          <Button onClick={() => setOpenModal(false)}>Cancel</Button>
          <Button
            disabled={deleteButtonLoading}
            onClick={() => handleDelete(question._id)}
            color="error"
          >
            {deleteButtonLoading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Delete"
            )}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}



