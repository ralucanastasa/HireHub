import React, { useState, useEffect } from "react";
import { HiOutlineBars3 } from "react-icons/hi2";
import { FaHome } from "react-icons/fa";
import { IoInformationSharp } from "react-icons/io5";
import { IoMdContact } from "react-icons/io";
import { IoIosLogIn, IoIosLogOut } from "react-icons/io";
import { Box, Divider, Drawer, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import { useNavigate } from "react-router-dom";
import "../styles/Navbar.css";
import {ACCESS_TOKEN} from "../constants.js";

function Navbar() {
    const [openMenu, setOpenMenu] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [role, setRole] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem(ACCESS_TOKEN);
        const userRole = localStorage.getItem("userRole");
        if (token && userRole) {
            setIsLoggedIn(true);
            setRole(userRole);
        }
    }, []);

    const menuOptions = [
        {
            text: "Home",
            icon: <FaHome />,
            route: "/",
        },
        ...(role === "Employer" ? [
            {
                text: "Dashboard",
                icon: <FaHome />,
                route: "/employer-dashboard",
            },
            {
                text: "Jobs",
                icon: <IoMdContact />,
                route: "/add-job",
            },
            {
                text: "Applications",
                icon: <FaHome />,
                route: "/applications",
            }
        ] : role === "Candidate" ? [
            {
                text: "Dashboard",
                icon: <FaHome />,
                route: "/candidate-dashboard",
            },
            {
                text: "Jobs",
                icon: <FaHome />,
                route: "/candidate-jobs",
            },
        ] : role === "Interviewer" ? [
            {
                text: "Dashboard",
                icon: <FaHome />,
                route: "/interviewer-dashboard",
            },
        ] : []),
        !isLoggedIn
            ? {
                text: "Login",
                icon: <IoIosLogIn />,
                route: "/login",
            }
            : {
                text: "Logout",
                icon: <IoIosLogOut />,
                route: "/logout",
            },
    ];

    const handleMenuItemClick = (item) => {
        console.log(item.text);
        if (item.route) {
            navigate(item.route);
        }
        setOpenMenu(false);
    };

    return (
        <nav>
            <div className="navbar-logo">
                <h1>HireHub</h1>
            </div>
            <div className="navbar-links">
                <a href="/">Home</a>
                {role === "Employer" && <a href="/employer-dashboard">Dashboard</a>}
                {role === "Employer" && <a href="/add-job">Jobs</a>}
                {role === "Employer" && <a href="/applications">Applications</a>}
                {role === "Candidate" && <a href="/candidate-dashboard">Dashboard</a>}
                {role === "Candidate" && <a href="/candidate-jobs">Jobs</a>}
                {role === "Interviewer" && <a href="/interviewer-dashboard">Dashboard</a>}
                {!isLoggedIn ? <a href="/login">Login</a> : <a href="/logout">Logout</a>}
            </div>
            <div className="navbar-menu">
                <HiOutlineBars3 onClick={() => setOpenMenu(true)} />
            </div>
            <Drawer open={openMenu} onClose={() => setOpenMenu(false)} anchor="right">
                <Box
                    sx={{ width: 250 }}
                    role="presentation"
                    onClick={() => setOpenMenu(false)}
                    onKeyDown={() => setOpenMenu(false)}
                >
                    <List>
                        {menuOptions.map((item) => (
                            <ListItem button key={item.text} onClick={() => handleMenuItemClick(item)}>
                                <ListItemIcon>{item.icon}</ListItemIcon>
                                <ListItemText primary={item.text} />
                            </ListItem>
                        ))}
                    </List>
                    <Divider />
                </Box>
            </Drawer>
        </nav>
    );
}

export default Navbar;
