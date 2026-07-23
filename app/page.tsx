"use client"

import Image from "next/image";
// import HeroSection from './components/HeroSection';
import { Box, TextField, Typography } from "@mui/material";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation";
import Form from "./components/Form"
// type User = {
//   _id: string
//   email: string
// }


export default function Home() {
  const router = useRouter()
  // const [loading, setLoading] = useState(true)
  // const [user, setUser] = useState(null)

  // const [users, setUsers] = useState<User[]>([])

  // useEffect(() => {
  //   const checkUserAuth = async () => {
  //     try {
  //       const res = await fetch("/api/auth/me");

  //       if (res.status === 401) {
  //         // اگر توکن منقضی شده بود یا وجود نداشت
  //         router.push("/login");
  //       } else {
  //         const data = await res.json();
  //         setUser(data.user);
  //         setLoading(false);
  //       }
  //     } catch (err) {
  //       router.push("/login");
  //     }
  //   };

  //   checkUserAuth();
  // }, [router]);


  // if (loading) {
  //   return <p>Loading...</p>; // یا یک Spinner لودینگ مادیفای شده
  // }

  return (
    <Form />
  );
}
