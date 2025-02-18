import React, { useEffect, useState } from 'react';
import api from '../api';
import "../styles/ApplicationsPage.css";
import ApplicationModal from "../components/ApplicationModal.jsx";
import SetInterviewForm from "../components/SetInterviewForm";

const ApplicationsPage = () => {
    const [jobs, setJobs] = useState([]);
    const [applications, setApplications] = useState({});
    const [currentPage, setCurrentPage] = useState(1);
    const applicationsPerPage = 5;
    const [selectedJobId, setSelectedJobId] = useState(null);
    const [selectedApplication, setSelectedApplication] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSetInterviewOpen, setIsSetInterviewOpen] = useState(false);

    const indexOfLastJob = currentPage * applicationsPerPage;
    const indexOfFirstJob = indexOfLastJob - applicationsPerPage;
    const currentApplications = jobs.slice(indexOfFirstJob, indexOfLastJob);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);
    const [isRejectionModalOpen, setIsRejectionModalOpen] = useState(false);
    const [rejectionReason, setRejectionReason] = useState("");
    const [selectedRejectionApplication, setSelectedRejectionApplication] = useState(null);


    useEffect(() => {
        fetchJobs();
    }, []);

    useEffect(() => {
        checkScheduledInterviews();
    }, [applications]);

    const handleStatusChange = (app, newStatus) => {
        if (newStatus === "rejected") {
            openRejectionModal(app);
        } else {
            api.patch(`/api/applications/${app.id}/`, { status: newStatus })
                .then(() => {
                    updateApplicationStatus(app.id, newStatus);
                })
                .catch((error) => {
                    console.error('Error updating application status:', error);
                });
        }
    };

    const openRejectionModal = (app) => {
        setSelectedRejectionApplication(app);
        setIsRejectionModalOpen(true);
    };

    const handleRejectApplication = () => {
        if (!rejectionReason.trim()) {
            alert("Please provide a rejection reason.");
            return;
        }

        api.patch(`/api/applications/${selectedRejectionApplication.id}/`, {
            status: "rejected",
            rejection_reason: rejectionReason
        })
        .then(() => {
            updateApplicationStatus(selectedRejectionApplication.id, "rejected", rejectionReason);
            setIsRejectionModalOpen(false);
            setRejectionReason(""); // Resetăm motivul
            setSelectedRejectionApplication(null);
        })
        .catch((error) => {
            console.error("Error updating application status:", error);
        });
    };

    const updateApplicationStatus = (appId, newStatus, rejectionReason = null) => {
        setApplications((prevApplications) => {
            const updatedApplications = { ...prevApplications };
            for (const jobId in updatedApplications) {
                updatedApplications[jobId] = updatedApplications[jobId].map((app) =>
                    app.id === appId ? { ...app, status: newStatus, rejection_reason: rejectionReason } : app
                );
            }
            return updatedApplications;
        });
    };

    const fetchJobs = () => {
        api.get('/api/jobs/')
            .then((response) => {
                setJobs(response.data);
                fetchApplications(response.data);
            })
            .catch((error) => {
                console.error('Error fetching jobs:', error);
            });
    };

    const fetchApplications = (jobs) => {
        const promises = jobs.map((job) => {
            return api
                .get(`/api/jobs/${job.id}/applications/`)
                .then((response) => {
                    return {
                        jobId: job.id,
                        applications: response.data,
                    };
                })
                .catch((error) => {
                    console.error(`Error fetching applications for job ${job.id}:`, error);
                    return { jobId: job.id, applications: [] };
                });
        });

        Promise.all(promises)
            .then((results) => {
                const apps = {};
                results.forEach((result) => {
                    apps[result.jobId] = result.applications;
                });
                setApplications(apps);
            })
            .catch((error) => {
                console.error('Error fetching applications:', error);
            });
    };

    const checkScheduledInterviews = () => {
        const allApplications = Object.values(applications).flat();

        allApplications.forEach((application) => {
            if (application.interview_scheduled) {
                api.get(`/api/applications/${application.id}/interview/`)
                    .then((response) => {
                        if (!response.data.interview_exists) {
                            updateApplicationInterviewStatus(application.id, false);
                        }
                    })
                    .catch((error) => {
                        console.error(`Error checking interview for application ${application.id}:`, error);
                    });
            }
        });
    };

    const updateApplicationInterviewStatus = (appId, interviewScheduled) => {
        setApplications((prevApplications) => {
            const updatedApplications = { ...prevApplications };
            for (const jobId in updatedApplications) {
                updatedApplications[jobId] = updatedApplications[jobId].map((app) =>
                    app.id === appId ? { ...app, interview_scheduled: interviewScheduled } : app
                );
            }
            return updatedApplications;
        });
    };

    const openModal = (jobId) => {
        setSelectedJobId(jobId);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const openSetInterview = (application) => {
        setSelectedApplication(application);
        setIsSetInterviewOpen(true);
    };

    const closeSetInterview = () => {
        setIsSetInterviewOpen(false);
    };

    return (
        <div className="applications-container">
            <div className="dashboard-header">
                <h2>Job Applications</h2>
            </div>
            <div className="applications-list">
                {currentApplications.map((job) => (
                    <div className="app-card" key={job.id}>
                        <h3 className="app-title">{job.title} - {job.level}</h3>
                        <h4>Applications:</h4>
                        {applications[job.id] && applications[job.id].length > 0 ? (
                            <>
                                <ul className="applications">
                                    {applications[job.id].slice(0, 2).map((app) => (
                                        <li key={app.id} className="application-item">
                                            <strong>Name:</strong> {app.name} <br />
                                            <strong>Email:</strong> {app.email} <br />
                                            <strong>Resume:</strong>
                                            <a href={app.resume} target="_blank" rel="noopener noreferrer"> View Resume</a>
                                            <div className="application-actions">
                                                {app.status === 'pending' ? (
                                                    <select onChange={(e) => handleStatusChange(app, e.target.value)} value={app.status}>
                                                        <option value="pending">Pending</option>
                                                        <option value="accepted">Accept</option>
                                                        <option value="rejected">Reject</option>
                                                    </select>
                                                ) : (
                                                    <span>Status: {app.status.charAt(0).toUpperCase() + app.status.slice(1)}</span>
                                                )}
                                            </div>
                                            {app.status === 'accepted' && (
                                                <button
                                                    onClick={() => openSetInterview(app)}
                                                    className="set-interview-button"
                                                    disabled={app.interview_scheduled}
                                                >
                                                    {app.interview_scheduled ? "Scheduled Interview" : "Set Interview"}
                                                </button>
                                            )}
                                        </li>
                                    ))}
                                </ul>
                                {applications[job.id].length > 2 && (
                                    <button className="see-more-button" onClick={() => openModal(job.id)}>See more applications</button>
                                )}
                            </>
                        ) : (
                            <p>No applications yet.</p>
                        )}
                    </div>
                ))}
                <div className="pagination">
                    {Array.from({ length: Math.ceil(jobs.length / applicationsPerPage) }, (_, index) => (
                        <button key={index + 1} onClick={() => paginate(index + 1)} className={currentPage === index + 1 ? "active" : ""}>
                            {index + 1}
                        </button>
                    ))}
                </div>
            </div>
            <ApplicationModal
                isOpen={isModalOpen}
                onClose={closeModal}
                applications={applications[selectedJobId] || []}
                handleStatusChange={handleStatusChange}
            />
            {isSetInterviewOpen && (
                <SetInterviewForm application={selectedApplication} onClose={closeSetInterview} />
            )}
            {isRejectionModalOpen && (
                <div className="modal-overlay-rejected-app">
                    <div className="modal-content-rejected-app">
                        <h3>Enter Rejection Reason</h3>
                        <textarea
                            placeholder="Write the reason for rejection..."
                            value={rejectionReason}
                            onChange={(e) => setRejectionReason(e.target.value)}
                            rows={4}
                        />
                        <div className="modal-actions-rejected-app">
                            <button className="submit-button-rejected-app" onClick={handleRejectApplication}>Submit</button>
                            <button className="cancel-button-rejected-app" onClick={() => setIsRejectionModalOpen(false)}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
};

export default ApplicationsPage;
