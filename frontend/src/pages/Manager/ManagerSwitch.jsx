// ManagerSwitch.js
import React, { useState, useEffect } from 'react';
import { FiAward, FiUser } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import './ManagerSwitch.css';
import { toast } from 'react-toastify';

const CustomButton = ({ text, icon, onClick, isActive }) => {
  return (
    <button className={`custom-button ${isActive ? 'active' : ''}`} onClick={onClick}>
      <span className="icon">{icon}</span>
      <span className="text">{text}</span>
    </button>
  );
};

const ManagerSwitch = () => {
  const [activeButton, setActiveButton] = useState('employees');
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Event listener for 'departmentSelected' custom event
    const handleDepartmentSelected = (event) => {
      setSelectedDepartment(event.detail);
    };

    window.addEventListener('departmentSelected', handleDepartmentSelected);

    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener('departmentSelected', handleDepartmentSelected);
    };
  }, []);

  const handleTrainingsClick = () => {
    setActiveButton('trainings');
    navigate('/trainings');
  };

  const handleEmployeesClick = () => {
    setActiveButton('employees');
    navigate('/search');
  };

  const handleDeptGClick = () => {
    setActiveButton('gtraining');
    navigate('/SendAndGiveTraining');
  };

  const handleUpdateSkillClick = () => {
    if (!selectedDepartment) {
      toast.error('Select department first'); // Show toast message if no department is selected
      return;
    }
    
    // Navigate to the UpdateSkill page with the selected department's ID
    navigate('/Update_skills', {
      state: {
        departmentId: selectedDepartment.value,
        departmentName: selectedDepartment.label,
      },
    });
  };

  return (
    <div className="button-container">
      <CustomButton
        text="My trainings"
        icon={<FiAward />}
        onClick={handleTrainingsClick}
        isActive={activeButton === 'trainings'}
      />
      <CustomButton
        text="Employees"
        icon={<FiUser />}
        onClick={handleEmployeesClick}
        isActive={activeButton === 'employees'}
      />
      <CustomButton
        text="Give training"
        icon={<FiUser />}
        onClick={handleDeptGClick}
        isActive={activeButton === 'gtraining'}
      />
      <CustomButton
        text="Update skill"
        icon={<FiAward />}
        onClick={handleUpdateSkillClick}
        isActive={activeButton === 'updateSkill'}
      />
    </div>
  );
};

export default ManagerSwitch;
