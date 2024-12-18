import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FiArrowLeftCircle } from 'react-icons/fi';
import TableComponent from '../Components/TableComponent';
import './ManagherEmployeeTrainingEnrolled.css';

const ManagerEmployeeTrainingEnrolled = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { trainingId } = location.state || {};
  const [employeeData, setEmployeeData] = useState([]);

  useEffect(() => {
    if (!trainingId) {
      toast.error('Training ID is missing.');
      navigate(-1);
      return;
    }

    axios
      .get(`http://localhost:8081/employeesEnrolled/${trainingId}`)
      
      .then((response) => {
        console.log(trainingId)
        if (Array.isArray(response.data)) {
          setEmployeeData(
            response.data.map((employee) => ({
              ...employee,
              employeeId: employee.employeeId || employee.id,
            }))
          );
        } else {
          toast.error('Unexpected response format:', response.data);
        }
      })
      .catch((error) => toast.error('Error fetching employee data:', error));
  }, [trainingId, navigate]);

  const columns = [
    { id: 'employeeName', label: 'Employee Name', align: 'center' },
    { id: 'departmentName', label: 'Department', align: 'center' },
    { id: 'trainerFeedback', label: 'Trainer Feedback', align: 'center',
      render: (row) => {
        if (row.trainerFeedback === 1) {
          return 'Pass'; 
        } else if (row.trainerFeedback === 0) {
          return 'Fail';  
        } else {
          return ''; 
        }
      }
     }
  ];

  return (
    <div className="employeetrainingenrolled-page">
      <div className="employeetrainingenrolled-title">
        <h2>Employees Enrolled for Training</h2>
      </div>
          <header className="employeetrainingenrolled-header">
            <FiArrowLeftCircle
              className="back-button"
              onClick={() => navigate(-1)}
              title="Go back"
            />
            View Training Details
          </header>
        <TableComponent
          rows={employeeData}
          columns={columns}
          linkBasePath={null}
        />
      </div>
  );
};

export default ManagerEmployeeTrainingEnrolled;
