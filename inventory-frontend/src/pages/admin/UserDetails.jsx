import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Trash2 } from 'lucide-react';

const UserDetails = () => {
    const [customers, setCustomers] = useState([]);
    const { user } = useAuth();

    useEffect(() => {
        if (user?.token) {
            fetchCustomers();
        }
    }, [user]);

    const fetchCustomers = async () => {
        try {
            const response = await fetch('http://localhost:8080/api/admin/users', {
                headers: { 
                    'Authorization': `Bearer ${user.token}`,
                    'Content-Type': 'application/json'
                }
            });

            // 1. Check if the response is successful
            if (!response.ok) {
                console.error(`Server error: ${response.status}`);
                return;
            }

            const data = await response.json();

            // 2. 🛡️ Safety Check: Only filter if data is actually an array
            if (Array.isArray(data)) {
                setCustomers(data.filter(u => u.role === 'ROLE_USER'));
            } else {
                console.error("Backend did not return an array. Received:", data);
                setCustomers([]); // Fallback to avoid .map errors
            }
        } catch (error) {
            console.error("Error fetching customers:", error);
        }
    };

    const deleteUser = async (id) => {
        if (window.confirm("Are you sure you want to delete this user?")) {
            try {
                const response = await fetch(`http://localhost:8080/api/admin/users/${id}`, {
                    method: 'DELETE',
                    headers: { 'Authorization': `Bearer ${user.token}` }
                });

                if (response.ok) {
                    // Remove the user from the local state so they disappear from the UI immediately
                    setCustomers(prev => prev.filter(c => c.id !== id));
                    alert("User deleted successfully");
                } else {
                    alert("Failed to delete user");
                }
            } catch (error) {
                console.error("Delete error:", error);
            }
        }
    };

    return (
        <div className="admin-table-container">
            <h2 className='text-2xl font-bold' style={{padding: '10px 20px', margin: '15px'}}>Customer Management</h2>
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Username</th>
                        <th>Email</th>
                        <th>Total Orders</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {customers.length > 0 ? (
                        customers.map(c => (
                            <tr key={c.id}>
                                <td>{c.id}</td>
                                <td>{c.username}</td>
                                <td>{c.email}</td>
                                <td>{c.totalOrders}</td>
                                <td><span className="status-active">Active</span></td>
                                <td>
                                    <button 
                                        onClick={() => deleteUser(c.id)} 
                                        style={{ background: 'none', border: 'none', color: '#e74c3c', cursor: 'pointer' }}
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="4" style={{ textAlign: 'center' }}>No customers found.</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default UserDetails;
