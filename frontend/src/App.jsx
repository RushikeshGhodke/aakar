import React from 'react';
import { useSelector } from 'react-redux';
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
import AddDepartment from "./pages/department/AddDepartment.jsx";
import DepartmentProfile from "./pages/department/DepartmentProfile.jsx";
import Profile from "./pages/Profile.jsx";

const App = () => {
    const {isAuthenticated} = useSelector((state) => state.auth);

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
                    <Route path="/login" element={isAuthenticated ? <Navigate to="/"/> : <Login/>}/>

                    <Route element={<Layout/>}>
                        <Route
                            path="/"
                            element={
                                <PrivateRoute>
                                    <Home/>
                                </PrivateRoute>
                            }
                        />
                        <Route
                            path="/employees"
                            element={
                                <PrivateRoute>
                                    <EmployeeDashboard/>
                                </PrivateRoute>
                            }
                        />
                        <Route
                            path="/departments"
                            element={
                                <PrivateRoute>
                                    <DepartmentDashboard/>
                                </PrivateRoute>
                            }
                        />
                        <Route
                            path="/department/addDepartment"
                            element={
                                <PrivateRoute>
                                    <AddDepartment/>
                                </PrivateRoute>
                            }
                        />
                        <Route
                            path="/department/:id"
                            element={
                                <PrivateRoute>
                                    <DepartmentProfile/>
                                </PrivateRoute>
                            }
                        />
                        <Route
                            path="/employee/:id"
                            element={
                                <PrivateRoute>
                                    <EmployeeProfile/>
                                </PrivateRoute>
                            }
                        />
                        <Route
                            path="/employee/addEmployee"
                            element={
                                <PrivateRoute>
                                    <AddEmployee/>
                                </PrivateRoute>
                            }
                        />
                        <Route
                            path="/employee/edit/:id"
                            element={
                                <PrivateRoute>
                                    <EditEmployeePage/>
                                </PrivateRoute>
                            }
                        />
                        <Route
                            path="/profile"
                            element={
                                <PrivateRoute>
                                    <Profile/>
                                </PrivateRoute>
                            }
                        />
                    </Route>
                    <Route path="*" element={<Navigate to={isAuthenticated ? "/" : "/login"}/>}/>
                </Routes>
            </Router>
        </>
    );
};

export default App;
