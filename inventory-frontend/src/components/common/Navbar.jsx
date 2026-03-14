import React from 'react';
import { Link } from 'react-router-dom';
import { Orbit, UserPlus, LogIn } from 'lucide-react';


const Navbar = () => {
    return (
        <nav style={navStyle}>
            <div style={logoSection} onClick={() => window.location.href = '/'}>
                <Orbit color="#3498db" size={35} />
                <span className="text-3xl font-black tracking-tight text-slate-800">Shop<span className="text-blue-800">Sphere</span></span>
            </div>

            <div style={linksSection}>
                <Link to="/login" style={loginBtn}>
                    <LogIn size={18} /> Login
                </Link>
                <Link to="/signup" style={registerBtn}>
                    <UserPlus size={18} /> Sign Up
                </Link>
            </div>
        </nav>
    );
};

// --- Styles ---
const navStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '15px 5%',
    backgroundColor: '#ffffff',
    boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
    position: 'sticky',
    top: 0,
    zIndex: 1000
};

const logoSection = {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    cursor: 'pointer'
};

const linksSection = {
    display: 'flex',
    gap: '20px'
};

const loginBtn = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    textDecoration: 'none',
    color: '#0000CD',
    fontWeight: '600',
    padding: '8px 16px',
    borderRadius: '8px',
    transition: '0.3s'
};

const registerBtn = {
    ...loginBtn,
    backgroundColor: '#0000CD',
    color: '#ffffff'
};

export default Navbar;