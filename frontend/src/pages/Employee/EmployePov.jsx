import React from 'react';

import EmployeeSwitch from './EmployeeSwitch';
import EmployeeTrainingDetails from './EmployeeTrainingDetails';
import { Routes, Route } from 'react-router-dom'; // Removed Router, kept Routes

function EmployeePov() {
  return (
    <div className="employeePov">

      <div className="main-content">
        
        <div className="search-bar-container">
          <Routes>
            <Route path="/" element={<EmployeeSwitch />} />
            <Route path="/EmployeeTrainingDetails" element={<EmployeeTrainingDetails />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}

export default EmployeePov;
