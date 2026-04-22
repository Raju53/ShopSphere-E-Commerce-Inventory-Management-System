import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Package, Globe, Boxes } from 'lucide-react';

const SupplierDashboard = () => {
    const { user } = useAuth();
    const [products, setProducts] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [loading, setLoading] = useState(true);
    const [view, setView] = useState('supplier');
    
    const [newProduct, setNewProduct] = useState({
        name: '',
        description: '',
        price: 0,
        stock: 0,
        category: '',
        imageUrl: ''
    });

    useEffect(() => {
        if (user?.token) {
            if (view === 'supplier') {
                fetchSupplierProducts();
            } else {
                fetchProducts();
            }
        }
    }, [user?.token, view]);

    const fetchSupplierProducts = async () => {
        // This assumes your API allows suppliers to view their specific products
        try {
            const response = await fetch('http://localhost:8080/api/supplier/products', {
                headers: { 'Authorization': `Bearer ${user.token}` }
            });
            const data = await response.json();
            // In a real app, you'd filter by supplierId or use a specific supplier endpoint
            setProducts(data.content || data);
        } catch (error) {
            console.error("Error fetching supplier products:", error);
        }
    };

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const response = await fetch('http://localhost:8081/api/user/products', {
                headers: { 'Authorization': `Bearer ${user.token}` }
            });
            const data = await response.json();
            setProducts(data.content || data);
        } catch (error) {
            console.error("Error fetching products:", error);
        } finally {
            setLoading(false);
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
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h1 className='text-3xl font-black tracking-tighter text-slate-900'>Supplier Console</h1>
                
                {/* Tab Switcher */}
                <div style={{ backgroundColor: '#e2e8f0', padding: '5px', borderRadius: '12px', display: 'flex', gap: '5px' }}>
                    <button 
                        onClick={() => setView('supplier')}
                        style={{ 
                            padding: '10px 20px', borderRadius: '8px', border: 'none', cursor: 'pointer',
                            backgroundColor: view === 'supplier' ? '#fff' : 'transparent',
                            fontWeight: view === 'supplier' ? '900' : '500',
                            boxShadow: view === 'supplier' ? '0 2px 4px rgba(0,0,0,0.1)' : 'none'
                        }}>
                        My Inventory
                    </button>
                    <button 
                        onClick={() => setView('marketplace')}
                        style={{ 
                            padding: '10px 20px', borderRadius: '8px', border: 'none', cursor: 'pointer',
                            backgroundColor: view === 'marketplace' ? '#fff' : 'transparent',
                            fontWeight: view === 'marketplace' ? '900' : '500',
                            boxShadow: view === 'marketplace' ? '0 2px 4px rgba(0,0,0,0.1)' : 'none'
                        }}>
                        Global Marketplace
                    </button>
                </div>
            </div>
            
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

            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden m-8">
                    <div style={{ padding: '20px', borderBottom: '1px solid #f1f5f9', backgroundColor: '#fdfdfd' }}>
                        <h2 className='text-lg font-black text-slate-700 uppercase tracking-widest'>
                            {view === 'supplier' ? '📦 My Private Listings' : '🌐 Marketplace Overview'}
                        </h2>
                    </div>
                    
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead style={{ backgroundColor: '#f8fafc', textAlign: 'left' }}>
                            <tr>
                                <th style={{ padding: '15px 20px' }}>ProductID</th>
                                <th style={{ padding: '15px 20px' }}>Preview</th>
                                <th style={{ padding: '15px 20px' }}>Name</th>
                                <th style={{ padding: '15px 20px' }}>Price</th>
                                <th style={{ padding: '15px 20px' }}>Stock</th>
                                <th style={{ padding: '15px 20px' }}>Category</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan="6" className="py-24 text-center font-black text-slate-300 animate-pulse tracking-[0.4em] uppercase text-xs">Synchronizing Pipeline...</td></tr>
                            ) : products.length > 0 ? (
                                products.map(p => (
                                    <tr key={p.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                        <td className="px-5 py-4"><span className="text-xs font-bold text-slate-400">{p.id}</span></td>
                                        <td className="px-5 py-4">
                                            <div className="w-12 h-12 bg-slate-100 rounded-xl overflow-hidden flex items-center justify-center">
                                                {p.imageUrl && p.imageUrl.trim() !== "" ? (
                                                    <img src={p.imageUrl} alt={p.name} className="w-full h-full object-cover" />
                                                ) : (
                                                    <span className="text-xl">📦</span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-5 py-4 font-bold text-slate-800">{p.name}</td>
                                        <td className="px-5 py-4 font-black text-blue-600">₹ {p.price}</td>
                                        <td className="px-5 py-4 text-slate-500 font-bold">{p.stock}</td>
                                        <td className="px-5 py-4"><span className="bg-slate-100 px-3 py-1 rounded-lg text-[10px] font-black uppercase">{p.category}</span></td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="py-32 text-center text-slate-300 italic font-bold text-lg">
                                        No products found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>        
            </div>
    );
};

export default SupplierDashboard;
