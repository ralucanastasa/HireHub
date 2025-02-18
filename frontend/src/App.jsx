import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import HomePage from "./pages/HomePage.jsx";
import NotFound from "./pages/NotFound.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import Navbar from "./components/Navbar.jsx";
import AddJobPage from "./pages/AddJobPage.jsx";
import "./App.css";
import CandidateJobsPage from "./pages/CandidatesJobsPage.jsx";
import ApplicationsPage from "./pages/ApplicationsPage.jsx";
import DashboardCandidatePage from "./pages/DashboardCandidatePage.jsx";
import DashboardInterviewerPage from "./pages/DashboardInterviewerPage.jsx";
import DashboardEmployerPage from "./pages/DashboardEmployerPage.jsx";
import ActivateInterviewerPage from "./pages/ActivateInterviewerPage.jsx";

function Logout() {
  localStorage.clear()
  return <Navigate to="/login" />
}

function RegisterAndLogout() {
  localStorage.clear()
  return <RegisterPage />
}

function App() {
    return (
        <BrowserRouter>
            <Navbar />
            <div className="main-content">
                <Routes>
                    <Route path="/add-job" element={<ProtectedRoute><AddJobPage /></ProtectedRoute>} />
                    <Route path="/" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
                    <Route path="/login" element={<ProtectedRoute><LoginPage /></ProtectedRoute>} />
                    <Route path="/logout" element={<ProtectedRoute><Logout /></ProtectedRoute>} />
                    <Route path="/register" element={<ProtectedRoute><RegisterAndLogout /></ProtectedRoute>} />
                    <Route path="/candidate-jobs" element={<ProtectedRoute><CandidateJobsPage /></ProtectedRoute>} />
                    <Route path="/applications" element={<ProtectedRoute><ApplicationsPage /></ProtectedRoute>} />
                    <Route path="/candidate-dashboard" element={<ProtectedRoute><DashboardCandidatePage /></ProtectedRoute>} />
                    <Route path="/employer-dashboard" element={<ProtectedRoute><DashboardEmployerPage /></ProtectedRoute>} />
                    <Route path="/interviewer-dashboard" element={<ProtectedRoute><DashboardInterviewerPage /></ProtectedRoute>} />
                    <Route path="/account/:token" element={<ActivateInterviewerPage />} />
                    <Route path="*" element={<NotFound />}></Route>
                </Routes>
            </div>
        </BrowserRouter>
    )
}

export default App;
