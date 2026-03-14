import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  ShoppingBag, ShoppingCart, ListOrdered, User, LogOut, 
  PackagePlus, LayoutDashboard, Users, Truck, BarChart3, ClipboardList, Orbit 
} from 'lucide-react';

const Sidebar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    if (!user) return null;

    const renderLinks = () => {
        const iconSize = 20;
        switch (user.role) {
            case 'ROLE_USER':
                return (
                    <>
                        <li><Link to="/user"><ShoppingBag size={iconSize}/> Products</Link></li>
                        <li><Link to="/user/cart"><ShoppingCart size={iconSize}/> Cart</Link></li>
                        <li><Link to="/user/orders"><ListOrdered size={iconSize}/> My Orders</Link></li>
                        <li><Link to="/user/account"><User size={iconSize}/> My Profile</Link></li>
                    </>
                );
            case 'ROLE_SUPPLIER':
                return (
                    <>
                        <li><Link to="/supplier"><ShoppingBag size={iconSize}/> Products</Link></li>
                        <li><Link to="/supplier/update"><PackagePlus size={iconSize}/> Update Products</Link></li>
                        <li><Link to="/supplier/orders"><ClipboardList size={iconSize}/> Customer Orders</Link></li>
                        <li><Link to="/supplier/account"><User size={iconSize}/> Business Profile </Link></li>
                    </>
                );
            case 'ROLE_ADMIN':
                return (
                    <>
                        <li><Link to="/admin/users"><Users size={iconSize}/> Customers</Link></li>
                        <li><Link to="/admin/suppliers"><Truck size={iconSize}/> Vendors</Link></li>
                        <li><Link to="/admin/orders"><ListOrdered size={iconSize}/> Orders</Link></li>
                        <li><Link to="/admin/analysis"><BarChart3 size={iconSize}/> Analysis</Link></li>
                        <li><Link to="/admin/account"><User size={iconSize}/> Admin Settings </Link></li>
                    </>
                );
            default: return null;
        }
    };

    return (
        <div className="sidebar">
            <div className="sidebar-header">
                <h3 style={{ letterSpacing: '1px', color: '#fff' }}><Orbit size={20}/>ShopSphere</h3>
                <p><User size={20}/> {user.role.replace('ROLE_', '')}</p>
            </div>
            <ul className="sidebar-links">
                {renderLinks()}
            </ul>
            <div className="sidebar-footer">
                <button onClick={handleLogout} className="logout-btn">
                    <LogOut size={18}/> Logout
                </button>
            </div>
        </div>
    );
};

export default Sidebar;