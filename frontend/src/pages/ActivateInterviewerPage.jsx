import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ActivateAccountForm from '../components/ActivateAccountForm';
import "../styles/ActivateInterviewerPage.css";

const ActivateInterviewerPage = () => {
    const [activationSuccess, setActivationSuccess] = useState(false);
    const navigate = useNavigate();

    const handleActivationSuccess = () => {
        setActivationSuccess(true);
        setTimeout(() => {
            navigate('/login');
        }, 2000);
    };

    return (
        <div className="activate-interviewer-page">
            <div className="content">
                <h1>Activate Your Account</h1>
                <p>Please fill in the required details to complete your account activation.</p>
                <ActivateAccountForm onSuccess={handleActivationSuccess} />
                {activationSuccess && <p className="success-message">Account activated successfully! Redirecting to login...</p>}
            </div>
        </div>
    );
};

export default ActivateInterviewerPage;
