import React, { useState, useEffect, useRef } from "react";
import api from "../api.js";
import "../styles/SetInterviewForm.css";

const SetInterviewForm = ({ application, onClose }) => {
    const [interviewers, setInterviewers] = useState([]);
    const [selectedInterviewers, setSelectedInterviewers] = useState([]);
    const [message, setMessage] = useState("");
    const [date, setDate] = useState("");
    const [time, setTime] = useState("");
    const formContainerRef = useRef(null);

    useEffect(() => {
        const fetchInterviewers = async () => {
            try {
                const response = await api.get("/api/interviewers/");
                setInterviewers(response.data);
            } catch (error) {
                console.error("Error fetching interviewers:", error);
                setMessage("Failed to fetch interviewers.");
            }
        };
        fetchInterviewers();

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

    const handleCheckboxChange = (interviewerId) => {
        setSelectedInterviewers((prev) =>
            prev.includes(interviewerId)
                ? prev.filter((id) => id !== interviewerId)
                : [...prev, interviewerId]
        );
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (selectedInterviewers.length === 0) {
            setMessage("Please select at least one interviewer.");
            return;
        }
        if (!date || !time) {
            setMessage("Please select both date and time.");
            return;
        }

        const interviewData = {
            application_id: application.id,
            interviewers: selectedInterviewers,
            candidate_email: application.email,
            date: date,
            time: time,
        };

        try {
            console.log("Data sent to API:", interviewData);
            const response = await api.post("/api/interview/", interviewData);
            setMessage("Interview scheduled successfully!");
            setTimeout(() => onClose(), 2000);
        } catch (error) {
            console.error("Error scheduling interview:", error);
            setMessage("Failed to schedule interview.");
        }
    };

    return (
        <div className="form-bg">
            <div className="form-container" ref={formContainerRef}>
                <h2>Set Interview</h2>
                <form onSubmit={handleSubmit}>
                    <label>Candidate:</label>
                    <div className="candidate-info">
                        {application.name} ({application.email})
                    </div>

                    <label>Select Interviewers:</label>
                    <div className="checkbox-group">
                        {interviewers.map((interviewer) => (
                            <label key={interviewer.id} className="checkbox-item">
                                <input
                                    type="checkbox"
                                    value={interviewer.id}
                                    checked={selectedInterviewers.includes(interviewer.id)}
                                    onChange={() => handleCheckboxChange(interviewer.id)}
                                />
                                {interviewer.email}
                            </label>
                        ))}
                    </div>

                    <label htmlFor="date">Date:</label>
                    <input
                        type="date"
                        id="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        required
                    />

                    <label htmlFor="time">Time:</label>
                    <input
                        type="time"
                        id="time"
                        value={time}
                        onChange={(e) => setTime(e.target.value)}
                        required
                    />

                    <div className="buttons-container">
                        <button type="button" id="closeBtn" onClick={onClose}>
                            Cancel
                        </button>
                        <input type="submit" value="Set Interview" />
                    </div>
                </form>
                {message && <p className={`message ${message.includes("successfully") ? "success" : "error"}`}>{message}</p>}
            </div>
        </div>
    );
};

export default SetInterviewForm;
