import React, { useState, useEffect } from 'react';
import { FiAward, FiUser } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import './ManagerSwitch.css';

const CustomButton = ({ text, icon, onClick, isActive }) => {
  return (
    <button className={`custom-button ${isActive ? 'active' : ''}`} onClick={onClick}>
      <span className="icon">{icon}</span>
      <span className="text">{text}</span>
    </button>
  );
};

const TrainingSwitch = () => {
  const [activeButton, setActiveButton] = useState();
  const navigate = useNavigate();

  const handleEmployeesToTrainClick = () => {
    setActiveButton('EmployeesToTrain');
    navigate('/Dept_G_training');
  };

  const handleGiveTrainingClick = () => {
    setActiveButton('GiveTraining');
    navigate('/SendEmpToTraining');
  };

  const handleSendConfirmEmployeeClick = () => {
    setActiveButton('SendConfirm');
    navigate('/SendConformEmpToTraining');
  };

  return (
    <div className="button-container">
      <CustomButton
        text="Employees To Train"
        icon={<FiAward />}
        onClick={handleEmployeesToTrainClick}
        isActive={activeButton === 'EmployeesToTrain'}
      />
      <CustomButton
        text="Give Training"
        icon={<FiUser />}
        onClick={handleGiveTrainingClick}
        isActive={activeButton === 'GiveTraining'}
      />
      <CustomButton
        text="Send Employees"
        icon={<FiUser />}
        onClick={handleSendConfirmEmployeeClick}
        isActive={activeButton === 'SendConfirm'}
      />
    </div>
  );
};

export default TrainingSwitch;
