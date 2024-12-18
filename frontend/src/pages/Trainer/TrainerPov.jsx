import React from 'react';
import TrainerSwitch from './TrainerSwitch.jsx';
import TrainerTrainingDetails from './TrainerTrainingDetails.jsx';
import TrainerAttendance from './TrainerAttendance.jsx';
import TrainerViewAttendance from './TrainerViewAttendance.jsx';
import TrainerEditAttendance from './TrainerEditAttendance.jsx';
import { Routes, Route } from 'react-router-dom'; 
import EmployeeTrainingEnrolled from './EmployeeTrainingEnrolled.jsx';

function TrainerPov() {
  return (
    <div className="trainerPov">

      <div className="main-content">
        
        <div className="search-bar-container">
          <Routes>
            <Route path="/" element={<TrainerSwitch />} />
            <Route path="/TrainerTrainingDetails" element={<TrainerTrainingDetails />} />
            <Route path="/TrainerAttendance" element={<TrainerAttendance />} />
            <Route path="/TrainerViewAttendance" element={<TrainerViewAttendance />} />
            <Route path="/TrainerEditAttendance" element={<TrainerEditAttendance />} />
            <Route path="/EmployeeTrainingEnrolled" element={<EmployeeTrainingEnrolled />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}

export default TrainerPov;
