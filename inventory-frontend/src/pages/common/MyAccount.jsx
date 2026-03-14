import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { User, Phone, MapPin, Cake, Mail, Save, AlertCircle, LayoutDashboard } from 'lucide-react';

const Account = () => {
    const { user } = useAuth();
    const [profile, setProfile] = useState({
        username: '',
        email: '',
        phoneNumber: '',
        address: '',
        dob: ''
    });
    const [loading, setLoading] = useState(true);
    const [errors, setErrors] = useState({}); // To store backend validation errors
    const [successMsg, setSuccessMsg] = useState('');

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const response = await fetch('http://localhost:8080/api/user/profile', {
                headers: { 'Authorization': `Bearer ${user.token}` }
            });
            const data = await response.json();
            setProfile(data);
        } catch (error) {
            console.error("Error fetching profile:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        setErrors({}); // Reset errors before new attempt
        setSuccessMsg('');

        try {
            const response = await fetch('http://localhost:8080/api/user/profile', {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${user.token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(profile)
            });

            if (response.ok) {
                setSuccessMsg('Profile updated successfully!');
                fetchProfile(); // Refresh data
            } else if (response.status === 400) {
                const errorMap = await response.json();
                setErrors(errorMap); // Catch the Map<String, String> from GlobalExceptionHandler
            }
        } catch (error) {
            console.error("Update failed:", error);
        }
    };

    if (loading) return <div style={{ padding: '50px', textAlign: 'center' }}>Loading profile...</div>;

    const getAddressLabel = () => {
        if (user.role === 'ROLE_USER') return 'Shipping Address';
        if (user.role === 'ROLE_SUPPLIER') return 'Warehouse/Business Address';
        return 'Office/Admin Address';
    };

    return (
        <div style={{ padding: '30px', width: '600px', margin: '0 auto' }}>
            <div style={cardStyle}>
                <h2 style={{ marginBottom: '25px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <User color="#3498db" /> Profile Settings
                </h2>

                {successMsg && <div style={successAlertStyle}>{successMsg}</div>}

                <form onSubmit={handleUpdate} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    {/* EMAIL - READ ONLY */}
                    <div style={inputGroupStyle}>
                        <label style={labelStyle}><Mail size={16} /> Email Address</label>
                        <input type="text" value={profile.email} disabled style={disabledInputStyle} />
                        <small style={{ color: '#888' }}>Email cannot be changed after registration.</small>
                    </div>

                    {/* PHONE NUMBER */}
                    <div style={inputGroupStyle}>
                        <label style={labelStyle}><Phone size={16} /> Phone Number</label>
                        <input 
                            type="tel" 
                            placeholder="+91 XXXXXXXXX"
                            value={profile.phoneNumber || ''} 
                            onChange={(e) => setProfile({...profile, phoneNumber: e.target.value})} 
                            style={{ ...inputStyle, borderColor: errors.phoneNumber ? '#e74c3c' : '#ddd' }}
                        />
                        {errors.phoneNumber && <span style={errorTextStyle}><AlertCircle size={12}/> {errors.phoneNumber}</span>}
                    </div>

                    {/* Conditional Company Name Field */}
                    {(user.role === 'ROLE_SUPPLIER' || user.role === 'ROLE_ADMIN') && (
                        <div style={inputGroupStyle}>
                            <label style={labelStyle}>
                                <LayoutDashboard size={16} /> 
                                {user.role === 'ROLE_SUPPLIER' ? "Company Name" : "Department/Organization"}
                            </label>
                            <input 
                                type="text" 
                                placeholder="e.g. TechCorp Solutions"
                                value={profile.companyName || ''} 
                                onChange={(e) => setProfile({...profile, companyName: e.target.value})} 
                                style={{ ...inputStyle, borderColor: errors.companyName ? '#e74c3c' : '#ddd' }}
                            />
                            {errors.companyName && <span style={errorTextStyle}><AlertCircle size={12}/> {errors.companyName}</span>}
                        </div>
                    )}

                    {/* DOB */}
                    <div style={inputGroupStyle}>
                        <label style={labelStyle}><Cake size={16} /> Date of Birth</label>
                        <input 
                            type="date" 
                            value={profile.dob || ''} 
                            onChange={(e) => setProfile({...profile, dob: e.target.value})} 
                            style={{ ...inputStyle, borderColor: errors.dob ? '#e74c3c' : '#ddd' }}
                        />
                        {errors.dob && <span style={errorTextStyle}><AlertCircle size={12}/> {errors.dob}</span>}
                    </div>

                    {/* ADDRESS */}
                    <div style={inputGroupStyle}>
                        <label style={labelStyle}><MapPin size={16} /> {getAddressLabel()}</label>
                        <textarea 
                            rows="3"
                            placeholder={user.role === 'ROLE_USER' ? "Street, City, Zip Code..." : "Enter business address..."}
                            value={profile.address || ''} 
                            onChange={(e) => setProfile({...profile, address: e.target.value})} 
                            style={{ ...inputStyle, resize: 'none', borderColor: errors.address ? '#e74c3c' : '#ddd' }}
                        />
                        {errors.address && <span style={errorTextStyle}><AlertCircle size={12}/> {errors.address}</span>}
                    </div>

                    <button type="submit" className="btn-primary" style={saveBtnStyle}>
                        <Save size={18} /> Save Profile
                    </button>
                </form>
            </div>
        </div>
    );
};

// --- Styles ---
const cardStyle = { background: 'white', padding: '40px', borderRadius: '15px', boxShadow: '0 10px 25px rgba(0,0,0,0.05)' };
const inputGroupStyle = { display: 'flex', flexDirection: 'column', gap: '8px' };
const labelStyle = { fontSize: '0.9rem', fontWeight: '700', color: '#444', display: 'flex', alignItems: 'center', gap: '8px' };
const inputStyle = { padding: '12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '1rem', outline: 'none', transition: 'border 0.2s' };
const disabledInputStyle = { ...inputStyle, backgroundColor: '#f9f9f9', color: '#999', border: '1px dashed #ccc' };
const errorTextStyle = { color: '#e74c3c', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: '500' };
const successAlertStyle = { padding: '12px', backgroundColor: '#eafaf1', color: '#27ae60', borderRadius: '8px', marginBottom: '20px', border: '1px solid #27ae60', fontWeight: 'bold', textAlign: 'center' };
const saveBtnStyle = { marginTop: '10px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', padding: '14px', fontSize: '1rem' };

export default Account;