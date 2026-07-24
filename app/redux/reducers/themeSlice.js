import { createSlice } from "@reduxjs/toolkit";

export const themeSlice = createSlice({
    name: "theme",
    initialState: {
        darkMode: false, // مقدار پیش‌فرض اولیه
    },
    reducers: {
        toggleTheme: (state) => {
            state.darkMode = !state.darkMode;
            // هر زمان تم تغییر کرد، مقدار جدید را در localStorage ذخیره می‌کنیم
            if (typeof window !== "undefined") {
                localStorage.setItem("darkMode", JSON.stringify(state.darkMode));
            }
        },
        // برای خواندن و مقداردهی اولیه تم از کلاینت
        setTheme: (state, action) => {
            state.darkMode = action.payload;
        }
    },
});

export const { toggleTheme, setTheme } = themeSlice.actions;
export default themeSlice.reducer;
