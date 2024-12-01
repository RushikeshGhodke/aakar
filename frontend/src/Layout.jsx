import React from 'react';
import {Outlet, useNavigate} from 'react-router-dom';
import Sidebar from '../src/components/Sidebar.jsx';
import Navbar from '../src/components/NavBar.jsx';
import {useDispatch, useSelector} from 'react-redux';
import Cookies from 'js-cookie';
import {getCookie} from "./utils/cookie.js";
// import './Layout.css'

const Layout = () => {
    const { isLoggedIn } = useSelector((state) => state.auth);

    return (
        <div className="layout-container">
            {isLoggedIn && <Sidebar />}
            <div className="main-content">
                {isLoggedIn && <Navbar />}
                <div className="content-area bg-green-600">
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default Layout;
