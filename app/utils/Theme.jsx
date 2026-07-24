"use client";
import { createTheme, CssBaseline, responsiveFontSizes, ThemeProvider as ThemeProviderMui } from "@mui/material";
import { Poppins } from "next/font/google";
import { useMemo, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setTheme } from "../redux/reducers/themeSlice"; // ⚠️ مسیر فایل themeSlice خودت را در صورت نیاز اصلاح کن

const font = Poppins({
    weight: ["400", "700"],
    style: ["normal", "italic"],
    subsets: ["latin"],
});

function ThemeProvider({ children }) {
    const dispatch = useDispatch();
    const darkMode = useSelector((state) => state.theme.darkMode);
    const [mounted, setMounted] = useState(false);

    // ۱. خواندن وضعیت تم ذخیره شده به محض لود شدن در مرورگر
    useEffect(() => {
        const savedTheme = localStorage.getItem("darkMode");
        if (savedTheme !== null) {
            dispatch(setTheme(JSON.parse(savedTheme)));
        }
        setMounted(true);
    }, [dispatch]);

    let theme = useMemo(
        () =>
            createTheme({
                palette: {
                    mode: darkMode ? "dark" : "light",
                    primary: {
                        main: darkMode ? "#032d5c" : "#4A90E2",
                    },
                    secondary: {
                        main: "#7ED321",
                    },
                },
                typography: {
                    fontFamily: font.style.fontFamily,
                },
            }),
        [darkMode]
    );

    theme = responsiveFontSizes(theme);

    // برای جلوگیری از خطای Hydration (تفاوت رندر کلاینت و سرور) تا آماده شدن کلاینت صبر می‌کنیم
    if (!mounted) {
        return <div style={{ visibility: "hidden" }}>{children}</div>;
    }

    return (
        <ThemeProviderMui theme={theme}>
            <CssBaseline />
            {children}
        </ThemeProviderMui>
    );
}

export default ThemeProvider;
