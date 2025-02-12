import React, { useRef } from 'react';
import "../styles/ApplicationModal.css";

const ApplicationModal = ({ isOpen, onClose, applications, handleStatusChange }) => {
    const modalRef = useRef();

    if (!isOpen) return null;

    const handleOverlayClick = (e) => {
        if (modalRef.current && !modalRef.current.contains(e.target)) {
            onClose();
        }
    };

    return (
        <div className="modal-overlay" onClick={handleOverlayClick}>
            <div className="modal-content" ref={modalRef}>
                <button className="modal-close" id="close-button" onClick={onClose}>X</button>
                <h2>All Applications</h2>
                <ul className="modal-applications">
                    {applications.map((app) => (
                        <li key={app.id} className="modal-application-item">
                            <strong>Name:</strong> {app.name} <br />
                            <strong>Email:</strong> {app.email} <br />
                            <strong>Resume:</strong>
                            <a href={app.resume} target="_blank" rel="noopener noreferrer"> View Resume</a>
                            <div className="modal-application-actions">
                                {app.status === 'pending' ? (
                                    <select onChange={(e) => handleStatusChange(app.id, e.target.value)} value={app.status}>
                                        <option value="pending">Pending</option>
                                        <option value="accepted">Accept</option>
                                        <option value="rejected">Reject</option>
                                    </select>
                                ) : (
                                    <span>Status: {app.status ? app.status.charAt(0).toUpperCase() + app.status.slice(1) : 'Pending'}</span>
                                )}
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default ApplicationModal;
