import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Trash2, PackageCheck, List, RefreshCw } from 'lucide-react';

const AdminDashboard = () => {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState('products'); // 'products' or 'orders'
    const [list, setList] = useState([]);
    const [loading, setLoading] = useState(false);

    // Watch for tab changes to fetch new data
    useEffect(() => {
        if (user?.token) {
            fetchAdminData();
        }
    }, [activeTab, user]);

    const fetchAdminData = async () => {
        setLoading(true);
        try {
            const response = await fetch(`http://localhost:8080/api/admin/${activeTab}`, {
                headers: { 'Authorization': `Bearer ${user.token}` }
            });
            if (response.ok) {
                const data = await response.json();
                // Handle both raw arrays and Spring Page objects
                setList(Array.isArray(data) ? data : data.content || []);
            }
        } catch (error) {
            console.error(`Error fetching ${activeTab}:`, error);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteProduct = async (id) => {
        if (window.confirm("Delete this product permanently?")) {
            const response = await fetch(`http://localhost:8080/api/admin/products/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${user.token}` }
            });
            if (response.ok) fetchAdminData();
        }
    };

    const handleUpdateOrderStatus = async (orderId, newStatus) => {
        const response = await fetch(`http://localhost:8080/api/admin/orders/${orderId}`, {
            method: 'PUT',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${user.token}` 
            },
            body: JSON.stringify({ status: newStatus })
        });
        if (response.ok) fetchAdminData();
    };

    return (
        <div style={{ padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                <h1 className='text-2xl font-bold'>Admin Control Panel</h1>
                <button onClick={fetchAdminData} className="flex items-center justify-center gap-2 transition-all btn-light" style={{padding: '5px 5px', margin: '5px 5px', width: '100px', borderRadius: '5px'}}>
                    <RefreshCw size={16} className={loading ? 'spin' : ''}/>
                        <span className="text-xs font-bold uppercase tracking-widest leading-none">Refresh</span>
                </button>
            </div>

            {/* TAB NAVIGATION */}
            <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
                <button 
                    onClick={() => setActiveTab('products')} 
                    className={activeTab === 'products' ? 'btn-primary' : 'btn-outline'}
                    style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 40px', borderRadius: '5px' }}
                >
                    <List size={18} /> Manage Products
                </button>
                <button 
                    onClick={() => setActiveTab('orders')} 
                    className={activeTab === 'orders' ? 'btn-primary' : 'btn-outline'}
                    style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 40px', borderRadius: '5px' }}
                >
                    <PackageCheck size={18} /> Manage Orders
                </button>
            </div>

            {/* CONDITIONAL RENDERING AREA */}
            <div className="admin-table-container">
                {loading ? (
                    <div style={{ textAlign: 'center', padding: '50px' }}>Loading {activeTab}...</div>
                ) : activeTab === 'products' ? (
                    <ProductTable data={list} onDelete={handleDeleteProduct} />
                ) : (
                    <OrderTable data={list} onUpdate={handleUpdateOrderStatus} />
                )}
            </div>
        </div>
    );
};

/* --- SUB-COMPONENT: PRODUCT TABLE --- */
const ProductTable = ({ data, onDelete }) => (
    <table>
        <thead>
            <tr><th>Product ID</th><th>Name</th><th>Category</th><th>Price</th><th>Stock</th><th>Action</th></tr>
        </thead>
        <tbody>
            {data.map(p => (
                <tr key={p.id}>
                    <td>#{p.id}</td>
                    <td>{p.name}</td>
                    <td><span className="category-tag">{p.category}</span></td>
                    <td>₹ {p.price}</td>
                    <td>{p.stock}</td>
                    <td>
                        <Trash2 
                            size={18} 
                            color="#e74c3c" 
                            style={{ cursor: 'pointer' }} 
                            onClick={() => onDelete(p.id)} 
                        />
                    </td>
                </tr>
            ))}
        </tbody>
    </table>
);

const getStatusColor = (status) => {
  switch (status) {
    case 'PENDING': return 'bg-amber-50 text-amber-600 border-amber-100';
    case 'SHIPPED': return 'bg-blue-50 text-blue-600 border-blue-100';
    case 'DELIVERED': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
    case 'CANCELLED': return 'bg-rose-50 text-rose-600 border-rose-100';
    default: return 'bg-slate-50 text-slate-600 border-slate-100';
  }
};

/* --- SUB-COMPONENT: ORDER TABLE --- */
const OrderTable = ({ data, onUpdate }) => (
    <table>
        <thead>
            <tr><th>Order ID</th><th>Customer</th><th>Current Status</th><th>Update Status</th></tr>
        </thead>
        <tbody>
            {data.map(o => (
                <tr key={o.id}>
                    <td>#{o.id}</td>
                    <td>{o.user?.username || 'System User'}</td>
                    <td>
                        <span className={`status-badge ${o.status?.toLowerCase()}`}>
                            {o.status}
                        </span>
                    </td>
                    <td>
                        <select 
                            className={`border-2 rounded-xl text-[10px] font-black p-3 outline-none focus:border-blue-600 uppercase tracking-widest cursor-pointer transition-colors ${getStatusColor(o.status)}`}
                            value={o.status} 
                            onChange={(e) => onUpdate(o.id, e.target.value)}
                            style={{ padding: '5px', borderRadius: '4px' }}
                        >
                            <option value="PENDING">PENDING</option>
                            <option value="SHIPPED">SHIPPED</option>
                            <option value="DELIVERED">DELIVERED</option>
                            <option value="CANCELLED">CANCELLED</option>
                        </select>
                    </td>
                </tr>
            ))}
        </tbody>
    </table>
);

export default AdminDashboard;
