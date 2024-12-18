import React from 'react';
import {Outlet} from 'react-router-dom';
import Sidebar from '../src/components/Sidebar.jsx';
import Navbar from '../src/components/NavBar.jsx';
import {useSelector} from 'react-redux';
import './Layout.css'

const Layout = () => {
    const { isAuthenticated } = useSelector((state) => state.auth);

    return (
        <div className="layout-container">
            {isAuthenticated && <Sidebar />}
            <div className="main-content">
                {isAuthenticated && <Navbar />}
                <div className="content-area bg-green-600">
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default Layout;
