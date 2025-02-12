import React, { useEffect, useState } from "react";
import api from "../api";
import { FaEdit, FaLock, FaSave, FaTrash } from "react-icons/fa";
import "../styles/DashboardInterviewerPage.css";

const DashboardInterviewerPage = () => {
    const [interviews, setInterviews] = useState([]);
    const [selectedInterview, setSelectedInterview] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const interviewsPerPage = 5;
    const [notes, setNotes] = useState([]);
    const [newNote, setNewNote] = useState("");
    const [editingNoteId, setEditingNoteId] = useState(null);
    const [message, setMessage] = useState("");
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

    useEffect(() => {
        fetchInterviews();
        fetchAccountDetails();
    }, []);

    const fetchInterviews = () => {
        api.get("/api/interviewer/interviews/")
            .then((response) => setInterviews(response.data))
            .catch((error) => console.error("Error fetching interviews:", error));
    };

    const fetchAccountDetails = () => {
        api.get("/api/interviewer/profile/")
            .then((response) => setAccountDetails(response.data))
            .catch((error) => console.error("Error fetching account details:", error));
    };

    const fetchNotes = (interviewId) => {
        api.get(`/api/interviews/${interviewId}/notes/`)
            .then((response) => setNotes(response.data))
            .catch((error) => console.error("Error fetching notes:", error));
    };

    const handleEditClick = (field) => {
        setEditingField(field);
        setUpdatedValue(accountDetails[field]);
    };

    const handleSaveProfile = async () => {
        try {
            await api.put("/api/interviewer/profile/", { [editingField]: updatedValue });
            setAccountDetails({ ...accountDetails, [editingField]: updatedValue });
            setEditingField(null);
        } catch (error) {
            console.error("Error updating profile:", error);
        }
    };

    const handleSaveNote = () => {
        if (editingNoteId) {
            // Update existing note
            api.patch(`/api/notes/${editingNoteId}/`, { content: newNote })
                .then(() => {
                    setMessage("Note updated successfully!");
                    fetchNotes(selectedInterview.id);
                    resetNoteForm();
                })
                .catch(() => setMessage("Failed to update the note."));
        } else {
            // Create new note
            api.post(`/api/interviews/${selectedInterview.id}/notes/`, { content: newNote })
                .then(() => {
                    setMessage("Note saved successfully!");
                    fetchNotes(selectedInterview.id);
                    resetNoteForm();
                })
                .catch(() => setMessage("Failed to save the note."));
        }
    };

    const handleEditNote = (note) => {
        setNewNote(note.content);
        setEditingNoteId(note.id);
    };

    const handleDeleteNote = (noteId) => {
        api.delete(`/api/notes/${noteId}/`)
            .then(() => {
                setMessage("Note deleted successfully!");
                fetchNotes(selectedInterview.id);
            })
            .catch(() => setMessage("Failed to delete the note."));
    };

    const resetNoteForm = () => {
        setNewNote("");
        setEditingNoteId(null);
        setTimeout(() => setMessage(""), 3000);
    };

    const openPopup = (interview) => {
        setSelectedInterview(interview);
        fetchNotes(interview.id);
    };

    const closePopup = () => {
        setSelectedInterview(null);
        setNotes([]);
        resetNoteForm();
    };

    const handlePasswordChange = async () => {
        try {
            const response = await api.put("/api/user/password/", passwordData);
            setPasswordMessage(response.data.message);
            resetPasswordForm();
        } catch (error) {
            setPasswordMessage(error.response.data.error);
        }
    };

    const resetPasswordForm = () => {
        setPasswordData({ current_password: "", new_password: "", confirm_password: "" });
        setTimeout(() => setPasswordMessage(""), 3000);
    };

    const indexOfLastInterview = currentPage * interviewsPerPage;
    const indexOfFirstInterview = indexOfLastInterview - interviewsPerPage;
    const currentInterviews = interviews.slice(indexOfFirstInterview, indexOfLastInterview);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <div className="dashboard-interviewer-container">
            <div className="dashboard-header">
                <h2>Dashboard</h2>
            </div>

            <div className="account-details">
                <h2>Account Details</h2>
                {accountDetails ? (
                    <div className="details">
                        <p><strong>Company:</strong> {accountDetails.company_name}</p>
                        {["name", "email", "phone", "location"].map((field) => (
                            <p key={field}>
                                <strong>{field.charAt(0).toUpperCase() + field.slice(1)}: </strong>
                                {editingField === field ? (
                                    <>
                                        <input
                                            type="text"
                                            value={updatedValue}
                                            onChange={(e) => setUpdatedValue(e.target.value)}
                                        />
                                        <button className="save-button-1" onClick={handleSaveProfile}>
                                            <FaSave /> Save
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        {accountDetails[field] || "N/A"}
                                        <FaEdit
                                            className="edit-icon"
                                            onClick={() => handleEditClick(field)}
                                        />
                                    </>
                                )}
                            </p>
                        ))}
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
                ) : (
                    <p>Loading account details...</p>
                )}

            </div>

            <h2>Scheduled Interviews</h2>
            <div className="interviews-list-2">
                {currentInterviews.length > 0 ? (
                    currentInterviews.map((interview) => (
                        <div key={interview.id} className="interview-card-2" onClick={() => openPopup(interview)}>
                            <p><strong>Candidate:</strong> {interview.candidate_name}</p>
                            <p><strong>Job Title:</strong> {interview.job_title}</p>
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

            {selectedInterview && (
                <div className="popup-overlay">
                    <div className="popup-content">
                        <button className="close-popup" onClick={closePopup}>X</button>
                        <h3>Interview Details</h3>
                        <p><strong>Candidate:</strong> {selectedInterview.candidate_name}</p>
                        <p><strong>Job Title:</strong> {selectedInterview.job_title}</p>
                        <p><strong>Level:</strong> {selectedInterview.job_level}</p>
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
                            <h4>Notes</h4>
                            {notes.map((note) => (
                                <div key={note.id} className="note-item">
                                    <p><strong>{note.full_name}</strong>: {note.content}</p>
                                    <div className="note-actions">
                                        <button onClick={() => handleEditNote(note)}><FaEdit /></button>
                                        <button onClick={() => handleDeleteNote(note.id)}><FaTrash /></button>
                                    </div>
                                </div>
                            ))}

                            <textarea
                                placeholder="Add or edit your note here..."
                                value={newNote}
                                onChange={(e) => setNewNote(e.target.value)}
                            />
                            <button onClick={handleSaveNote}>
                                {editingNoteId ? "Update Note" : "Save Note"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {message && <p className="message">{message}</p>}
        </div>
    );
};

export default DashboardInterviewerPage;
