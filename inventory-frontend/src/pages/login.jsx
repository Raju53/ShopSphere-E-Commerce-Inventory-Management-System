import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Orbit } from 'lucide-react';
import '../App.css'

const Login = () => {
    const [credentials, setCredentials] = useState({ username: '', password: '' });
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:8080/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(credentials),
            });

            if (response.ok) {
                const data = await response.json(); // Expecting { token, username, role }
                login(data);
                
                // Redirect based on role
                if (data.role === 'ROLE_ADMIN') navigate('/admin');
                else if (data.role === 'ROLE_SUPPLIER') navigate('/supplier');
                else navigate('/user');
            } else {
                alert("Invalid Credentials");
            }
        } catch (error) {
            console.error("Login Error:", error);
        }
    };

    return (
        <div className="auth-container">
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                <Orbit size={40} color="#3498db" style={{ margin: '0 auto' }} />
                <h2>Welcome to ShopSphere</h2>
                <p>Your one-stop destination for everything.</p>
            </div>
            <form onSubmit={handleSubmit}>
                <input name="username" placeholder="Username" onChange={handleChange} required />
                <input name="password" type="password" placeholder="Password" onChange={handleChange} required />
                <button type="submit" className='btn-primary' style={{ padding: '12px 45%', fontSize: '1.1rem', background: '#3498db', color: 'white', textAlign: 'center' }}>Login</button>
            </form>
            <p style={{ textAlign: 'center', marginTop: '15px' }}>
                New User? <span onClick={() => navigate('/signup')} style={{ color: '#3498db', cursor: 'pointer' }}>SignUp here</span>
            </p>
        </div>
    );
};

export default Login;