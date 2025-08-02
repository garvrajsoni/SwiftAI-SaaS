import React, { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import { assets } from '../assets/assets';

const Layout = () => {
  const navigate = useNavigate();
  const [sidebar, setSidebar] = useState(false);

  return (
    <div className="h-screen flex flex-col">
      {/* Navbar */}
      <nav className='z-50 w-full flex justify-between items-center px-4 sm:px-20 xl:px-32 py-3 bg-white shadow-sm'>
        <img src={assets.logo} alt="Logo" onClick={() => navigate('/')} className="cursor-pointer h-8" />
        {
          sidebar ? (
            <X onClick={() => setSidebar(false)} className="w-6 h-6 text-gray-600 sm:hidden" />
          ) : (
            <Menu onClick={() => setSidebar(true)} className="w-6 h-6 text-gray-600 sm:hidden" />
          )
        }
      </nav>

      {/* Sidebar + Main Content */}
      <div className="flex flex-1 overflow-hidden">
        <Sidebar sidebar={sidebar} setSidebar={setSidebar} />

        <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Layout;
