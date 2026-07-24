"use client"
import * as React from "react";
import PropTypes from "prop-types";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import MenuIcon from "@mui/icons-material/Menu";
import Toolbar from "@mui/material/Toolbar";
import Button from "@mui/material/Button";
import Image from "next/image";
import Link from "next/link";
import { DarkModeBtn } from "./DarkMode";
import { usePathname } from "next/navigation";

const drawerWidth = 240;
const navItems = [
    { title: "Home", route: "/" },
    { title: "Questions", route: "/questions" },
    { title: "About", route: "/about" },
]

export default function Header(props) {
    const { window } = props
    const [mobileOpen, setMobileOpen] = React.useState(false)
    const path = usePathname()
    if(path === "/register" || path === "/login" || path === "forgot-password") {
        return null
    }

    const handleDrawerToggle = () => {
        setMobileOpen((p) => !p)
    }




    const drawer = (
        <Box onClick={handleDrawerToggle} sx={{ textAlign: "center"}}>
            <Box sx={{ my: 2, display: "flex", justifyContent: "center" }}>
                <Image src="/qaa.png" width={60} height={60} alt="logo" priority />

            </Box>
            <Divider />
            <List sx={{mt: 1}}>
                {navItems.map((item) => (
                    <ListItem key={item.title} disablePadding >
                        <ListItemButton sx={{ textAlign: "center", color: "text.primary",p: 1.5,
                            '&:hover': {
                                borderRight: "4px solid #2d4b4dd0"
                             },
                         }}>
                            <Link href={item.route} style={{ color: "inherit", textDecoration: "none" }}>
                                {item.title}
                            </Link>
                        </ListItemButton>
                    </ListItem>
                ))}
                {/* <DarkModeBtn /> */}
            </List>
        </Box>
    );

    const container = window !== undefined ? () => window().document.body : undefined;

    return (
        <Box sx={{ display: "flex" }}>
            <AppBar component="nav" sx={{ py: 1, backgroundColor: "primary.main", height: "80px" }}>
                <Toolbar>
                    <IconButton color="inherit" aria-label="open drawer" edge="start" onClick={handleDrawerToggle} sx={{ mr: 2, display: { sm: "none" } }}>
                        <MenuIcon />
                    </IconButton>
                    <Box component="div" sx={{ mr: 2, display: { xs: "none", sm: "block" } }}>
                        <Link href={"/"}>
                            <Image src="/qaa.png" width={60} height={60} alt="logo" priority />

                        </Link>
                    </Box>
                    <Box sx={{ display: { xs: "none", sm: "block" } }}>
                        {navItems.map((item) => (
                            <Button key={item.title}>
                                <Link href={item.route} style={{ color: "#fff", textDecoration: "none" }}>
                                    {item.title}
                                </Link>
                            </Button>
                        ))}
                    </Box>
                    <Box sx={{ flexGrow: "1", textAlign: "right", display: {sm: "block" } }}>
                        <DarkModeBtn />
                    </Box>
                </Toolbar>
            </AppBar>
            <nav>
                <Drawer
                    container={container}
                    variant="temporary"
                    open={mobileOpen}
                    onClose={handleDrawerToggle}
                    ModalProps={{
                        keepMounted: true, // Better open performance on mobile.
                    }}
                    sx={{
                        display: { xs: "block", sm: "none" },
                        "& .MuiDrawer-paper": { boxSizing: "border-box", width: drawerWidth },
                    }}
                >
                    <Box
                    sx={{
                        height: "100%"
                    }}
                    >

                    {drawer}
                    </Box>
                </Drawer>
            </nav>
        </Box>
    )
}
