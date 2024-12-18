import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {toast } from 'react-toastify';
import { FiArrowLeftCircle } from 'react-icons/fi';
import TableComponent from '../Components/TableComponent';
import './TrainerViewAttendance.css';

const TrainerViewAttendance = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { sessionId, trainingId } = location.state || {};
  const [attendanceData, setAttendanceData] = useState([]);

  useEffect(() => {
    if (!sessionId) {
      alert('Session ID is missing.');
      navigate(-1);
      return;
    }

    axios
      .get(`http://localhost:8081/viewAttendance/${sessionId}`)
      .then((response) => {
        if (Array.isArray(response.data)) {
          setAttendanceData(
            response.data.map((record) => ({
              ...record,
              attendanceStatus: record.attendanceStatus === 1 ? 'Present' : 'Absent',
            }))
          );
        } else {
          console.error('Unexpected response format:', response.data);
        }
      })
      .catch((error) => {
        console.error('Error fetching attendance data:', error);
        navigate(`/TrainerAttendance`, { state: { trainingId, sessionId } });
      });
  }, [sessionId, navigate, trainingId]);

  const columns = [
    { id: 'employeeName', label: 'Employee Name', align: 'left' },
    { id: 'departmentName', label: 'Department', align: 'left' },
    { id: 'attendanceStatus', label: 'Attendance Status', align: 'center' },
  ];

  const rowClassName = (employeeId) => {
    const employee = attendanceData.find((row) => row.employeeId === employeeId);

    if (!employee || !employee.attendanceStatus) {
      return '';
    }
  };

  const handleEditAttendance = () => {
    navigate('/TrainerEditAttendance', { state: { sessionId, trainingId } });
  };

  return (
    <div className="TrainerViewAttendance-page">
      <div className='TrainerViewAttendance-title'><h2>Attendence Details</h2></div>
        <div className="TrainerViewAttendance-table-container">
          <div classname = 'TrainerViewAttendance-header-and-save'>
            <header className="TrainerViewAttendance-dash-header">
              <FiArrowLeftCircle
                className="back-button"
                onClick={() => navigate(`/TrainerSwitch`)}
                title="Go back"
              />
              Back session details page
            </header>
            <button
              className="TrainerViewAttendance-edit-button"
              onClick={handleEditAttendance}
            >
            Edit Attendance
            </button>
          </div>

        {attendanceData.length === 0 ? (
          <div className="TrainerViewAttendance-no-records-message">
            <p>No attendance record found. Redirecting to attendance filling page...</p>
          </div>
        ) : (
          <TableComponent
            rows={attendanceData}
            columns={columns}
            rowClassName={rowClassName}
          />
        )}
      </div>
    </div>
  );
};

export default TrainerViewAttendance;
