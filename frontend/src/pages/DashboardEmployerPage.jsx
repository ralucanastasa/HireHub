import React, { useState, useEffect } from "react";
import api from "../api";
import InviteInterviewerForm from "../components/InviteInterviewerForm";
import { CiEdit } from "react-icons/ci";
import "../styles/DashboardEmployerPage.css";
import {FaLock} from "react-icons/fa";

const DashboardEmployerPage = () => {
    const [showInviteForm, setShowInviteForm] = useState(false);
    const [interviews, setInterviews] = useState([]);
    const [selectedInterview, setSelectedInterview] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const interviewsPerPage = 5;
    const [notes, setNotes] = useState([]);
    const [showDeletePopup, setShowDeletePopup] = useState(false);
    const [accountDetails, setAccountDetails] = useState(null);
    const [editingField, setEditingField] = useState(null);
    const [updatedValue, setUpdatedValue] = useState("");
    const [showChangePassword, setShowChangePassword] = useState(false);
    const [passwordData, setPasswordData] = useState({
        current_password: "",
        new_password: "",
        confirm_password: "",
    });
    const [passwordMessage, setPasswordMessage] = useState("");

    const indexOfLastInterview = currentPage * interviewsPerPage;
    const indexOfFirstInterview = indexOfLastInterview - interviewsPerPage;
    const currentInterviews = interviews.slice(indexOfFirstInterview, indexOfLastInterview);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    useEffect(() => {
        const fetchInterviews = async () => {
            try {
                const response = await api.get("/api/employer/interviews/");
                setInterviews(response.data);
            } catch (error) {
                console.error("Error fetching interviews:", error);
            }
        };

        const fetchAccountDetails = async () => {
            try {
                const response = await api.get("/api/employer/profile/");
                setAccountDetails(response.data);
            } catch (error) {
                console.error("Error fetching account details:", error);
            }
        };
        fetchInterviews();
        fetchAccountDetails();
    }, []);

    const fetchNotes = (interviewId) => {
        api.get(`/api/employer/interviews/${interviewId}/notes/`)
            .then((response) => {
                setNotes(response.data);
            })
            .catch((error) => {
                console.error("Error fetching notes:", error);
            });
    };

    const handleOpenForm = () => setShowInviteForm(true);
    const handleCloseForm = () => setShowInviteForm(false);

    const handleDeleteInterview = async (interviewId) => {
        try {
            await api.delete(`/api/employer/interviews/${interviewId}/`);
            setInterviews((prev) => prev.filter((int) => int.id !== interviewId));
            setShowDeletePopup(false);
            setSelectedInterview(null);
        } catch (error) {
            console.error("Error deleting interview:", error);
        }
    };

    const openPopup = (interview) => {
        setSelectedInterview(interview);
        fetchNotes(interview.id);
    };

    const closePopup = () => {
        setSelectedInterview(null);
        setNotes([]);
    };

    const openDeletePopup = (interview) => {
        setShowDeletePopup(true);
        setSelectedInterview(interview);
    };

    const closeDeletePopup = () => {
        setSelectedInterview(null);
        setShowDeletePopup(false);
        setSelectedInterview(null);
    };

    const handleInviteSuccess = () => {
        setShowInviteForm(false);
        alert("Invitation sent successfully!");
    };


    const handleEditClick = (field) => {
        setEditingField(field);
        setUpdatedValue(accountDetails[field]);
    };

    const handleSave = async () => {
        try {
            await api.put("/api/employer/profile/", { [editingField]: updatedValue });
            setAccountDetails({ ...accountDetails, [editingField]: updatedValue });
            setEditingField(null);
        } catch (error) {
            console.error("Error updating account details:", error);
        }
    };

    const handlePasswordChange = async () => {
        try {
            const response = await api.put("/api/user/password/", passwordData);
            setPasswordMessage(response.data.message);
            setTimeout(() => setPasswordMessage(""), 3000);
            setPasswordData({ current_password: "", new_password: "", confirm_password: "" });
        } catch (error) {
            setPasswordMessage(error.response.data.error);
            setTimeout(() => setPasswordMessage(""), 3000);
        }
    };

    return (
        <div className="dashboard-container-employer">
            <div className="dashboard-header">
                <h2>Dashboard</h2>
            </div>

            <div className="account-details">
                <h2>Account Details</h2>
                {accountDetails ? (
                    <div className="details">
                        <p><strong>Company:</strong> {accountDetails.company_name}</p>
                        {["name", "email", "industry", "location", "website", "phone_number", "company_description"].map((field) => (
                            <p key={field}>
                            <strong>{field.replace("_", " ").charAt(0).toUpperCase() + field.replace("_", " ").slice(1)}: </strong>
                                {editingField === field ? (
                                    <>
                                        <input
                                            type="text"
                                            value={updatedValue}
                                            onChange={(e) => setUpdatedValue(e.target.value)}
                                        />
                                        <button className="save-button-1" onClick={handleSave}>Save</button>
                                    </>
                                ) : (
                                    <>
                                        {accountDetails[field] || " N/A"}
                                        <CiEdit
                                            size={18}
                                            onClick={() => handleEditClick(field)}
                                            className="edit-icon"
                                        />
                                    </>
                                )}
                            </p>
                        ))}
                        <p><strong>Send a invitation to create a new account for Interviewer:</strong></p>
                        <button className="invite-button" onClick={handleOpenForm}>Invite Interviewer</button>
                        {showInviteForm && (
                            <InviteInterviewerForm
                                onClose={handleCloseForm}
                                onSuccess={handleInviteSuccess}
                            />
                    )}
                    </div>
                ) : (
                    <p>Loading account details...</p>
                )}
                <button className="change-password-button" onClick={() => setShowChangePassword(!showChangePassword)}>
                    <FaLock /> Change Password
                </button>

                {showChangePassword && (
                    <div className="change-password-form">
                        <input
                            type="password"
                            placeholder="Current Password"
                            value={passwordData.current_password}
                            onChange={(e) => setPasswordData({ ...passwordData, current_password: e.target.value })}
                        />
                        <input
                            type="password"
                            placeholder="New Password"
                            value={passwordData.new_password}
                            onChange={(e) => setPasswordData({ ...passwordData, new_password: e.target.value })}
                        />
                        <input
                            type="password"
                            placeholder="Confirm New Password"
                            value={passwordData.confirm_password}
                            onChange={(e) => setPasswordData({ ...passwordData, confirm_password: e.target.value })}
                        />
                        <button className="save-password-button" onClick={handlePasswordChange}>Update Password</button>
                        {passwordMessage && <p className="password-message">{passwordMessage}</p>}
                    </div>
                )}
            </div>

            <h2>Scheduled Interviews</h2>
            <div className="interviews-list">
                {currentInterviews.length > 0 ? (
                    currentInterviews.map((interview) => (
                        <div key={interview.id} className="interview-item">
                            <div className="interview-card" onClick={() => openPopup(interview)}>
                                <p><strong>Candidate:</strong> {interview.candidate_name}</p>
                                <p><strong>Job Title:</strong> {interview.job_title}</p>
                            </div>
                            <button
                                className="del-button"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    openDeletePopup(interview);
                                }}
                            >
                                Delete
                            </button>
                        </div>
                    ))
                ) : (
                    <p>No interviews scheduled.</p>
                )}
            </div>

            <div className="pagination">
                {Array.from({ length: Math.ceil(interviews.length / interviewsPerPage) }, (_, index) => (
                    <button key={index + 1} onClick={() => paginate(index + 1)} className={currentPage === index + 1 ? "active" : ""}>
                        {index + 1}
                    </button>
                ))}
            </div>

            {showDeletePopup ? (
                <div className="popup-overlay">
                    <div className="popup-content">
                        <h3>Are you sure you want to delete this scheduled interview?</h3>
                        <p><strong>Candidate:</strong> {selectedInterview?.candidate_name}</p>
                        <p><strong>Job Title:</strong> {selectedInterview?.job_title}</p>
                        <div className="popup-actions">
                            <button onClick={() => handleDeleteInterview(selectedInterview.id)}>Delete</button>
                            <button onClick={closeDeletePopup}>Cancel</button>
                        </div>
                    </div>
                </div>
            ) : selectedInterview ? (
                <div className="popup-overlay">
                    <div className="popup-content">
                        <button className="close-popup" onClick={closePopup}>X</button>
                        <h3>Interview Details</h3>
                        <p><strong>Candidate:</strong> {selectedInterview.candidate_name}</p>
                        <p><strong>Job Title:</strong> {selectedInterview.job_title}</p>
                        {selectedInterview.resume ? (
                            <p>
                                <strong>Resume: </strong>
                                <a href={selectedInterview.resume} target="_blank" rel="noopener noreferrer">
                                    View Resume
                                </a>
                            </p>
                        ) : (
                            <p><strong>Resume:</strong> Not available</p>
                        )}
                        <p><strong>Date:</strong> {selectedInterview.date}</p>
                        <p><strong>Time:</strong> {selectedInterview.time}</p>

                        <div className="notes-section">
                            <h4>Interview Notes</h4>
                            {notes.length > 0 ? (
                                notes.map((note) => {
                                    const createdAt = new Date(note.created_at).toLocaleString();
                                    const updatedAt = new Date(note.updated_at).toLocaleString();
                                    const isUpdated = note.created_at !== note.updated_at;

                                    return (
                                        <div key={note.id} className="note-item">
                                            <p>
                                                <strong>{note.full_name}</strong>: {note.content}
                                            </p>
                                            <small className="note-timestamp">
                                                Created: {createdAt}
                                                {isUpdated && <span> | Last updated: {updatedAt}</span>}
                                            </small>
                                        </div>
                                    );
                                })
                            ) : (
                                <p>No notes available for this interview.</p>
                            )}
                        </div>
                    </div>
                </div>
            ) : null}
        </div>
    );
};

export default DashboardEmployerPage;
