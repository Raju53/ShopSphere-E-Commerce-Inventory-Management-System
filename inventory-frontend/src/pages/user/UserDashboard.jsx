import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Search, Filter } from 'lucide-react';
import { Truck } from 'lucide-react';

const UserDashboard = () => {
    const [products, setProducts] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [page, setPage] = useState(0);
    const { user } = useAuth();

    // Categories list - in a real app, you could fetch this from /api/categories
    const categories = ["All", "Electronics", "Fashion", "Home", "Books", "Sports"];

    useEffect(() => {
        fetchProducts();
    }, [page, selectedCategory]); // Re-fetch when page or category changes

    const fetchProducts = async () => {
        try {
            // Updated URL to include category filtering if your backend supports it
            let url = `http://localhost:8080/api/user/products?page=${page}&size=6`;
            if (selectedCategory !== "All") {
                url += `&category=${selectedCategory}`;
            }

            const response = await fetch(url, {
                headers: { 'Authorization': `Bearer ${user.token}` }
            });
            const data = await response.json();
            setProducts(data.content || data);
        } catch (error) {
            console.error("Error fetching products:", error);
        }
    };

    // Frontend filtering for the Search Bar
    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const addToCart = async (productId) => {
        try {
            const response = await fetch(`http://localhost:8080/api/user/cart/${productId}?quantity=1`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${user.token}` }
            });
            if (response.ok) alert("Added to cart!");
        } catch (error) {
            alert("Error adding to cart");
        }
    };

    return (
        <div style={{ padding: '20px' }}>
            <div className="filter-bar" style={filterBarStyle}>
                <div className="search-box" style={inputWrapperStyle}>
                    <Search size={18} style={iconStyle} />
                    <input 
                        type="text" 
                        placeholder="Search products..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={inputStyle}
                    />
                </div>

                <div className="category-box" style={inputWrapperStyle}>
                    <Filter size={18} style={iconStyle} />
                    <select 
                        value={selectedCategory} 
                        onChange={(e) => {setSelectedCategory(e.target.value); setPage(0);}}
                        style={inputStyle}
                    >
                        {categories.map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="product-grid">
                {filteredProducts.length > 0 ? (
                    filteredProducts.map(product => (
                        <div key={product.id} className="product-card">
                            <img src={product.imageUrl} alt={product.name} className={imgStyle} />
                            <h3 className='m-2'>{product.name}</h3>
                            <div style={sellerBadgeStyle}>
                                <Truck size={12} /> 
                                <span className='m-2'>Sold by: {product.supplierCompanyName}</span>
                            </div>
                            <p className="category-tag m-2">{product.category}</p>
                            <p className="price m-2">₹ {product.price}</p>
                            <button onClick={() => addToCart(product.id)} className="btn-primary" style={{ padding: '6px 10px', fontSize: '15px', borderRadius: '5px' }}>
                                Add to Cart
                            </button>
                        </div>
                    ))
                ) : (
                    <p style={{ textAlign: 'center', gridColumn: '1 / -1' }}>No products found.</p>
                )}
            </div>
            
            {/* Pagination Controls */}
            <div style={{ textAlign: 'center', marginTop: '30px' }}>
                <button onClick={() => setPage(p => Math.max(0, p - 1))} disabled={page === 0}>Prev</button>
                <span style={{ margin: '0 20px' }}>Page {page + 1}</span>
                <button onClick={() => setPage(p => p + 1)}>Next</button>
            </div>
        </div>
    );
};

// Internal styles for the Filter Bar
const filterBarStyle = { display: 'flex', gap: '20px', marginBottom: '30px', background: 'white', padding: '15px', borderRadius: '10px', boxShadow: '0 2px 5px rgba(0,0,0,0.05)' };
const inputWrapperStyle = { position: 'relative', display: 'flex', alignItems: 'center', flex: 1 };
const iconStyle = { position: 'absolute', left: '10px', color: '#95a5a6' };
const inputStyle = { width: '100%', padding: '10px 10px 10px 35px', border: '1px solid #ddd', borderRadius: '5px', outline: 'none' };
const sellerBadgeStyle = { display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: '#3498db', backgroundColor: '#ebf5fb', padding: '3px 10px', borderRadius: '12px', fontWeight: '600', marginBottom: '10px', width: 'fit-content', border: '1px solid #d6eaf8' };
const imgStyle = { width: '100%', height: '200px', objectFit: 'cover', borderRadius: '8px 8px 0 0', backgroundColor: '#f0f0f0'
};
export default UserDashboard;