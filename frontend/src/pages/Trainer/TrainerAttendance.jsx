import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FiArrowLeftCircle } from 'react-icons/fi';
import './TrainerAttendance.css';

const AttendancePage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { trainingId, sessionId } = location.state || {};
  const [employeeData, setEmployeeData] = useState([]);
  const [selectedEmployees, setSelectedEmployees] = useState(new Set());
  const [attendanceSaved, setAttendanceSaved] = useState(false);

  useEffect(() => {
    if (!trainingId) {
      toast.error('Training ID is missing.');
      navigate(-1);
      return;
    }

    axios
      .get(`http://localhost:8081/employeesEnrolled/${trainingId}`)
      .then((response) => {
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

  const handleRowClick = (employeeId) => {
    const updatedSelection = new Set(selectedEmployees);
    if (updatedSelection.has(employeeId)) {
      updatedSelection.delete(employeeId);
    } else {
      updatedSelection.add(employeeId);
    }
    setSelectedEmployees(updatedSelection);
  };

  const handleSaveAttendance = () => {
    const attendanceData = employeeData.map((employee) => ({
      employeeId: employee.employeeId,
      sessionId,
      attendanceStatus: selectedEmployees.has(employee.employeeId) ? 1 : 0,
    }));

    axios
      .post('http://localhost:8081/saveAttendance', attendanceData)
      .then(() => {
        toast.success('Attendance saved successfully.');
        setAttendanceSaved(true);
        navigate('/TrainerViewAttendance', { state: { sessionId } });
      })
      .catch((error) => {
        toast.error('Failed to save attendance. Please try again.');
        navigate('/TrainerViewAttendance', { state: { sessionId } });
      });
  };

  return (
    <div className="TrainerAttendance-container">
      <div className='trainerattendance-title'><h2>Fill Attendance</h2></div>
      <div className="trainerattendance-tablecomponent-container">
        <div className='trainerattendance-header-and-save'>
          <header className="trainerattendance-header">
            <FiArrowLeftCircle className="trainer-attendance-back-button" onClick={() => navigate(`/TrainerSwitch`)} title="Go back"/>
            <h4 className='trainer-attendance-title'>View Session Details</h4>
          </header>
          <button className="TrainerAttendance-save-button" onClick={handleSaveAttendance}>Save Attendance</button>
        </div>

        <div className="TableComponent-scrollbar">
            <table className="TrainerEditAttendance-table">
              <thead>
                <tr>
                  <th className="TableComponent-headerCell">Sr. No.</th>
                  <th className="TableComponent-headerCell">Employee Name</th>
                  <th className="TableComponent-headerCell">Department</th>
                </tr>
              </thead>
              <tbody>
                {employeeData.map((employee, index) => (
                  <tr
                    key={employee.employeeId}
                    className={`TableComponent-row ${
                    selectedEmployees.has(employee.employeeId) ? 'TrainerAttendance-row-selected' : ''
                    }`}
                    onClick={() => handleRowClick(employee.employeeId)}
                  >
                    <td className="TableComponent-cell">{index + 1}</td>
                    <td className="TableComponent-cell">{employee.employeeName}</td>
                    <td className="TableComponent-cell">{employee.departmentName}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
      </div>
    </div>
  );
};

export default AttendancePage;
