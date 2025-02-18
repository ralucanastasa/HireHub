import React, { useEffect, useState } from "react";
import api from "../api";
import JobApplicationForm from "../components/JobApplicationForm";
import "../styles/CandidatesJobsPage.css";

const CandidateJobsPage = () => {
    const [jobs, setJobs] = useState([]);
    const [allJobs, setAllJobs] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const jobsPerPage = 5;
    const [filters, setFilters] = useState({
        category: [],
        work_type: [],
        level: [],
        employment_type: [],
    });
    const [selectedFilters, setSelectedFilters] = useState({
        category: [],
        work_type: [],
        level: [],
        employment_type: [],
    });
    const [showApplicationForm, setShowApplicationForm] = useState(false);
    const [selectedJob, setSelectedJob] = useState(null);
    const [appliedJobs, setAppliedJobs] = useState([]);

    const indexOfLastJob = currentPage * jobsPerPage;
    const indexOfFirstJob = indexOfLastJob - jobsPerPage;
    const currentJobs = jobs.slice(indexOfFirstJob, indexOfLastJob);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);
    const [showFilters, setShowFilters] = useState(false);


    useEffect(() => {
        getJobs();
        loadAppliedJobs();
    }, []);

    useEffect(() => {
        applyFilters();
    }, [selectedFilters]);

    const getJobs = () => {
        const token = localStorage.getItem("ACCESS_TOKEN");
        api.get("/api/all-jobs/", {
            headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
            setJobs(res.data);
            setAllJobs(res.data);
            calculateFilterCounts(res.data);
        })
        .catch((error) => alert(error));
    };

    const loadAppliedJobs = () => {
        const storedAppliedJobs = JSON.parse(localStorage.getItem("appliedJobs") || "[]");
        setAppliedJobs(storedAppliedJobs);
    };

    const calculateFilterCounts = (jobs) => {
        const counts = {
            category: {},
            work_type: {},
            level: {},
            employment_type: {},
        };
        jobs.forEach((job) => {
            Object.keys(counts).forEach((key) => {
                if (job[key]) {
                    counts[key][job[key]] = (counts[key][job[key]] || 0) + 1;
                }
            });
        });
        setFilters(
            Object.keys(counts).reduce((acc, key) => {
                acc[key] = Object.entries(counts[key]).map(([value, count]) => ({
                    value,
                    count,
                }));
                return acc;
            }, {})
        );
    };

    const recalculateFilterCounts = (filteredJobs) => {
        const counts = {
            category: {},
            work_type: {},
            level: {},
            employment_type: {},
        };

        filteredJobs.forEach((job) => {
            Object.keys(counts).forEach((key) => {
                if (job[key]) {
                    counts[key][job[key]] = (counts[key][job[key]] || 0) + 1;
                }
            });
        });

        setFilters(
            Object.keys(counts).reduce((acc, key) => {
                acc[key] = Object.entries(counts[key]).map(([value, count]) => ({
                    value,
                    count,
                }));
                return acc;
            }, {})
        );
    };

    const toggleFilter = (field, value) => {
        setSelectedFilters((prevFilters) => {
            const updatedFilters = { ...prevFilters };
            if (updatedFilters[field].includes(value)) {
                updatedFilters[field] = updatedFilters[field].filter((v) => v !== value);
            } else {
                updatedFilters[field] = [...updatedFilters[field], value];
            }
            return updatedFilters;
        });
    };

    const applyFilters = () => {
        const filteredJobs = allJobs.filter((job) => {
            return Object.keys(selectedFilters).every((field) => {
                return (
                    selectedFilters[field].length === 0 ||
                    selectedFilters[field].includes(job[field])
                );
            });
        });

        setJobs(filteredJobs);
        recalculateFilterCounts(filteredJobs);
    };

    const handleApply = (job) => {
        setSelectedJob(job);
        setShowApplicationForm(true);
    };

    const handleApplicationSuccess = (jobId) => {
        setShowApplicationForm(false);
        setAppliedJobs((prev) => {
            const updatedAppliedJobs = [...prev, jobId];
            localStorage.setItem("appliedJobs", JSON.stringify(updatedAppliedJobs));
            return updatedAppliedJobs;
        });
        getJobs();
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (showFilters && !event.target.closest(".filter-sidebar") && !event.target.closest(".toggle-filters-btn")) {
                setShowFilters(false);
            }
        };

        document.addEventListener("click", handleClickOutside);
        return () => {
            document.removeEventListener("click", handleClickOutside);
        };
    }, [showFilters]);


    const toggleFilters = () => {
        setShowFilters(!showFilters);
    };

    const capitalizeWords = (text) => {
        return text
            .toLowerCase()
            .replace(/_/g, " ")
            .replace(/\b\w/g, (char) => char.toUpperCase());
    };

    return (
        <div className="jobs-container">
            <div className="main-content-jobs">
                <button className="toggle-filters-btn" onClick={toggleFilters}>
                    {showFilters ? "Hide Filters" : "Show Filters"}
                </button>
                <div className={`filter-sidebar ${showFilters ? "active" : ""}`}>
                    <h3>Filters</h3>
                    {Object.keys(filters).map((field) => (
                        <div key={field} className="filter-group">
                            <h4>{capitalizeWords(field)}</h4>
                            {filters[field].map((filter) => (
                                <label key={filter.value} className="filter-item">
                                    <input
                                        type="checkbox"
                                        checked={selectedFilters[field].includes(filter.value)}
                                        onChange={() => toggleFilter(field, filter.value)}
                                    />
                                    {capitalizeWords(filter.value)} ({filter.count})
                                </label>
                            ))}
                        </div>
                    ))}
                </div>

                <div className="job-list-2">
                    <div className="dashboard-header-4">
                        <h2>Available Jobs</h2>
                    </div>

                    {currentJobs.map((job) => (
                        <div className="job-card" key={job.id}>
                            <h4 className="job-title">{job.title}</h4>
                            <p className="job-company">{job.company_name}</p>
                            <p className="job-location">{job.location}</p>
                            <p className="job-description">{job.description}</p>
                            <p className="job-details">
                                <span>{capitalizeWords(job.category)}</span> |{" "}
                                <span>{capitalizeWords(job.work_type)}</span> |{" "}
                                <span>{capitalizeWords(job.level)}</span> |{" "}
                                <span>{capitalizeWords(job.employment_type)}</span>
                            </p>
                            <p className="job-closing-date">
                                Closing Date: <span>{new Date(job.closing_date).toLocaleDateString()}</span>
                            </p>

                            {appliedJobs.includes(job.id) ? (
                                <button className="applied-button" disabled>
                                    Applied
                                </button>
                            ) : (
                                <button className="apply-button" onClick={() => handleApply(job)}>
                                    Apply to this job
                                </button>
                            )}
                        </div>
                    ))}
                    <div className="pagination">
                        {Array.from({ length: Math.ceil(jobs.length / jobsPerPage) }, (_, index) => (
                            <button key={index + 1} onClick={() => paginate(index + 1)} className={currentPage === index + 1 ? "active" : ""}>
                                {index + 1}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {showApplicationForm && (
                <JobApplicationForm
                    job={selectedJob}
                    onClose={() => setShowApplicationForm(false)}
                    onSuccess={() => handleApplicationSuccess(selectedJob.id)}
                />
            )}
        </div>
    );
};

export default CandidateJobsPage;
