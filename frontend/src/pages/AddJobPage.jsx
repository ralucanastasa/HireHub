import React, { useState, useEffect } from "react";
import JobForm from "../components/JobForm.jsx";
import api from "../api.js";
import "../styles/AddJobPage.css";
import { CiEdit } from "react-icons/ci";
import { MdDelete } from "react-icons/md";
import { format } from "date-fns";

function AddJobPage() {
    const [showForm, setShowForm] = useState(false);
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
    const [editingJob, setEditingJob] = useState(null);

    const indexOfLastJob = currentPage * jobsPerPage;
    const indexOfFirstJob = indexOfLastJob - jobsPerPage;
    const currentJobs = jobs.slice(indexOfFirstJob, indexOfLastJob);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);


    useEffect(() => {
        getJobs();
    }, []);

    useEffect(() => {
        applyFilters();
    }, [selectedFilters]);

    const getJobs = () => {
        const token = localStorage.getItem("ACCESS_TOKEN");
        api.get("/api/jobs/", {
            headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
            setJobs(res.data);
            setAllJobs(res.data);
            calculateFilterCounts(res.data);
        })
        .catch((error) => alert(error));
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

    const deleteJob = (id) => {
        const confirmed = window.confirm("Are you sure you want to delete this job?");
        if (!confirmed) return;

        const token = localStorage.getItem("ACCESS_TOKEN");
        api.delete(`/api/jobs/${id}/`, {
            headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
            if (res.status === 204) {
                alert("Job deleted successfully!");
                getJobs();
            } else {
                alert("Failed to delete job.");
            }
        })
        .catch((error) => alert(error));
    };

    const handleEditJob = (job) => {
        setEditingJob(job);
        setShowForm(true);
    };

    const capitalizeWords = (text) => {
        return text
            .toLowerCase()
            .replace(/_/g, " ")
            .replace(/\b\w/g, (char) => char.toUpperCase());
    };


    return (
        <div className="jobs-container">
            <div className="header-actions">
                <button className="open-form" onClick={() => setShowForm(true)}>
                    Add Job
                </button>
            </div>

            {showForm && (
                <JobForm
                    closeForm={() => {
                        setShowForm(false);
                        setEditingJob(null);
                        getJobs();
                    }}
                    editingJob={editingJob}
                />
            )}

            <div className="main-content">
                <div className="filter-sidebar">
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
                    <div className="dashboard-header-3">
                        <h2>Jobs</h2>
                    </div>

                    {currentJobs.map((job) => (
                        <div className="job-card" key={job.id}>
                            <h3 className="job-title">{job.title}</h3>
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
                                Closing Date: <span>{format(new Date(job.closing_date), "dd.MM.yyyy")}</span>
                            </p>
                            <div className="job-actions">
                                <button className="edit-button" onClick={() => handleEditJob(job)}>
                                    <CiEdit size={25} />
                                </button>
                                <button className="delete-button" onClick={() => deleteJob(job.id)}>
                                    <MdDelete size={25} />
                                </button>
                            </div>
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
        </div>
    );
}

export default AddJobPage;
