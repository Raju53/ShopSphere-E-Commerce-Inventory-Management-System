import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Edit2, Save, X, Trash2, Image as ImageIcon } from 'lucide-react';

const UpdateProducts = () => {
    const { user } = useAuth();
    const [products, setProducts] = useState([]);
    const [editingId, setEditingId] = useState(null);
    const [editData, setEditData] = useState({});

    useEffect(() => { 
        if (user?.token) fetchMyProducts(); 
    }, [user]);

    const fetchMyProducts = async () => {
        try {
            const response = await fetch('http://localhost:8080/api/user/products', {
                headers: { 'Authorization': `Bearer ${user.token}` }
            });
            const data = await response.json();
            setProducts(data.content || data || []);
        } catch (error) {
            console.error("Error fetching products:", error);
        }
    };

    const startEdit = (product) => {
        setEditingId(product.id);
        setEditData({ ...product });
    };

    const handleSave = async (id) => {
        try {
            const updatedProduct = {
                name: editData.name,
                price: parseFloat(editData.price),
                stock: parseInt(editData.stock),
                category: editData.category,
                imageUrl: editData.imageUrl // 🆕 Added imageUrl to the payload
            };

            const response = await fetch(`http://localhost:8080/api/supplier/products/${id}`, {
                method: 'PUT',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}` 
                },
                body: JSON.stringify(updatedProduct)
            });

            if (response.ok) {
                setEditingId(null);
                fetchMyProducts();
                alert("Product updated successfully!");
            } else {
                alert(`Update failed: ${response.status}`);
            }
        } catch (error) {
            console.error("Network error:", error);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this product?")) {
            try {
                const response = await fetch(`http://localhost:8080/api/supplier/products/${id}`, {
                    method: 'DELETE',
                    headers: { 'Authorization': `Bearer ${user.token}` }
                });
                if (response.ok) fetchMyProducts();
            } catch (error) {
                console.error("Delete failed:", error);
            }
        }
    };

    return (
        <div className="admin-table-container">
            <h2 className='text-2xl font-bold' style={{padding: '10px 20px', margin: '15px'}}>Inventory Management</h2>
            <table>
                <thead>
                    <tr>
                        <th>Image</th>
                        <th>Product</th>
                        <th>Price</th>
                        <th>Stock</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {products.length > 0 ? (
                        products.map(p => (
                            <tr key={p.id}>
                                <td style={{ width: '100px' }}>
                                    {editingId === p.id ? (
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                                            <input 
                                                type="text" 
                                                placeholder="Image URL"
                                                value={editData.imageUrl || ''} 
                                                onChange={(e) => setEditData({...editData, imageUrl: e.target.value})} 
                                                style={{ fontSize: '10px', width: '100px' }}
                                            />
                                            {editData.imageUrl && (
                                                <img src={editData.imageUrl} alt="preview" style={{ width: '40px', height: '40px', borderRadius: '4px' }} />
                                            )}
                                        </div>
                                    ) : (
                                        <img src={p.imageUrl || 'https://via.placeholder.com/40'} alt={p.name} style={{ width: '40px', height: '40px', borderRadius: '4px', objectFit: 'cover' }} />
                                    )}
                                </td>

                                <td>
                                    {editingId === p.id ? 
                                        <input type="text" value={editData.name} onChange={(e) => setEditData({...editData, name: e.target.value})} /> 
                                        : p.name}
                                </td>
                                <td>
                                    {editingId === p.id ? 
                                        <input type="number" value={editData.price} onChange={(e) => setEditData({...editData, price: e.target.value})} /> 
                                        : `₹${p.price}`}
                                </td>
                                <td>
                                    {editingId === p.id ? 
                                        <input type="number" value={editData.stock} onChange={(e) => setEditData({...editData, stock: e.target.value})} /> 
                                        : p.stock}
                                </td>
                                <td>
                                    {editingId === p.id ? (
                                        <div style={{ display: 'flex', gap: '10px' }}>
                                            <Save onClick={() => handleSave(p.id)} size={18} style={{cursor:'pointer', color:'green'}}/>
                                            <X onClick={() => setEditingId(null)} size={18} style={{cursor:'pointer', color:'red'}}/>
                                        </div>
                                    ) : (
                                        <div style={{ display: 'flex', gap: '15px' }}>
                                            <Edit2 onClick={() => startEdit(p)} size={18} style={{cursor:'pointer', color: '#3498db'}}/>
                                            <Trash2 onClick={() => handleDelete(p.id)} size={18} style={{cursor:'pointer', color: '#e74c3c'}}/>
                                        </div>
                                    )}
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="5" style={{ textAlign: 'center', padding: '20px' }}>No products available.</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default UpdateProducts;