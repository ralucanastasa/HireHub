import React, { useState } from "react";
import { jwtDecode } from "jwt-decode";
import { FaUser } from "react-icons/fa";
import { RiLockPasswordFill } from "react-icons/ri";
import "../styles/LoginPage.css";
import api from "../api.js";
import {ACCESS_TOKEN, REFRESH_TOKEN} from "../constants.js";

function LoginPage() {
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [username, setUsername] = useState("");
    const [loading, setLoading] = useState(false)

    const handleLogin = async (e) => {
        setLoading(true);
        e.preventDefault();
        try {
            const result = await api.post("/api/token/", { username, password });
            const accessToken = result.data.access;
            const decodedToken = jwtDecode(accessToken);
            const userRole = decodedToken.role;

            if (userRole) {
                console.log(userRole);
            } else {
                console.error("Role not found in the token");
            }

            localStorage.setItem(ACCESS_TOKEN, accessToken);
            localStorage.setItem(REFRESH_TOKEN, result.data.refresh);
            localStorage.setItem('userRole', userRole);

            console.log("Access Token Saved:", localStorage.getItem(ACCESS_TOKEN));
            window.location.href = "/";
        } catch (error) {
            alert(error);
            setError("The username or password is incorrect.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <div className="header-title">
                <span>H</span>
                <span>I</span>
                <span>R</span>
                <span>E</span>
                <span>H</span>
                <span>U</span>
                <span>B</span>
            </div>
            <div className="wave"></div>
            <div className="wave"></div>
            <div className="wave"></div>

            <div className="login-container">
                <form onSubmit={handleLogin}>
                    <h1>Login</h1>
                    {error && <p style={{ color: 'red' }}>{error}</p>}
                    <div className="input-box">
                        <input
                            placeholder="Username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                        <FaUser className="icon" />
                    </div>
                    <div className="input-box">
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <RiLockPasswordFill className="icon" />
                    </div>

                    <button type="submit">Submit</button>

                    <div className="register-link">
                        <p>
                            Don't have an account? <a href="/register">Register</a>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default LoginPage;
