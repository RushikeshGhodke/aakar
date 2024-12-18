import React, { useState } from 'react';
import { FiAward, FiUser } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from "jwt-decode";

const CustomButton = ({ text, icon, onClick, isActive, disabled }) => {
  return (
    <button 
      className={`custom-button ${isActive ? 'active' : ''} ${disabled ? 'disabled' : ''}`}
      onClick={onClick}
      disabled={disabled}
    >
      <span className="icon">{icon}</span>
      <span className="text">{text}</span>
    </button>
  );
};

const OverallSwitch = () => {
  const [activeButton, setActiveButton] = useState('');
  const navigate = useNavigate();

  const token = localStorage.getItem('accessToken');
  let employeeId = null;

  if (token) {
    try {
      const decoded = jwtDecode(token); 
      employeeId = decoded.employeeId;
      console.log("Fetched emp id:", employeeId);
    } catch (error) {
      console.error("Error decoding token:", error.message);
    }
  } else {
    console.error("No token found in localStorage");
  }

  const accessString = localStorage.getItem('accessString');
  let access = { manager: false, trainer: false, employee: false }; 

  if (accessString) {
    const myAccess = accessString.split(',');
    console.log("Training module access: ", myAccess[3]);

    if (myAccess.length > 3 && myAccess[3]) {
      const firstThree = myAccess[3].substring(0, 3);
      access = {
        manager: firstThree[0] === '1',
        trainer: firstThree[1] === '1',
        employee: firstThree[2] === '1',
      };
      console.log("Access rights:", access);
    }
  } else {
    console.log("No access string found!");
  }

  const handleManagerClick = () => {
    setActiveButton('ManagerPov');
    navigate('/manager-overall', { state: { employeeId } });
  };

  const handleEmployeeClick = () => {
    setActiveButton('EmployeePov');
    navigate('/employee-overall', { state: { employeeId } });
  };

  const handleTrainerClick = () => {
    setActiveButton('TrainerPov');
    navigate('/TrainerSwitch', { state: { employeeId } });
  };

  return (
    <div className="button-container">
      <CustomButton
        text="Manager POV"
        icon={<FiAward />}
        onClick={handleManagerClick}
        isActive={activeButton === 'ManagerPov'}
        disabled={!access.manager}
      />
      <CustomButton
        text="Employee POV"
        icon={<FiUser />}
        onClick={handleEmployeeClick}
        isActive={activeButton === 'EmployeePov'}
        disabled={!access.employee}
      />
      <CustomButton
        text="Trainer POV"
        icon={<FiAward />}
        onClick={handleTrainerClick}
        isActive={activeButton === 'TrainerPov'}
        disabled={!access.trainer}
      />
    </div>
  );
};

export default OverallSwitch;
