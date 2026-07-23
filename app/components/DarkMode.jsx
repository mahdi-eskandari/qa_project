
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import { IconButton, ListItem } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { toggleTheme } from "../redux/reducers/themeSlice";

export const DarkModeBtn = ({ text }) => {
    const dispatch = useDispatch();
    const darkMode = useSelector((state) => state.theme.darkMode);

    return (
        <>
            {text ? (
                <ListItem
                    sx={{ cursor: "pointer" }}
                    onClick={() => dispatch(toggleTheme())}
                >
                    {darkMode ? "Light Mode" : "Dark Mode"}
                </ListItem>
            ) : (
                <IconButton onClick={() => dispatch(toggleTheme())}>
                    {darkMode ? (
                        <LightModeIcon fontSize="large" />
                    ) : (
                        <DarkModeIcon fontSize="large" />
                    )}
                </IconButton>
            )}
        </>
    );
};
