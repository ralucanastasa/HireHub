import React, { useEffect, useState } from "react";
import api from "../api";
import {FaEdit, FaSave, FaUpload, FaFilePdf, FaLock} from "react-icons/fa";
import "../styles/DashboardCandidatePage.css";

const DashboardCandidatePage = () => {
    const [applications, setApplications] = useState([]);
    const [accountDetails, setAccountDetails] = useState(null);
    const [editingField, setEditingField] = useState(null);
    const [updatedValue, setUpdatedValue] = useState("");
    const [resumeFile, setResumeFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [showChangePassword, setShowChangePassword] = useState(false);
    const [passwordData, setPasswordData] = useState({
        current_password: "",
        new_password: "",
        confirm_password: "",
    });
    const [passwordMessage, setPasswordMessage] = useState("");

    useEffect(() => {
        fetchApplications();
        fetchAccountDetails();
    }, []);

    const fetchApplications = () => {
        api.get('/api/user/applications/')
            .then(response => setApplications(response.data))
            .catch(error => console.error('Error fetching user applications:', error));
    };

    const fetchAccountDetails = () => {
        api.get('/api/candidate/profile/')
            .then(response => setAccountDetails(response.data))
            .catch(error => console.error('Error fetching account details:', error));
    };

    const handleEditClick = (field) => {
        setEditingField(field);
        setUpdatedValue(accountDetails[field]);
    };

    const handleSave = async () => {
        try {
            await api.put("/api/candidate/profile/", { [editingField]: updatedValue });
            setAccountDetails({ ...accountDetails, [editingField]: updatedValue });
            setEditingField(null);
        } catch (error) {
            console.error("Error updating profile:", error);
        }
    };

    const handleResumeUpload = async () => {
        if (!resumeFile) return;
        setUploading(true);
        const formData = new FormData();
        formData.append("resume", resumeFile);
        try {
            await api.put("/api/candidate/profile/", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            await fetchAccountDetails();
            setResumeFile(null);
        } catch (error) {
            console.error("Error uploading resume:", error);
        } finally {
            setUploading(false);
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
        <div className="dashboard-container-candidate">
            <div className="dashboard-header-candidate">
                <h2>Dashboard</h2>
            </div>

            <div className="account-details">
                <h2>Account Details</h2>
                {accountDetails ? (
                    <div className="details">
                        <p><strong>Name:</strong> {accountDetails.name}</p>
                        <p><strong>Email:</strong> {accountDetails.email}</p>
                        {["phone", "location"].map((field) => (
                            <p key={field}>
                                <strong>{field.charAt(0).toUpperCase() + field.slice(1)}: </strong>
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
                                        {accountDetails[field] || "N/A"}
                                        <FaEdit
                                            className="edit-icon"
                                            onClick={() => handleEditClick(field)}
                                        />
                                    </>
                                )}
                            </p>
                        ))}

                        <p>
                            <strong>Resume: </strong>
                            {accountDetails.resume ? (
                                <a href={accountDetails.resume} target="_blank" rel="noopener noreferrer" className="resume-link">
                                    <FaFilePdf size={12} className="resume-icon" /> View Resume
                                </a>
                            ) : (
                                <span> No resume uploaded</span>
                            )}
                        </p>
                        <div className="resume-upload">
                            <label htmlFor="resume-upload" className="upload-label">
                                <FaUpload size={12} /> Choose File
                            </label>
                            <input
                                type="file"
                                id="resume-upload"
                                accept=".pdf"
                                onChange={(e) => setResumeFile(e.target.files[0])}
                            />
                            <button className="upload-button" onClick={handleResumeUpload} disabled={uploading || !resumeFile}>
                                <FaUpload size={12} /> {uploading ? "Uploading..." : "Upload Resume"}
                            </button>
                        </div>
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

            <div className="main-content-1">
                <div className="dashboard-left-section">
                    <h3>Applications Status</h3>
                    <ul className="application-status-list">
                        {applications.length > 0 ? (
                            applications.map((app) => (
                                <li key={app.id} className="application-status-item">
                                    <p><strong>Job:</strong> {app.job_title}</p>
                                    <p><strong>Company:</strong> {app.company_name}</p>
                                    <p>
                                        <strong>Status:</strong>
                                        <span className={`status-badge ${app.status}`}>
                                            {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                                        </span>
                                    </p>
                                </li>
                            ))
                        ) : (
                            <p>No applications yet.</p>
                        )}
                    </ul>
                </div>

                <div className="dashboard-right-section">
                    <h3>Interview Schedule</h3>
                    <div className="interview-schedule">
                        {applications.length > 0 ? (
                            applications
                                .filter((app) => app.status === 'accepted')
                                .map((app) => (
                                    <div key={app.id} className="interview-item">
                                        <p><strong>{app.job_title}</strong> | {app.company_name}</p>
                                        {app.interview_scheduled ? (
                                            <p>
                                                <strong>Interview Scheduled: </strong>
                                                An email has been sent with the meeting link.
                                            </p>
                                        ) : (
                                            <p><strong>Status:</strong> Waiting for scheduling interview</p>
                                        )}
                                    </div>
                                ))
                        ) : (
                            <p>No interviews scheduled yet.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardCandidatePage;
