import React, { useState, useRef, useEffect } from 'react';
import api from '../api';
import "../styles/JobApplicationForm.css";

const JobApplicationForm = ({ job, onClose, onSuccess }) => {
    const [applicantName, setApplicantName] = useState('');
    const [applicantEmail, setApplicantEmail] = useState('');
    const [resume, setResume] = useState(null);
    const [useExistingResume, setUseExistingResume] = useState(false);
    const [existingResume, setExistingResume] = useState(null);
    const [loadingResume, setLoadingResume] = useState(false);

    const formContainerRef = useRef(null);

    useEffect(() => {
        const handleOutsideClick = (event) => {
            if (formContainerRef.current && !formContainerRef.current.contains(event.target)) {
                onClose();
            }
        };

        document.addEventListener("mousedown", handleOutsideClick);
        return () => document.removeEventListener("mousedown", handleOutsideClick);
    }, []);

    useEffect(() => {
        api.get("/api/candidate/profile/")
            .then(response => {
                if (response.data.resume) {
                    setExistingResume(response.data.resume);
                }
            })
            .catch(error => console.error("Error fetching resume:", error));
    }, []);

    const fetchExistingResumeAsBlob = async (url) => {
        setLoadingResume(true);
        try {
            const response = await fetch(url);
            const blob = await response.blob();
            setLoadingResume(false);
            return blob;
        } catch (error) {
            console.error("Error fetching resume as Blob:", error);
            setLoadingResume(false);
            return null;
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('name', applicantName);
        formData.append('email', applicantEmail);

        if (useExistingResume && existingResume) {
            const resumeBlob = await fetchExistingResumeAsBlob(existingResume);
            if (resumeBlob) {
                formData.append('resume', resumeBlob, 'resume.pdf');
            } else {
                alert("Failed to load existing resume.");
                return;
            }
        } else if (resume) {
            formData.append('resume', resume);
        } else {
            alert("Please upload a resume.");
            return;
        }

        try {
            const response = await api.post(`/api/jobs/${job.id}/application/`, formData);
            if (response.status === 201) {
                onSuccess();
                alert('Application submitted successfully!');
            }
        } catch (error) {
            console.error('Error applying for job:', error);
            alert('Failed to submit application.');
        }
    };

    return (
        <div className="form-bg-app-job">
            <div className="form-container-app-job" ref={formContainerRef}>
                <div className="title">
                    <h1>Apply for {job.title}</h1>
                </div>
                <div className="body">
                    <form onSubmit={handleSubmit}>
                        <label htmlFor="applicantName">Name:</label>
                        <input
                            type="text"
                            id="applicantName"
                            required
                            value={applicantName}
                            onChange={(e) => setApplicantName(e.target.value)}
                        />

                        <label htmlFor="applicantEmail">Email:</label>
                        <input
                            type="email"
                            id="applicantEmail"
                            required
                            value={applicantEmail}
                            onChange={(e) => setApplicantEmail(e.target.value)}
                        />

                        <label>Resume:</label>
                        {!useExistingResume ? (
                            <input
                                type="file"
                                id="resume"
                                required={!useExistingResume}
                                accept=".pdf"
                                onChange={(e) => setResume(e.target.files?.[0] || null)}
                            />
                        ) : (
                            <p className="selected-resume">
                                Using existing resume: <a href={existingResume} target="_blank" rel="noopener noreferrer">View Resume</a>
                            </p>
                        )}

                        {existingResume && (
                            <>
                                <div className="or-divider">or</div>
                                <button
                                    type="button"
                                    className="use-resume-btn"
                                    onClick={() => setUseExistingResume(!useExistingResume)}
                                >
                                    {useExistingResume ? "Upload a new resume" : "Use resume from account"}
                                </button>
                            </>
                        )}

                        <div className="buttons-container">
                            <button type="button" id="closeBtn" onClick={onClose}>Cancel</button>
                            <input type="submit" value="Submit" />
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default JobApplicationForm;
