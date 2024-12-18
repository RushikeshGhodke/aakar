import React from 'react';


import ManagerSwitch from './ManagerSwitch.jsx';
import SearchBar from './SearchBar.jsx';
import AllTraining from './AllTraining.jsx';
import TrainingDetails from './TrainingDetails.jsx';
import UpdateSkill from './UpdateSkill.jsx';
import Attendance from './Attendance.jsx';
import { Routes, Route } from 'react-router-dom'; 
import './ManagerPov.css'
import SendConformEmpToTraining from './SendConformEmpToTraining.jsx'

function ManagerPov() {
  return (
    <div className="managerPov">
      <div className="manager-main-content">
        <ManagerSwitch />
        <div className="search-bar-container">
          <Routes>
            <Route path="/" element={<SearchBar />} />
            <Route path="/trainings" element={<AllTraining />} />
            <Route path="/training-details" element={<TrainingDetails />} />
            <Route path="/Update_skills" element={<UpdateSkill />} />
            <Route path="/attendance/:sessionId" element={<Attendance />} />
            <Route path="/SendConformEmpToTraining" element={<SendConformEmpToTraining />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}

export default ManagerPov;
