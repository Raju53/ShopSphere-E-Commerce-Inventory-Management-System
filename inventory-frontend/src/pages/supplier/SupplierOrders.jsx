import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Truck, CheckCircle, Clock } from 'lucide-react';

const SupplierOrders = () => {
    const [orders, setOrders] = useState([]);
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAllOrders();
    }, []);

    const fetchAllOrders = async () => {
        try {
            const response = await fetch('http://localhost:8080/api/user/orders', {
                headers: { 'Authorization': `Bearer ${user.token}` }
            });
            const data = await response.json();
            setOrders(Array.isArray(data) ? data : data.content || []);
        } catch (error) {
            console.error("Error fetching orders:", error);
        } finally {
            setLoading(false);
        }
    };

    const updateStatus = async (orderId, newStatus) => {
        try {
            const response = await fetch(`http://localhost:8080/api/user/orders/${orderId}/status?status=${newStatus}`, {
                method: 'PUT',
                headers: { 'Authorization': `Bearer ${user.token}` }
            });
            if (response.ok) {
                alert(`Order marked as ${newStatus}`);
                fetchAllOrders();
            }
        } catch (error) {
            alert("Update failed");
        }
    };

    if (loading) return <div style={{ textAlign: 'center', padding: '50px' }}>Loading Customer Orders...</div>;

    return (
        <div style={{ padding: '30px', maxWidth: '1000px', margin: '0 auto' }}>
            <h2 className='text-2xl font-bold' style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Truck /> Customer Orders Management
            </h2>
            
            <table style={tableStyle}>
                <thead>
                    <tr style={{ background: '#f4f4f4' }}>
                        <th style={thStyle}>Order ID</th>
                        <th style={thStyle}>Items</th>
                        <th style={thStyle}>Total</th>
                        <th style={thStyle}>Status</th>
                        <th style={thStyle}>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {orders.map(order => (
                        <tr key={order.orderId} style={{ borderBottom: '1px solid #eee' }}>
                            <td style={tdStyle}>#{order.orderId}</td>
                            <td style={tdStyle}>
                                {order.items?.map(i => `${i.productName} (x${i.quantity})`).join(', ')}
                            </td>
                            <td style={tdStyle}>${order.totalPrice.toFixed(2)}</td>
                            <td style={tdStyle}>
                                <span style={{ color: order.status === 'SHIPPED' ? 'green' : 'orange', fontWeight: 'bold' }}>
                                    {order.status}
                                </span>
                            </td>
                            <td style={tdStyle}>
                                {order.status === 'PENDING' && (
                                    <button 
                                        onClick={() => updateStatus(order.orderId, 'SHIPPED')}
                                        style={shipBtnStyle}
                                    >
                                        Mark as Shipped
                                    </button>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

const tableStyle = { width: '100%', borderCollapse: 'collapse', background: 'white', borderRadius: '8px', overflow: 'hidden' };
const thStyle = { padding: '12px', textAlign: 'left', borderBottom: '2px solid #ddd' };
const tdStyle = { padding: '12px', textAlign: 'left' };
const shipBtnStyle = { backgroundColor: '#2980b9', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer' };

export default SupplierOrders;
