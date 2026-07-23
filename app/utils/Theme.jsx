"use client";
import { createTheme, CssBaseline, responsiveFontSizes, ThemeProvider as ThemeProviderMui } from "@mui/material";
import { Poppins } from "next/font/google";
import { useMemo } from "react";
import { useSelector } from "react-redux";

const font = Poppins({
    weight: ["400", "700"],
    style: ["normal", "italic"],
    subsets: ["latin"],
});
function ThemeProvider({ children }) {
    const darkMode = useSelector((state) => state.theme.darkMode);

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
    return (
        <ThemeProviderMui theme={theme}>
            <CssBaseline />
            {children}
        </ThemeProviderMui>
    );
}

export default ThemeProvider;
