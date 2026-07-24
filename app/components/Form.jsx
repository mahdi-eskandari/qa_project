"use client"

import { Box, Button, Dialog, DialogActions, DialogTitle, TextField, Typography, CircularProgress } from "@mui/material"
import { useForm } from "react-hook-form"
import { useState } from "react"
import { usePathname } from "next/navigation"
import { useRouter } from "next/navigation"




export default function Form() {
    const [open, setOpen] = useState(false)
    const [formData, setFormData] = useState(null)
    const [loading, setLoading] = useState(false)

    const router = useRouter()




    const helperTexts = {
        title: {
            required: 'Title is required',
            minLength: 'Title must be at least 5 characters',
            maxLength: 'Title must be at most 50 characters',
            pattern: 'Title contains invalid characters',
            default: 'Enter a short, descriptive title (3–50 characters)',
        },
        description: {
            required: 'Description is required',
            minLength: 'Description must be at least 10 characters',
            maxLength: 'Description must be at most 200 characters',
            pattern: 'Description contains invalid characters',
            default: 'Describe your question clearly (10–200 characters)',
        },
    }


const {
    register,
    reset,
    formState: {errors},
    handleSubmit
} = useForm()


const onSubmit = (data) => {
    setFormData(data)
    setOpen(true)
    
}


const handleConfirm = async () => {
try {
    setLoading(true)

    const res = await fetch("/api/questions", {
    method: "POST",
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({
        title: formData.title,
        description: formData.description
    })
    })
    const data = await res.json()
    console.log(data)

    if (!res.ok) throw new Error('Failed to save question');
    reset()
    router.push("/questions")
    
} catch (error) {
                console.error(error);
            alert('Failed to save question');
} finally {
    setLoading(false)
    setOpen(false)
}
}


const handleCancel = () => {
    setOpen(false)
}




    return (

        <Box
            sx={{
              width: "70%",
              mx: "auto"
            }}
            >
        <Box
        component="form"
        onSubmit={handleSubmit(onSubmit)}
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          gap: 3
        }}
        >
          <Typography
          variant="h4"
          >
            Ask your question
          </Typography>
        
        
        <TextField
        label="title"
        variant="outlined"
        fullWidth
        error={!!errors.title}
                helperText={
                    errors.title
                        ? helperTexts.title[errors.title.type]
                        : helperTexts.title.default
                }
                {...register('title', {
                    required: true,
                    minLength: 5,
                    maxLength: 50,
                    pattern: /^[\u0600-\u06FFa-zA-Z0-9\s.,!?'"()-]+$/,
                })}
        
        
        />
        
        
          <TextField
                        label="Description"
                        variant="outlined"
                        fullWidth
                        rows={4}
                        multiline
                        error={!!errors.description}
                        helperText={
                            errors.description
                                ? helperTexts.description[errors.description.type]
                                : helperTexts.description.default
                        }
                        {...register('description', {
                            required: true,
                            minLength: 10,
                            maxLength: 300,
                            pattern: /^[A-Za-z0-9\s.,!?'"-]+$/,
                        })}
        
        
                    />


                     <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                sx={{
                    py: 1.5,
                    borderRadius: '10px',
                    fontSize: '1rem',
                    textTransform: 'none',
                    mb: 5,
                }}
            >
                Submit
            </Button>




{/* <Dialog
open={open}
onClose={handleCancel}
PaperProps={{
                    sx: {
                        width: '400px',
                        maxWidth: '90vw',
                        height: '150px',
                        borderRadius: '10px',
                        p: 2,
                    },
                }}
>
    <DialogTitle>Are you sure?</DialogTitle>
    <DialogActions>
    <Button onClick={handleCancel}>Cancel</Button>
    <Button onClick={handleConfirm}>Yes</Button>
    </DialogActions>
</Dialog> */}



<Dialog
  open={open}
  onClose={handleCancel}
  PaperProps={{
    sx: {
      width: '400px',
      maxWidth: '90vw',
      borderRadius: '16px', // کمی گردتر برای ظاهر مدرن‌تر (مشابه بقیه پروژه‌ات)
      p: 1,
    },
  }}
>
  <DialogTitle sx={{ fontWeight: 'bold'}}>
    Are you sure?
  </DialogTitle>
  
  <DialogActions sx={{ pb: 2 }}>
    {/* دکمه انصراف با رنگ ملایم */}
    <Button 
      onClick={handleCancel} 
      sx={{ 
        color: "text.secondary",
        px: 3 
      }}
    >
      Cancel
    </Button>

    {/* دکمه تایید با رنگ سبز موفقیت */}
    <Button
      disabled={loading}
      onClick={handleConfirm}
      variant="contained"
      color="success" // رنگ سبز استاندارد MUI
      sx={{ 
        px: 4,
        borderRadius: '8px',
        textTransform: 'none', // برای اینکه حروف بزرگ اجباری نباشد
        boxShadow: 'none',
        '&:hover': {
          boxShadow: '0 4px 12px rgba(46, 125, 50, 0.2)' // سایه ملایم سبز در هاور
        }
      }}
    >
      {loading ? <CircularProgress size={24} color="inherit" /> : "Yes"}
    </Button>
  </DialogActions>
</Dialog>

        </Box>
            </Box>
    )
}