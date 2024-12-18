import React, {useEffect} from 'react';
import {useSelector} from 'react-redux';
import {BrowserRouter as Router, Navigate, Route, Routes} from 'react-router-dom';
import PrivateRoute from './components/PrivateRoute';
import Login from './pages/Login';
import Layout from './Layout.jsx';
import {Bounce, ToastContainer} from "react-toastify";

import ManagerPov from './pages/Manager/ManagerPov';
import EmployeePov from './pages/Employee/EmployePov';
import TrainerPov from './pages/Trainer/TrainerPov';
import OverallSwitch from './pages/Overall/OverallSwitch.jsx';
import SearchBar from './pages/Manager/SearchBar.jsx';
import AllTraining from './pages/Manager/AllTraining.jsx';
import TrainingDetails from './pages/Manager/TrainingDetails.jsx';
import UpdateSkill from './pages/Manager/UpdateSkill.jsx';
import Attendance from './pages/Manager/Attendance.jsx';
import ShowTrainingDept from './pages/Manager/ShowTrainingDept.jsx';
import SendEmpToTraining from './pages/Manager/SendEmpToTraining.jsx';
import TrainingSwitch from './pages/Manager/TrainingSwitch.jsx';
import EmployeeSwitch from './pages/Employee/EmployeeSwitch.jsx';
import EmployeeTrainingDetails from './pages/Employee/EmployeeTrainingDetails.jsx';
import TrainerSwitch from './pages/Trainer/TrainerSwitch.jsx';
import TrainerTrainingDetails from './pages/Trainer/TrainerTrainingDetails.jsx';
import TrainerAttendance from './pages/Trainer/TrainerAttendance.jsx';
import TrainerViewAttendance from './pages/Trainer/TrainerViewAttendance.jsx';
import TrainerEditAttendance from './pages/Trainer/TrainerEditAttendance.jsx';
import EmployeeTrainingEnrolled from './pages/Trainer/EmployeeTrainingEnrolled.jsx';
import SendConformEmpToTraining from './pages/Manager/SendConformEmpToTraining.jsx'


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
                    {/* Public Route */}
                    <Route path="/login" element={isLoggedIn ? <Navigate to="/overall-switch"/> : <Login/>}/>
                    <Route element={<Layout/>}>
                    {/* Private Routes */}
                    <Route element={<PrivateRoute/>}>
                        
                            <Route path="/overall-switch" element={<OverallSwitch />} />
                            <Route path="/manager-overall/*" element={<ManagerPov />} />
                            <Route path="/employee-overall/*" element={<EmployeePov />} />
                            <Route path="/trainer-overall/*" element={<TrainerPov />} />
                            <Route path="/search" element={<SearchBar />} />
                            <Route path="/trainings" element={<AllTraining />} />
                            <Route path="/training-details" element={<TrainingDetails />} />
                            <Route path="/Update_skills" element={<UpdateSkill />} />
                            <Route path="/SendAndGiveTraining" element={<TrainingSwitch />} />
                            <Route path="/Dept_G_training" element={<ShowTrainingDept />} />
                            <Route path="/SendEmpToTraining" element={<SendEmpToTraining />} />
                            <Route path="/attendance/:sessionId" element={<Attendance />} />
                            <Route path="/EmployeeSwitch" element={<EmployeeSwitch />} />
                            <Route path="/EmployeeTrainingDetails" element={<EmployeeTrainingDetails />} />
                            <Route path="/TrainerSwitch" element={<TrainerSwitch />} />
                            <Route path="/TrainerTrainingDetails" element={<TrainerTrainingDetails />} />  
                            <Route path="/TrainerAttendance" element={<TrainerAttendance />} />       
                            <Route path="/TrainerViewAttendance" element={<TrainerViewAttendance />} />      
                            <Route path="/TrainerEditAttendance" element={<TrainerEditAttendance />} />
                            <Route path="/EmployeeTrainingEnrolled" element={<EmployeeTrainingEnrolled />} />
                            <Route path="/SendConformEmpToTraining" element={<SendConformEmpToTraining />} />             
                        </Route>
                    </Route>

                    {/* Fallback for undefined routes */}
                    <Route path="*" element={<Navigate to={isAuthenticated ? "/" : "/login"}/>}/>
                </Routes>
            </Router>
        </>
    );
};

export default App;
