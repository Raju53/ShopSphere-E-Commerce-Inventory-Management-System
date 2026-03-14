import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';

const SupplierDashboard = () => {
    const { user } = useAuth();
    const [products, setProducts] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [newProduct, setNewProduct] = useState({
        name: '',
        description: '',
        price: 0,
        stock: 0,
        category: '',
        imageUrl: ''
    });

    useEffect(() => {
        fetchSupplierProducts();
    }, []);

    const fetchSupplierProducts = async () => {
        // This assumes your API allows suppliers to view their specific products
        try {
            const response = await fetch('http://localhost:8080/api/user/products', {
                headers: { 'Authorization': `Bearer ${user.token}` }
            });
            const data = await response.json();
            // In a real app, you'd filter by supplierId or use a specific supplier endpoint
            setProducts(data.content || data);
        } catch (error) {
            console.error("Error fetching products:", error);
        }
    };

    const handleInputChange = (e) => {
        setNewProduct({ ...newProduct, [e.target.name]: e.target.value });
    };

    const handleAddProduct = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:8080/api/supplier/products', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}` 
                },
                body: JSON.stringify(newProduct)
            });

            if (response.ok) {
                alert("Product Added successfully!");
                setShowForm(false);
                fetchSupplierProducts(); // Refresh the list
            }
        } catch (error) {
            alert("Error adding product");
        }
    };

    return (
        <div style={{ padding: '20px' }}>
            <h1 className='text-2xl font-bold' style={{padding: '10px 20px', margin: '15px'}}>Supplier Dashboard</h1>
            <button className = 'btn-primary' onClick={() => setShowForm(!showForm)} style={{ display: 'flex', alignItems: 'center', textAlign: 'center', gap: '5px', padding: '12px 20px', borderRadius: '5px' }}>
                {showForm ? 'Cancel' : 'Add New Product'}
            </button>

            {showForm && (
                <form onSubmit={handleAddProduct} className="space-y-6" style={{padding: '15px 15px'}}>
                    <div className="space-y-2">
                        <label className="text-[15px] font-black ml-2">Product Title</label>
                        <input type="text" placeholder="e.g. Mechanical Keyboard" required className="w-full px-8 py-5 bg-slate-50 border-slate-200 rounded outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all" onChange={handleInputChange} />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[15px] font-black ml-2">Description</label>
                        <textarea placeholder="Product details..." rows="3" required className="w-full px-8 py-5 bg-slate-50 border-slate-200 rounded outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all" onChange={handleInputChange} />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[15px] font-black ml-2">Category</label>
                        <input type="text" placeholder="e.g. Electronics" required className="w-full px-8 py-5 bg-slate-50 border border-slate-200 rounded outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all" onChange={handleInputChange} />
                    </div>
                    <div className="space-y-2" style={{padding: '5px 5px'}}>
                        <label className="text-[15px] font-black ml-2">Image URL</label>
                        <input type="text" placeholder="https://..." className="w-full px-8 py-5 bg-slate-50 border-slate-200 outline-none rounded focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all" onChange={handleInputChange} />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-8 m-5">
                        <div className="space-y-2">
                            <label className="text-[15px] font-black ml-2">Price (₹)</label>
                            <input type="number" required placeholder="0.00" className="w-full px-8 py-5 bg-slate-50 border-slate-200 rounded outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all" onChange={handleInputChange} />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[15px] font-black ml-2">Initial Stock</label>
                            <input type="number" required placeholder="0" className="w-full bg-slate-50 border-slate-200 rounded outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all" onChange={handleInputChange} />
                        </div>
                    </div>
                    <button type='submit' className="btn-success w-full text-white py-6 rounded text-m" style={{margin: '10px 15px'}}>
                        Save Product
                    </button>
                </form>
            )}

            <h2 className='text-xl font-bold' style={{ marginTop: '30px' }}>Your Listed Products</h2>
            <table style={{ width: '100%', marginTop: '10px' }}>
                <thead>
                    <tr>
                        <th>Image</th>
                        <th>Name</th>
                        <th>Price</th>
                        <th>Stock</th>
                        <th>Category</th>
                    </tr>
                </thead>
                <tbody>
                    {products.map(p => (
                        <tr key={p.id}>
                            <td><img src={p.imageUrl} style={{ width: '40px', height: '40px', objectFit: 'cover' }} /></td>
                            <td>{p.name}</td>
                            <td>₹ {p.price}</td>
                            <td>{p.stock}</td>
                            <td>{p.category}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default SupplierDashboard;