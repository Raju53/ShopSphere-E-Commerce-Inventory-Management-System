import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../App.css'

const Signup = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        role: 'ROLE_USER' // Default role
    });
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:8080/api/auth/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                alert("Registration Successful! Please Login.");
                navigate('/login');
            } else {
                const errorData = await response.json();
                alert(`Registration failed: ${errorData.message || 'Check your details'}`);
            }
        } catch (error) {
            console.error("Signup Error:", error);
            alert("Server connection error");
        }
    };

    return (
        <div className="auth-container">
            <h2>Create Account</h2>
            <form onSubmit={handleSubmit}>
                <input name="username" placeholder="Username" onChange={handleChange} required />
                <input name="email" type="email" placeholder="Email" onChange={handleChange} required />
                <input name="password" type="password" placeholder="Password" onChange={handleChange} required />
                
                <label>Register as:</label>
                <select name="role" onChange={handleChange} value={formData.role}>
                    <option value="ROLE_USER">Customer</option>
                    <option value="ROLE_SUPPLIER">Vendor</option>
                </select>
                
                <button type="submit" className="bt-primary" style={{ padding: '12px 42%', fontSize: '20px', background: '#3498db', color: 'white' }}>Sign Up</button>
            </form>
            <p style={{ textAlign: 'center', marginTop: '15px' }}>
                Already have an account? <span onClick={() => navigate('/login')} style={{ color: '#3498db', cursor: 'pointer' }}>Login here</span>
            </p>
        </div>
    );
};

export default Signup;