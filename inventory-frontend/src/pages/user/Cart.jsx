import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Trash2, ShoppingBag, Plus, Minus, ArrowLeft } from 'lucide-react';

const Cart = () => {
    const [cartItems, setCartItems] = useState([]);
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (user?.token) fetchCart();
    }, [user]);

    const fetchCart = async () => {
        try {
            const response = await fetch('http://localhost:8080/api/user/cart', {
                headers: { 'Authorization': `Bearer ${user.token}` }
            });
            const data = await response.json();
            setCartItems(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Error fetching cart:", error);
        }
    };

    const updateQuantity = async (productId, newQuantity) => {
        if (!productId || newQuantity < 1) return;
        try {
            const response = await fetch(`http://localhost:8080/api/user/cart/${productId}?quantity=${newQuantity}`, {
                method: 'POST', 
                headers: { 'Authorization': `Bearer ${user.token}` }
            });

            if (response.ok) {
                fetchCart(); 
            } else {
                const errorText = await response.text();
                alert(`Update failed: ${errorText || "Stock limit reached"}`);
            }
        } catch (error) {
            console.error("Update failed:", error);
        }
    };

    const removeItem = async (cartId) => {
        if (!cartId) return;
        try {
            const response = await fetch(`http://localhost:8080/api/user/cart/${cartId}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${user.token}` }
            });
            if (response.ok) fetchCart();
        } catch (error) {
            alert("Could not remove item");
        }
    };

    const calculateTotal = () => {
        return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2);
    };

    const handleCheckout = async () => {
        if (cartItems.length === 0) {
            alert("Your cart is empty!");
            return;
        }

        try {
            const response = await fetch('http://localhost:8080/api/user/orders', {
                method: 'POST',
                headers: { 
                    'Authorization': `Bearer ${user.token}`,
                    'Content-Type': 'application/json' 
                }
            });

            if (response.ok) {
                alert("Order Placed Successfully!");
                navigate('/user/orders'); 
            } else {
                const errorText = await response.text();
                alert(`Checkout failed: ${errorText || "Check stock availability"}`);
            }
        } catch (error) {
            console.error("Checkout error:", error);
            alert("Server error during checkout");
        }
    };

    return (
        <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
            <h2 style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                <ShoppingBag /> Your Shopping Cart
            </h2>
            
            {cartItems.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '50px', backgroundColor: 'white', borderRadius: '10px' }}>
                    <p>Your cart is empty.</p>
                    <button onClick={() => navigate('/user')} className="btn-primary" style={{ marginTop: '20px' }}>
                        Start Shopping
                    </button>
                </div>
            ) : (
                <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '10px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ borderBottom: '2px solid #eee' }}>
                                <th style={{ textAlign: 'left', padding: '12px' }}>Product</th>
                                <th style={{ textAlign: 'center' }}>Quantity</th>
                                <th style={{ textAlign: 'center' }}>Subtotal</th>
                                <th style={{ textAlign: 'center' }}>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {cartItems.map(item => (
                                <tr key={item.cartId} style={{ borderBottom: '1px solid #f9f9f9' }}>
                                    <td style={{ padding: '15px' }}>
                                        <div style={{ fontWeight: '600' }}>{item.productName}</div>
                                        <div style={{ fontSize: '0.85rem', color: '#666' }}>Unit Price: ₹ {item.price}</div>
                                    </td>
                                    
                                    <td style={{ textAlign: 'center' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
                                            <button 
                                                onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                                                style={qtyBtnStyle}
                                                disabled={item.quantity <= 1}
                                            >
                                                <Minus size={14} color="black" />
                                            </button>
                                            <span style={{ fontWeight: 'bold', minWidth: '20px' }}>{item.quantity}</span>
                                            <button 
                                                onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                                                style={qtyBtnStyle}
                                            >
                                                <Plus size={14} color="black" />
                                            </button>
                                        </div>
                                    </td>

                                    <td style={{ textAlign: 'center', fontWeight: '700' }}>
                                        ₹ {(item.price * item.quantity).toFixed(2)}
                                    </td>
                                    
                                    <td style={{ textAlign: 'center' }}>
                                        <button onClick={() => removeItem(item.cartId)} style={{ background: 'none', border: 'none', color: '#e74c3c', cursor: 'pointer' }}>
                                            <Trash2 size={20} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    
                    <div style={{ marginTop: '30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <button 
                            onClick={() => navigate('/user')} 
                            style={{ 
                                display: 'flex', alignItems: 'center', gap: '8px', background: 'white', 
                                border: '1px solid #3498db', color: '#3498db', padding: '10px 20px', 
                                borderRadius: '5px', cursor: 'pointer', fontWeight: '500'
                            }}
                        >
                            <ArrowLeft size={18} /> Continue Shopping
                        </button>

                        <div style={{ textAlign: 'right' }}>
                            <h3 style={{ marginBottom: '15px' }}>Total Amount: <span style={{ color: '#27ae60' }}>₹ {calculateTotal()}</span></h3>
                            {/* 🛡️ FIX: Changed from navigate to handleCheckout */}
                            <button 
                                onClick={handleCheckout} 
                                className="btn-primary" 
                                style={{ padding: '12px 40px', fontSize: '1.1rem' }}
                            >
                                Checkout Now
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

// 🛡️ FIX: Changed background to white so icons are visible
const qtyBtnStyle = {
    border: '1px solid #ddd',
    background: '#fff',
    borderRadius: '4px',
    cursor: 'pointer',
    padding: '6px',
    display: 'flex',
    alignItems: 'center'
};

export default Cart;