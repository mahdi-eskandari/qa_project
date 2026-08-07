"use client";

import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  DialogContentText,
  CircularProgress,
  Avatar,
} from "@mui/material";
import Image from "next/image";
import { useForm } from "react-hook-form";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import EditIcon from "@mui/icons-material/Edit";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import { useRouter } from "next/navigation";

export default function Page({ params }) {
  const [question, setQuestion] = useState(null);
  const [loading, setLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  const [editingAnswerId, setEditingAnswerId] = useState(null);
  const [editContent, setEditContent] = useState("");

  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deletingAnswerId, setDeletingAnswerId] = useState(null);

  const [pageLoading, setPageLoading] = useState(true)
  const [createLoading, setCreateLoading] = useState(false)

  const router = useRouter();

//   const handleGoBack = () => {
//   router.push("/questions"); // انتقال به صفحه لیست
// };

  const {
    register,
    reset,
    formState: { errors },
    handleSubmit,
  } = useForm();

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch("/api/auth/me");
        if (res.ok) {
          const data = await res.json();
          setCurrentUser(data.user);
        }
      } catch (error) {
        console.error("Failed to fetch user:", error);
      }
    }

    fetchUser();
  }, []);

  async function fetchQuestion() {
    try {
      setPageLoading(true)
      setLoading(true);
      const res = await fetch(`/api/questions/${params.id}`);

      if (!res.ok) {
        throw new Error("Failed to fetch question");
      }

      const data = await res.json();
      setQuestion(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
      setPageLoading(false)
    }
  }

  useEffect(() => {
    fetchQuestion();
  }, [params.id]);




  const onSubmit = async (formData) => {
    setCreateLoading(true)
    try {
      const res = await fetch(`/api/answers`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: formData.content,
          questionId: params.id,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to submit answer");
      }
       const newAnswer = await res.json();

             const refreshRes = await fetch(`/api/questions/${params.id}`);
      const refreshedData = await refreshRes.json();
      setQuestion(refreshedData);
      

      reset();
      


    } catch (error) {
      console.log("Error:", error);
    } finally {
      setCreateLoading(false)
    }
  };

  const handleEditClick = (answer) => {
    setEditingAnswerId(answer._id);
    setEditContent(answer.content || "");
  };

  const handleCancelEdit = () => {
    setEditingAnswerId(null);
    setEditContent("");
  };

  const handleUpdateAnswer = async (answerId) => {
    try {
      const res = await fetch(`/api/answers/${answerId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: editContent,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to update answer");
      }

setQuestion((prev) => ({
    ...prev,
  answers: prev.answers.map((a) => 
  a._id === answerId ? {...a, content: editContent } : a
  )
}))

      setEditingAnswerId(null);
      setEditContent("");
    } catch (error) {
      console.error("Update error:", error);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deletingAnswerId) return;

    try {
      setDeleteLoading(true);

      const res = await fetch(`/api/answers/${deletingAnswerId}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error("Failed to delete answer");
      }

setQuestion((prev) => ({

  ...prev,
  answers: prev.answers.filter((a) => String(a._id) !== String(deletingAnswerId))

}))


      setDeletingAnswerId(null);
          // router.push("/questions");
    } catch (error) {
      console.error("Delete error:", error);
    } finally {
      setDeleteLoading(false);
    }
  };

  return pageLoading ? (
   <Box
  sx={{
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
  ) : (
<Box
      sx={{
        width: "100%",
        display: "flex",
        alignItems: "center",
        flexDirection: "column",
        justifyContent: "flex-start",
        px: { xs: 2, sm: 3, md: 0 }
      }}
    >
      <Box sx={{ width: { xs: "100%", sm: "90%", md: "63%" }, py: 1 }}>
        <Box sx={{ display: "flex", gap: 2, alignItems: "center", px: 1, py: 1 }}>
          <Image
            width={50}
            height={50}
            src="/user-icon.webp"
            alt="user"
            style={{ borderRadius: "50%" }}
          />

          <Box sx={{ minWidth: 0 }}>
            <Typography
              variant="subtitle2"
              sx={{
                fontWeight: 700,
                color: "text.primary", 
                // color: "#1f1f1f",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {question?.author?.username}
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
              {question?.createdAt ? new Date(question.createdAt).toLocaleString() : ""}
            </Typography>
          </Box>
        </Box>

        <Box sx={{ mt: 3 }}>
          <Typography variant="h4" sx={{ fontWeight: "bold", mb: 1 }}>
            {question?.title}
          </Typography>

          <Typography
            variant="body1"
            sx={{
              color: "text.secondary",
              pl: 0.2,
              borderBottom: "1px solid #c2bcbc",
            }}
          >
            {question?.description}
          </Typography>
        </Box>

        <Box>
          <Typography variant="h6" sx={{ mt: 3, mb: 2 }}>
            Answers
          </Typography>

         {question?.answers?.map((a) => {
  const isAuthor = currentUser?._id === a.author?._id;
  const isEditing = editingAnswerId === a._id;

  return (
    <Box
      key={a._id}
      
      sx={{
        p: { xs: 2, sm: 2.5 }, // در موبایل پدینگ کارت‌ها کمی کمتر می‌شود تا فضا حفظ شود
        mb: 3,
        p: 2.5,
        // استفاده از رنگ سیستمی به جای "#fff" تا در دارک مود تیره شود
        backgroundColor: "background.paper", 
        borderRadius: "16px",
        // استفاده از رنگ سیستمی به جای "#f0f0f0" برای بوردر دور کارت
        border: "1px solid",
        borderColor: "divider",
        
        // وضعیت عادی سایه
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.03)", 
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        cursor: "default",

        "&:hover": {
          // تغییر به translateY و تنظیم روی -4px برای حرکت محسوس به سمت بالا
          transform: "translateY(-4px)", 
          boxShadow: "0 12px 24px rgba(0, 0, 0, 0.08)",
          // رنگ بوردر در هاور کمی مشخص‌تر می‌شود (بدون تغییر رنگ دستی)
          borderColor: "action.hover", 
        },
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
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Avatar
            src={a.author?.image || "/user-icon.webp"}
            sx={{ width: 32, height: 32, fontSize: "0.9rem", bgcolor: "primary.main" }}
          >
            {a.author?.username?.charAt(0)?.toUpperCase()}
          </Avatar>

          <Box>
            <Typography
              variant="subtitle2"
              sx={{ 
                fontWeight: 700, 
                // تغییر رنگ نام کاربری به رنگ اصلی نوشته‌های قالب
                // color: "text.primary", 
                lineHeight: 1 
              }}
            >
              {a.author?.username || "User"}
            </Typography>

            <Typography 
              variant="caption" 
              // تغییر رنگ تاریخ به رنگ فرعی نوشته‌ها (خاکستری هماهنگ با تم)
              sx={{ color: "text.secondary" }}
            >
              {a.createdAt ? new Date(a.createdAt).toLocaleString() : ""}
            </Typography>
          </Box>
        </Box>

        {isAuthor && (
          <Box sx={{ display: "flex", gap: 0.5 }}>
            {isEditing ? (
              <>
                <IconButton
  size="small"
  onClick={() => handleUpdateAnswer(a._id)}
  sx={{
    color: "success.main",
    // در لایت‌مود رنگ روشن قبلی (#f0fdf4) و در دارک‌مود رنگ ملایم سیستمی
    bgcolor: (theme) =>
      theme.palette.mode === "dark" ? "success.dark" : "#dcf5e3",
    "&:hover": {
      bgcolor: (theme) =>
        theme.palette.mode === "dark" ? "success.main" : "#c2f7d4",
    },
  }}
>
  <CheckIcon fontSize="small" />
</IconButton>

<IconButton
  size="small"
  onClick={handleCancelEdit}
  sx={{
    color: "error.main",
    // در لایت‌مود رنگ روشن قبلی (#fef2f2) و در دارک‌مود رنگ ملایم سیستمی
    bgcolor: (theme) =>
      theme.palette.mode === "dark" ? "error.dark" : "#facaca",
    "&:hover": {
      bgcolor: (theme) =>
        theme.palette.mode === "dark" ? "error.main" : "#f5b2b2",
    },
  }}
>
  <CloseIcon fontSize="small" />
</IconButton>

              </>
            ) : (
              <>
                <IconButton
                  size="small"
                  onClick={() => handleEditClick(a)}
                  sx={{
                    color: "text.secondary",
                    transition: "all 0.2s",
                    "&:hover": { color: "primary.main", bgcolor: "action.hover" },
                  }}
                >
                  <EditIcon fontSize="small" />
                </IconButton>

                <IconButton
                  size="small"
                  onClick={() => setDeletingAnswerId(a._id)}
                  sx={{
                    color: "text.secondary",
                    transition: "all 0.2s",
                    "&:hover": { color: "error.main", bgcolor: "action.hover" },
                  }}
                >
                  <DeleteOutlineIcon fontSize="small" />
                </IconButton>
              </>
            )}
          </Box>
        )}
      </Box>

      <Box sx={{ pl: 0.5 }}>
        <TextField
          fullWidth
          multiline
          minRows={1}
          disabled={!isEditing}
          value={isEditing ? editContent : a.content}
          onChange={(e) => setEditContent(e.target.value)}
          variant="standard"
          InputProps={{
            disableUnderline: !isEditing,
            sx: { 
              fontSize: "0.95rem", 
              // تغییر رنگ متن ورودی/پاسخ به رنگ اصلی نوشته‌های قالب
              color: "text.primary" 
            },
          }}
          sx={{
            "& .MuiInputBase-input.Mui-disabled": {
              // تنظیم رنگ متن غیرفعال بر اساس رنگ اصلی قالب
              WebkitTextFillColor: (theme) => theme.palette.text.primary,
            },
          }}
        />
      </Box>
    </Box>
  );
})}


          <Box component="form" onSubmit={handleSubmit(onSubmit)}>
            <TextField
              label="Write your answer"
              variant="filled"
              multiline
              rows={3}
              fullWidth
              {...register("content", { required: "Answer content is required" })}
              error={!!errors.content}
              helperText={
                errors.content
                  ? errors.content.message
                  : "Write a clear, helpful, and relevant answer."
              }

              sx={{ 
    mb: 2,
    "& .MuiFilledInput-root": { 
      // تشخیص خودکار لایت‌مود و دارک‌مود:
      backgroundColor: (theme) => 
        theme.palette.mode === "dark" 
          ? "#1d1d1d" // در دارک‌مود: رنگ تیره سیستمی
          : "#f0eeee",          // در لایت‌مود: همان رنگ خاکستری روشنِ قبلی شما
          
      "&:hover": {
        backgroundColor: (theme) => 
          theme.palette.mode === "dark" 
            ? "action.hover" 
            : "#ebebeb",        // رنگ هاور لایت‌مود
      },
      "&.Mui-focused": {
        backgroundColor: (theme) => 
          theme.palette.mode === "dark" 
            ? "background.paper" 
            : "#e8e8e8",
      }
    },
    "& .MuiFormHelperText-root": {
      color: "text.secondary"
    }
  }}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{
                backgroundColor: "#2563eb",
                color: "#fff",
                fontWeight: "bold",
                fontSize: "1rem",
                py: 1.2,
                my: 3,
                borderRadius: 2,
                "&:hover": { backgroundColor: "#1e40af" },
              }}
            >
              {
  createLoading ? (
    <CircularProgress size={28} color="inherit"  />
  ) : (
    "Submit"
  )
}
            </Button>
          </Box>
        </Box>
      </Box>


<Dialog
  open={Boolean(deletingAnswerId)}
  onClose={() => setDeletingAnswerId(null)}
  PaperProps={{
    sx: {
      borderRadius: "16px",
      p: 1,
      width: "400px",
      maxWidth: "90vw",
      // استفاده از رنگ پس‌زمینه تم برای هماهنگی با دارک‌مود
      backgroundColor: "background.paper", 
    },
  }}
>
  <DialogTitle sx={{ 
    fontWeight: 700, 
    color: "text.primary", // در لایت سیاه و در دارک سفید می‌شود
  }}>
    Are you sure?
  </DialogTitle>

  <DialogContent>
    <DialogContentText sx={{ 
      color: "text.secondary", // خاکستری مناسب برای متن‌های توضیحی در هر دو تم
    }}>
      Are you sure you want to delete this answer? This action cannot be undone.
    </DialogContentText>
  </DialogContent>

  <DialogActions sx={{ p: 2, gap: 2}}>
    <Button
      onClick={() => setDeletingAnswerId(null)}
      sx={{
        color: "text.secondary",
        textTransform: "none",
        fontWeight: 600,
        '&:hover': { bgcolor: 'action.hover' }
      }}
    >
      Cancel
    </Button>

    <Button
      disabled={deleteLoading}
      onClick={handleDeleteConfirm}
      variant="contained"
      color="error"
      autoFocus
      sx={{
        borderRadius: "10px",
        px: 4,
        textTransform: "none",
        fontWeight: 600,
        boxShadow: "none",
        "&:hover": { 
          boxShadow: "none", 
          bgcolor: "error.dark" 
        },
      }}
    >
      {deleteLoading ? (
        <CircularProgress size={20} color="inherit" />
      ) : (
        "Yes"
      )}
    </Button>
  </DialogActions>
</Dialog>

    </Box>
  )

    
  
}
