import React, { useState, useRef, useEffect } from 'react';
import api from '../api';
import "../styles/JobApplicationForm.css";
import {ACCESS_TOKEN} from "../constants.js";

const InviteInterviewerForm = ({ onClose, onSuccess }) => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const formContainerRef = useRef(null);

    useEffect(() => {
        const handleOutsideClick = (event) => {
            if (formContainerRef.current && !formContainerRef.current.contains(event.target)) {
                onClose();
            }
        };

        document.addEventListener("mousedown", handleOutsideClick);

        return () => {
            document.removeEventListener("mousedown", handleOutsideClick);
        };
    }, [onClose]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");

        console.log(localStorage.getItem(ACCESS_TOKEN));
        const token = localStorage.getItem(ACCESS_TOKEN);

        if (!token) {
            alert("Token is missing or expired.");
            setLoading(false);
            return;
        }

        const formData = new FormData();
        formData.append('email', email)
        try {
            const response = await api.post('/api/invitation/', formData,
                { headers: { Authorization: `Bearer ${token}` } });

            if (response.status === 201) {
                onSuccess();
                alert("Invitation sent successfully!");
            } else {
                alert("Failed to send invitation.");
            }
        } catch (error) {
            console.error("Error inviting interviewer:", error);
            alert("An error occurred while sending the invitation.");
        }
        setLoading(false);
    };

    return (
        <div className="form-bg">
            <div className="form-container" ref={formContainerRef}>
                <div className="title">
                    <h1>Invite Interviewer</h1>
                </div>
                <div className="body">
                    <form onSubmit={handleSubmit}>
                        <label htmlFor="interviewerEmail">Email:</label>
                        <input
                            type="email"
                            id="interviewerEmail"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />

                        <div className="buttons-container">
                            <button type="button" id="closeBtn" onClick={onClose}>Cancel</button>
                            <input type="submit" value={loading ? "Sending..." : "Send Invitation"} disabled={loading} />
                        </div>
                    </form>
                </div>
                {message && <p>{message}</p>}
            </div>
        </div>
    );
};

export default InviteInterviewerForm;

