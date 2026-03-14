import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

// Common Components
import Navbar from './components/common/Navbar';
import ErrorBoundary from './components/common/ErrorBoundary';
import Sidebar from './components/common/Sidebar';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import MyAccount from './pages/common/MyAccount'; // Shared across all roles

// User Pages
import UserDashboard from './pages/user/UserDashboard';
import Cart from './pages/user/Cart';
import UserOrders from './pages/user/OrderHistory';

// Supplier Pages
import SupplierDashboard from './pages/supplier/SupplierDashboard';
import UpdateProduct from './pages/supplier/UpdateProducts';
import SupplierOrders from './pages/supplier/SupplierOrders';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import Analysis from './pages/admin/Analysis';
import UserDetails from './pages/admin/UserDetails';
import SupplierDetails from './pages/admin/SupplierDetails';

// Styling
import './App.css';

// 🛡️ Protected Route Helper
const ProtectedRoute = ({ children, allowedRole }) => {
    const { user, loading } = useAuth();

    if (loading) return <div className='loading-screen'>Loading ShopSphere...</div>;
    
    if (!user) {
        return <Navigate to="/login" />;
    }

    if (allowedRole && user.role !== allowedRole) {
        const redirectPath = user.role === 'ROLE_ADMIN' ? '/admin' : 
                             user.role === 'ROLE_SUPPLIER' ? '/supplier' : '/user';
        return <Navigate to={redirectPath} />;
    }

    return children;
};

function App() {
    const { user } = useAuth();
    return (
        <AuthProvider>
            <Router>
                <div className="app-container">
                    {/* 🛡️ Show Navbar ONLY if user is NOT logged in */}
                    {!user && <Navbar />}

                    <div className={user ? "dashboard-layout" : "guest-layout"}>
                        {/* Sidebar handles its own visibility based on auth state */}
                        {user && <Sidebar/>}
                        
                        <div className="main-content">
                            <Routes>
                                {/* Public Routes */}
                                <Route path="/" element={<Home />} />
                                <Route path="/login" element={<Login />} />
                                <Route path="/signup" element={<Signup />} />

                                {/* Shared Protected Routes (Accessible by any logged-in user) */}
                                <Route path="/user/account" element={<ProtectedRoute><MyAccount /></ProtectedRoute>} />
                                <Route path="/supplier/account" element={<ProtectedRoute><MyAccount /></ProtectedRoute>} />
                                <Route path="/admin/account" element={<ProtectedRoute><MyAccount /></ProtectedRoute>} />

                                {/* Role: ROLE_USER Routes */}
                                <Route path="/user" element={
                                    <ProtectedRoute allowedRole="ROLE_USER">
                                        <UserDashboard />
                                    </ProtectedRoute>
                                } />
                                <Route path="/user/cart" element={
                                    <ProtectedRoute allowedRole="ROLE_USER">
                                        <ErrorBoundary name="Cart">
                                            <Cart />
                                        </ErrorBoundary>
                                    </ProtectedRoute>
                                } />
                                <Route path="/user/orders" element={
                                    <ProtectedRoute allowedRole="ROLE_USER">
                                        <UserOrders />
                                    </ProtectedRoute>
                                } />

                                {/* Role: ROLE_SUPPLIER Routes */}
                                <Route path="/supplier" element={
                                    <ProtectedRoute allowedRole="ROLE_SUPPLIER">
                                        <SupplierDashboard />
                                    </ProtectedRoute>
                                } />
                                {/* Placeholder for Update Product - You can point to SupplierDashboard or a new page */}
                                <Route path="/supplier/update" element={
                                    <ProtectedRoute allowedRole="ROLE_SUPPLIER">
                                        <UpdateProduct /> 
                                    </ProtectedRoute>
                                } />
                                <Route path="/supplier/orders" element={
                                    <ProtectedRoute allowedRole="ROLE_SUPPLIER">
                                        <SupplierOrders />
                                    </ProtectedRoute>
                                } />

                                {/* Role: ROLE_ADMIN Routes */}
                                <Route path="/admin" element={
                                    <ProtectedRoute allowedRole="ROLE_ADMIN">
                                        <AdminDashboard />
                                    </ProtectedRoute>
                                } />
                                <Route path="/admin/products" element={
                                    <ProtectedRoute allowedRole="ROLE_ADMIN">
                                        <AdminDashboard />
                                    </ProtectedRoute>
                                } />
                                <Route path="/admin/orders" element={
                                    <ProtectedRoute allowedRole="ROLE_ADMIN">
                                        <AdminDashboard />
                                    </ProtectedRoute>
                                } />
                                <Route path="/admin/analysis" element={
                                    <ProtectedRoute allowedRole="ROLE_ADMIN">
                                        <Analysis />
                                    </ProtectedRoute>
                                } />
                                
                                {/* Placeholders for Customer/Vendor management */}
                                <Route path="/admin/users" element={
                                    <ProtectedRoute allowedRole="ROLE_ADMIN">
                                        <UserDetails />
                                    </ProtectedRoute>
                                } />
                                <Route path="/admin/suppliers" element={
                                    <ProtectedRoute allowedRole="ROLE_ADMIN">
                                        <SupplierDetails />
                                    </ProtectedRoute>
                                } />

                                {/* Fallback for 404 */}
                                <Route path="*" element={<Navigate to="/" />} />
                            </Routes>
                        </div>
                    </div>
                </div>
            </Router>
        </AuthProvider>
    );
}

export default App;