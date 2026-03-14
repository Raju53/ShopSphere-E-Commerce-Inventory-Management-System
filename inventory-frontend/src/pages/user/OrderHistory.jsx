import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Package, Calendar, Tag, ChevronDown, ChevronUp, XCircle, Truck } from 'lucide-react';

const OrderHistory = () => {
    const [orders, setOrders] = useState([]);
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [expandedOrderId, setExpandedOrderId] = useState(null);

    useEffect(() => {
        if (user?.token) fetchMyOrders();
    }, [user]);

    const fetchMyOrders = async () => {
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

    const handleCancelOrder = async (e, orderId) => {
        e.stopPropagation();
        if (!window.confirm("Are you sure you want to cancel? Stock will be returned.")) return;

        try {
            const response = await fetch(`http://localhost:8080/api/user/orders/${orderId}/cancel`, {
                method: 'PUT',
                headers: { 'Authorization': `Bearer ${user.token}` }
            });
            if (response.ok) {
                alert("Order Cancelled");
                fetchMyOrders();
            }
        } catch (error) {
            alert("Cancellation failed");
        }
    };

    const getStatusStyle = (status) => {
        switch (status) {
            case 'SHIPPED': return { color: '#2980b9', bg: '#ebf5fb' };
            case 'CANCELLED': return { color: '#e74c3c', bg: '#fdedec' };
            default: return { color: '#f39c12', bg: '#fef9e7' }; // PENDING
        }
    };

    if (loading) return <div style={{ padding: '40px', textAlign: 'center' }}>Loading...</div>;

    return (
        <div style={{ padding: '30px', width: '750px', margin: '0 auto' }}>
            <h2 style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '25px' }}>
                <Package size={28} /> My Order History
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                {orders.map(order => {
                    const style = getStatusStyle(order.status);
                    const isExpanded = expandedOrderId === order.orderId;

                    return (
                        <div key={order.orderId} style={orderCardStyle}>
                            <div onClick={() => setExpandedOrderId(isExpanded ? null : order.orderId)} style={cardHeaderStyle}>
                                <div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                        <span style={{ fontWeight: 'bold' }}>Order #{order.orderId}</span>
                                        <span style={{ ...statusBadgeStyle, color: style.color, backgroundColor: style.bg }}>{order.status}</span>
                                    </div>
                                    <div style={{ fontSize: '0.8rem', color: '#666', marginTop: '5px' }}>
                                        <Calendar size={12} /> {new Date(order.createdAt).toLocaleDateString()}
                                    </div>
                                    {order.status === 'PENDING' && (
                                        <button onClick={(e) => handleCancelOrder(e, order.orderId)} style={cancelBtnStyle}>
                                            Cancel Order
                                        </button>
                                    )}
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <div style={{ fontWeight: 'bold' }}>₹ {order.totalPrice?.toFixed(2)}</div>
                                    {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                                </div>
                            </div>
                            {isExpanded && (
                                <div style={detailsSectionStyle}>
                                    {order.items?.map((item, idx) => (
                                        <div key={idx} style={itemRowStyle}>
                                            <span>{item.productName} <b>x{item.quantity}</b></span>
                                            <span>₹ {(item.price * item.quantity).toFixed(2)}</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

// Styles for simplicity
const orderCardStyle = { background: 'white', padding: '15px', borderRadius: '10px', border: '1px solid #eee' };
const cardHeaderStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' };
const statusBadgeStyle = { fontSize: '0.7rem', fontWeight: 'bold', padding: '2px 8px', borderRadius: '10px' };
const cancelBtnStyle = { marginTop: '8px', border: '1px solid #e74c3c', background: 'none', color: '#e74c3c', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer', fontSize: '0.75rem' };
const detailsSectionStyle = { marginTop: '15px', padding: '10px', background: '#f9f9f9', borderRadius: '5px' };
const itemRowStyle = { display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: '5px' };

export default OrderHistory;