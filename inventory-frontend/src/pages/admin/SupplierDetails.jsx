import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Trash2 } from 'lucide-react';

const SupplierDetails = () => {
    const [vendors, setVendors] = useState([]);
    const { user } = useAuth();

    useEffect(() => {
        if (user?.token) {
            fetchVendors();
        }
    }, [user]);

    const fetchVendors = async () => {
        try {
            const response = await fetch('http://localhost:8080/api/admin/users', {
                headers: { 
                    'Authorization': `Bearer ${user.token}`,
                    'Content-Type': 'application/json'
                }
            });

            // 1. Guard against non-200 responses
            if (!response.ok) {
                console.error(`HTTP Error: ${response.status}`);
                return;
            }

            const data = await response.json();

            // 2. 🛡️ Safety Check: Verify data is an array before filtering
            if (Array.isArray(data)) {
                setVendors(data.filter(v => v.role === 'ROLE_SUPPLIER'));
            } else {
                console.error("Data received is not an array:", data);
                setVendors([]); 
            }
        } catch (error) {
            console.error("Error fetching vendors:", error);
        }
    };

    const deleteUser = async (id) => {
        if (window.confirm("Are you sure you want to delete this user?")) {
            try {
                const response = await fetch(`http://localhost:8081/api/admin/users/${id}`, {
                    method: 'DELETE',
                    headers: { 'Authorization': `Bearer ${user.token}` }
                });

                if (response.ok) {
                    // Remove the user from the local state so they disappear from the UI immediately
                    setVendors(prev => prev.filter(v => v.id !== id));
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
            <h2 className='text-2xl font-bold' style={{padding: '10px 20px', margin: '15px'}}>Vendor Management</h2>
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Company/Username</th>
                        <th>Email</th>
                        <th>Products Listed</th>
                    </tr>
                </thead>
                <tbody>
                    {vendors.length > 0 ? (
                        vendors.map(v => (
                            <tr key={v.id}>
                                <td>{v.id}</td>
                                <td>{v.username}</td>
                                <td>{v.email}</td>
                                <td>{v.totalProducts || 0}</td>
                                <td>
                                    <button onClick={() => deleteUser(v.id)} 
                                        style={{ background: 'none', border: 'none', color: '#e74c3c', cursor: 'pointer' }}>
                                        <Trash2 size={18} />
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="4" style={{ textAlign: 'center', padding: '20px' }}>
                                No vendors found or server error.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default SupplierDetails;
