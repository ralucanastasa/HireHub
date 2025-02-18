import React, { useEffect, useState, useRef } from "react";
import api from "../api.js";
import "../styles/JobForm.css";
import { ACCESS_TOKEN } from "../constants.js";

function JobForm({ closeForm, editingJob }) {
    const [title, setTitle] = useState(editingJob ? editingJob.title : "");
    const [companyName, setCompanyName] = useState(editingJob ? editingJob.company_name : "");
    const [location, setLocation] = useState(editingJob ? editingJob.location : "");
    const [description, setDescription] = useState(editingJob ? editingJob.description : "");
    const [workType, setWorkType] = useState(editingJob ? editingJob.work_type : "");
    const [level, setLevel] = useState(editingJob ? editingJob.level : "");
    const [employmentType, setEmploymentType] = useState(editingJob ? editingJob.employment_type : "");
    const [closingDate, setClosingDate] = useState(editingJob ? editingJob.closing_date : "");
    const [category, setCategory] = useState(editingJob ? editingJob.category : "");

    const formContainerRef = useRef(null);

    useEffect(() => {
        if (editingJob) {
            setTitle(editingJob.title);
            setCompanyName(editingJob.company_name);
            setLocation(editingJob.location);
            setDescription(editingJob.description);
            setWorkType(editingJob.work_type);
            setLevel(editingJob.level);
            setEmploymentType(editingJob.employment_type);
            setClosingDate(editingJob.closing_date);
            setCategory(editingJob.category);
        }

        const handleOutsideClick = (event) => {
            if (formContainerRef.current && !formContainerRef.current.contains(event.target)) {
                closeForm(false);
            }
        };

        document.addEventListener("mousedown", handleOutsideClick);

        return () => {
            document.removeEventListener("mousedown", handleOutsideClick);
        };
    }, [editingJob]);

    const createOrUpdateJob = (e) => {
        e.preventDefault();
        const token = localStorage.getItem(ACCESS_TOKEN);

        if (!title || !companyName || !location || !description || !workType || !level || !employmentType || !closingDate || !category) {
            alert("Please fill in all fields.");
            return;
        }

        const formattedClosingDate = closingDate.split("T")[0];
        const jobData = {
            title,
            company_name: companyName,
            description,
            location,
            work_type: workType,
            level,
            employment_type: employmentType,
            closing_date: formattedClosingDate,
            category,
        };

        const request = editingJob
            // ? api.put(`/api/jobs/update/${editingJob.id}/`, jobData, { headers: { Authorization: `Bearer ${token}` } })
            ? api.put(`/api/jobs/${editingJob.id}/`, jobData, { headers: { Authorization: `Bearer ${token}` } })
            : api.post("/api/jobs/", jobData, { headers: { Authorization: `Bearer ${token}` } });

        request
            .then((res) => {
                if (editingJob && res.status === 200) {
                    alert("Job updated successfully!");
                } else if (!editingJob && res.status === 201) {
                    alert("Job added successfully!");
                }
                closeForm();
            })
            .catch((error) => {
                const errorMessage = error.response?.data?.detail || "An error occurred";
                alert(errorMessage);
            });
    };


    return (
        <div className="form-bg-job">
            <div className="form-container-job" ref={formContainerRef}>
                <div className="title">
                    <h1>{editingJob ? "Edit Job" : "Add a Job"}</h1>
                </div>
                <div className="body">
                    <form onSubmit={createOrUpdateJob}>
                        <label htmlFor="category">Category:</label>
                        <select value={category} onChange={(e) => setCategory(e.target.value)} required>
                            <option value="">Select a category</option>
                            <option value="hr">HR</option>
                            <option value="it">IT</option>
                            <option value="accounting">Accounting</option>
                            <option value="marketing">Marketing</option>
                            <option value="sales">Sales</option>
                            <option value="administration">Administration</option>
                        </select>

                        <label htmlFor="title">Title:</label>
                        <input type="text" id="title" required onChange={(e) => setTitle(e.target.value)} value={title} />

                        <label htmlFor="companyName">Company Name:</label>
                        <input type="text" id="companyName" required onChange={(e) => setCompanyName(e.target.value)} value={companyName} />

                        <label htmlFor="location">Location:</label>
                        <input type="text" id="location" required onChange={(e) => setLocation(e.target.value)} value={location} />

                        <label htmlFor="description">Description:</label>
                        <textarea id="description" required onChange={(e) => setDescription(e.target.value)} value={description} />

                        <label htmlFor="workType">Work Type:</label>
                        <select value={workType} onChange={(e) => setWorkType(e.target.value)} required>
                            <option value="">Select work type:</option>
                            <option value="full_remote">Full Remote</option>
                            <option value="hybrid">Hybrid</option>
                        </select>

                        <label htmlFor="level">Level:</label>
                        <select value={level} onChange={(e) => setLevel(e.target.value)} required>
                            <option value="">Select level:</option>
                            <option value="apprentice">Apprentice</option>
                            <option value="junior">Junior</option>
                            <option value="intermediate">Intermediate</option>
                            <option value="senior">Senior</option>
                        </select>

                        <label htmlFor="employmentType">Employment Type:</label>
                        <select value={employmentType} onChange={(e) => setEmploymentType(e.target.value)} required>
                            <option value="">Select employment type:</option>
                            <option value="full_time">Full Time</option>
                            <option value="part_time">Part Time</option>
                            <option value="internship">Internship</option>
                        </select>

                        <label htmlFor="closingDate">Closing Date:</label>
                        <input type="date" id="closingDate" required onChange={(e) => setClosingDate(e.target.value)} value={closingDate} />

                        <div className="buttons-container">
                            <button type="button" id="closeBtn" onClick={() => closeForm(false)}>Cancel</button>
                            <input type="submit" value="Submit" />
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default JobForm;
