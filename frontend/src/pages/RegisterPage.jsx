import React, { useState } from "react";
import { FaUser } from "react-icons/fa";
import { RiLockPasswordFill } from "react-icons/ri";
import "../styles/RegisterPage.css";
import api from "../api.js";
import {ACCESS_TOKEN, REFRESH_TOKEN} from "../constants.js";
import { MdDriveFileRenameOutline } from "react-icons/md";
import { RiArrowDropDownLine } from "react-icons/ri";



function RegisterPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [userType, setUserType] = useState("");
    const [lastName, setLastName] = useState("");
    const [firstName, setFirstName] = useState("");
    const [username, setUsername] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false)


    const handleRegister = async (e) => {
        setLoading(true);
        e.preventDefault();
        try {
            if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
            }
            if (userType !== "Candidate" && userType !== "Employer" && userType !== "Interviewer") {
                setError("Please select a valid user type (Candidate, Employer or Interviewer).");
                return;
            }
            const result = await api.post("/api/user/register/", {
                first_name: firstName,
                last_name: lastName,
                username,
                email,
                password,
                role: userType,
            })
            localStorage.setItem(ACCESS_TOKEN, result.data.access);
            localStorage.setItem(REFRESH_TOKEN, result.data.refresh);
            window.location.href = "/login";
        } catch (error) {
            alert(error)
            setError("Please fill out all fields.");
        } finally {
            setLoading(false)
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

            <div className="register-container">
                <form onSubmit={handleRegister}>
                    <h1>Register</h1>
                    {error && <p style={{ color: 'red' }}>{error}</p>}
                    <div className="input-box">
                        <input
                            placeholder="First name"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            required
                        />
                        <MdDriveFileRenameOutline className="icon" />
                    </div>
                    <div className="input-box">
                        <input
                            placeholder="Last name"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            required
                        />
                        <MdDriveFileRenameOutline className="icon" />
                    </div>
                    <div className="input-box">
                        <input
                            placeholder="Username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                        <MdDriveFileRenameOutline className="icon" />
                    </div>
                    <div className="input-box">
                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
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
                    <div className="input-box">
                        <input
                            type="password"
                            placeholder="Confirm Password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                        <RiLockPasswordFill className="icon" />
                    </div>

                    <div className="input-box">
                        <select
                            value={userType}
                            onChange={(e) => setUserType(e.target.value)}
                            required
                        >
                            <option>Select role</option>
                            <option value="Candidate">Candidate</option>
                            <option value="Employer">Employer</option>
                            <option value="Interviewer">Interviewer</option>
                        </select>
                        <RiArrowDropDownLine className="icon" />
                    </div>

                    <button type="submit">Submit</button>

                    <div className="login-link">
                        <p>
                            Already have an account? <a href="/login">Login</a>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default RegisterPage;
