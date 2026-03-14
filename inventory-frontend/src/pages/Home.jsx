import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ShoppingCart, 
  Truck, 
  BarChart3, 
  ArrowRight, 
  Package, 
  ShieldCheck, 
  UserPlus,
  LayoutDashboard,
  Smartphone,
  Shirt,
  Armchair,
  Watch,
  Orbit
} from 'lucide-react';
import '../App.css';

const Home = () => {
  const navigate = useNavigate();

  // Reusable Component for Advertisement/Feature Cards
  const AdCard = ({ icon: Icon, title, description, color }) => (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow group" style={{padding: '20px 20px', margin: '15px 15px'}}>
      <div className={`w-14 h-14 ${color} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
        <Icon className="text-white items-center" size={28} />
      </div>
      <h3 className="text-xl font-bold text-slate-900 mb-3">{title}</h3>
      <p className="text-slate-600 leading-relaxed mb-6">{description}</p>
      <button 
        onClick={() => navigate('/signup')}
        className="flex items-center text-sm font-semibold text-blue-600 hover:gap-2 transition-all"
      >
        Get Started <ArrowRight size={16} className="ml-1" />
      </button>
    </div>
  );

  return (
    <div className="min-h-screen  bg-slate-50 font-sans text-slate-900 py-15" style={{padding: '15px 15px', margin: '15px 15px'}}>

      {/* Hero Section */}
      <section className="relative p-15">
        {/* Background Accents */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-teal-400 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 tracking-tight mb-8 leading-[1.1]">
            Your Ecosystem for Commerce. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-teal-500">
              Simplified and Synchronized.
            </span>
          </h1>
          <p className="text-lg md:text-xl text-slate-600 m-5 p-10 leading-relaxed text-center">
            Connecting discerning shoppers with exceptional suppliers, and businesses with 
            intuitive management. One platform, total control.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center" >
            <button 
              onClick={() => navigate('/signup')}
              className="w-full sm:w-auto flex items-center justify-center gap-3 btn-blueviolet px-8 py-4 rounded font-bold transition-all" style={{padding: '5px 5px', margin: '15px 15px'}}
            >
              <ShoppingCart size={20} className="group-hover:translate-x-1 transition-transform" />
              Start Shopping
            </button>
            <button 
              onClick={() => navigate('/login')}
              className="w-full sm:w-auto flex items-center btn-orange justify-center gap-3 px-8 py-4 rounded font-bold transition-all" style={{padding: '5px 5px', margin: '15px 15px'}}
            >
              <LayoutDashboard size={20} />
              Supplier Portal
            </button>
          </div>

          <p className="text-sm text-slate-400 font-medium text-center" style={{margin: '18px'}}>
            * Registration is mandatory for all roles to ensure secure transactions.
          </p>
        </div>
      </section>

      {/* Featured Advertisement Blocks */}
      <section className="py-24 bg-white" style={{padding: '15px 15px', margin: '15px 15px'}}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-slate-900 mb-4 p-10">Engineered for Every User</h2>
            <p className="text-slate-500 p-10 m-10">Discover the features that make ShopSphere the leading choice for global commerce.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8" style={{padding: '18px 18px', margin: '18px 18px'}}>
            <AdCard 
              icon={Package} 
              title="Curated Collections" 
              description="Browse high-quality products from verified suppliers worldwide. Our strict vetting ensures you only see the best."
              color="bg-blue-600"
            />
            <AdCard 
              icon={Truck} 
              title="Supplier Efficiency" 
              description="List your products in seconds and reach thousands of customers. Powerful tools to scale your business reach."
              color="bg-teal-500"
            />
            <AdCard 
              icon={BarChart3} 
              title="Operational Insight" 
              description="Admins get bird's-eye views with deep analytics, reporting, and management tools for seamless oversight."
              color="bg-indigo-600"
            />
          </div>
        </div>
      </section>

      {/* Category Shortcuts */}
      <section className="py-24 bg-slate-50 border-y border-slate-200" style={{padding: '15px 15px', margin: '15px 15px'}}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
            <div style={{padding: '15px 15px', margin: '20px 20px'}}>
              <h2 className="text-3xl font-bold text-slate-900">Explore by Category</h2>
              <p className="text-slate-500">Find exactly what you need through our organized catalogs.</p>
            </div>
            <button onClick={() => navigate('/signup')} className="border text-center btn-light rounded text-m hover:bg-white transition-all" style={{padding: '5px 5px', margin: '15px 15px'}}>
              View All Categories
            </button>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 items-center">
            {[
              { name: 'Electronics', icon: Smartphone, count: '4.2k items' },
              { name: 'Apparel', icon: Shirt, count: '12k items' },
              { name: 'Furniture', icon: Armchair, count: '1.5k items' },
              { name: 'Accessories', icon: Watch, count: '3.1k items' }
            ].map((cat, idx) => (
              <div key={idx} className="bg-white p-6 rounded-2xl border border-slate-200 hover:border-blue-400 transition-colors cursor-pointer items-center text-center group" style={{padding: '18px 18px', margin: '15px 15px'}}>
                <div className="w-16 h-16 mx-auto bg-slate-100 rounded-full flex items-center justify-center pl-10 group-hover:bg-blue-50 transition-colors">
                  <cat.icon className="text-slate-600 group-hover:text-blue-600 items-center pl-20" size={32} />
                </div>
                <h4 className="font-bold text-slate-800">{cat.name}</h4>
                <p className="text-xs text-slate-400 mt-1">{cat.count}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Security Banner */}
      <section className="py-12 bg-blue-700 text-white" style={{padding: '20px 20px', margin: '18px 18px'}}>
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-center gap-12">
          <div className="flex items-center gap-4">
            <ShieldCheck size={40} className="text-blue-200" />
            <div>
              <p className="font-bold text-lg leading-tight">Secure Global Network</p>
              <p className="text-blue-100 text-sm">Encrypted transactions and verified partners only.</p>
            </div>
          </div>
          <div className="h-px w-20 bg-blue-500 hidden md:block"></div>
          <div className="flex items-center gap-4">
            <UserPlus size={40} className="text-blue-200" />
            <div>
              <p className="font-bold text-lg leading-tight">Verified Registration</p>
              <p className="text-blue-100 text-sm">Mandatory for shoppers, suppliers, and managers.</p>
            </div>
          </div>
        </div>
      </section>
      {/* Simple Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12 border-t border-slate-800 mt-10" style={{padding: '20px 20px'}}>
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-6">
            <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center">
              <Orbit className="text-white" size={14} />
            </div>
            <span className="text-xl font-bold tracking-tight text-white">ShopSphere</span>
          </div>
          <p className="text-sm mb-8">© 2026 ShopSphere Ecosystem. All rights reserved.</p>
          <div className="flex justify-center gap-8 text-xs font-medium uppercase tracking-widest">
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
            <a href="#" className="hover:text-white transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;