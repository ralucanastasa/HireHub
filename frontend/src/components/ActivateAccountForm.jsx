import React, { useState } from 'react';
import api from '../api';
import { useParams } from 'react-router-dom';
import '../styles/ActivateAccountForm.css';

const ActivateAccountForm = () => {
    const { token } = useParams();
    console.log("Token from URL:", token);
    const [formData, setFormData] = useState({
        username: '',
        first_name: '',
        last_name: '',
        password: '',
    });
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await api.post(`/api/account/${token}/`, formData);
            setMessage('Account activated successfully!');
        } catch (error) {
            console.error('Error activating account:', error);
            setMessage('An error occurred while activating the account.');
        }
    };

    return (
        <div className="activate-form-container">
            <form className="activate-form" onSubmit={handleSubmit}>
                <h2>Activate Your Account</h2>
                <input
                    type="text"
                    placeholder="Username"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    required
                />
                <input
                    type="text"
                    placeholder="First Name"
                    value={formData.first_name}
                    onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                    required
                />
                <input
                    type="text"
                    placeholder="Last Name"
                    value={formData.last_name}
                    onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required
                />
                <button type="submit">Activate Account</button>
                {message && <p>{message}</p>}
            </form>
        </div>
    );
};

export default ActivateAccountForm;
