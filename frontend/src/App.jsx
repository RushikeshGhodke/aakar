import React, {useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {initializeAuth} from './store/authSlice'; // Adjust the path
import {BrowserRouter as Router, Navigate, Route, Routes} from 'react-router-dom';
import PrivateRoute from './components/PrivateRoute';
import Login from './pages/Login';
import Home from './pages/Home';
import Layout from './Layout.jsx';
import EmployeeDashboard from "./pages/employee/EmployeeDashboard.jsx";
import EmployeeProfile from "./pages/employee/EmployeeProfile.jsx";
import AddEmployee from "./pages/employee/AddEmployee.jsx";
import EditEmployeePage from "./pages/employee/EditEmployeePage.jsx";
import DepartmentDashboard from "./pages/department/DepartmentDashboard.jsx";
import {Bounce, ToastContainer} from "react-toastify";

const App = () => {
    const dispatch = useDispatch();
    const {isLoggedIn} = useSelector((state) => state.auth);

    useEffect(() => {
        dispatch(initializeAuth());
    }, [dispatch]);

    return (
        <>
            <   ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
                transition={Bounce}
            />
            <Router>
                <Routes>
                    {/* Public Route */}
                    <Route path="/login" element={isLoggedIn ? <Navigate to="/"/> : <Login/>}/>

                    {/* Private Routes */}
                    <Route element={<PrivateRoute/>}>
                        <Route element={<Layout/>}>
                            <Route path="/" element={<Home/>}/>
                            <Route path="/employees" element={<EmployeeDashboard/>}/>
                            <Route path="/departments" element={<DepartmentDashboard/>}/>
                            <Route path="/employee/:id" element={<EmployeeProfile/>}/>
                            <Route path="/employee/addEmployee" element={<AddEmployee/>}/>
                            <Route path="/employee/edit/:id" element={<EditEmployeePage/>}/>
                        </Route>
                    </Route>

                    {/* Fallback for undefined routes */}
                    <Route path="*" element={<Navigate to={isLoggedIn ? "/" : "/login"}/>}/>
                </Routes>
            </Router>
        </>
    );
};

export default App;
