import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import {toast } from 'react-toastify';
import { FiArrowLeftCircle} from 'react-icons/fi'; // Added FiEdit2 icon
import './TrainerEditAttendance.css';

const TrainerEditAttendance = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { sessionId } = location.state || {};

  const [attendanceData, setAttendanceData] = useState([]);
  const [modifiedRows, setModifiedRows] = useState({});

  useEffect(() => {
    if (!sessionId) {
      alert('Session ID missing.');
      navigate(-1);
      return;
    }

    axios
      .get(`http://localhost:8081/viewAttendance/${sessionId}`)
      .then((response) => {
        if (Array.isArray(response.data)) {
          setAttendanceData(
            response.data.map((row) => ({
              employeeId: row.employeeId,
              employeeName: row.employeeName,
              departmentName: row.departmentName,
              attendanceStatus: row.attendanceStatus === 1 ? 'Present' : 'Absent',
            }))
          );
        } else {
          toast.error('Unexpected response format:', response.data);
        }
      })
      .catch((error) => toast.error('Error fetching attendance data:', error));
  }, [sessionId, navigate]);

  const handleRowClick = (index) => {
    setAttendanceData((prevData) => {
      const updatedData = [...prevData];
      const row = updatedData[index];
      const newStatus = row.attendanceStatus === 'Present' ? 'Absent' : 'Present';
      updatedData[index] = { ...row, attendanceStatus: newStatus };

      setModifiedRows((prevModifiedRows) => ({
        ...prevModifiedRows,
        [row.employeeId]: { ...row, attendanceStatus: newStatus },
      }));

      return updatedData;
    });
  };

  const handleSaveAttendance = () => {
    const updatedAttendance = Object.values(modifiedRows).map((row) => ({
      employeeId: row.employeeId,
      sessionId,
      attendanceStatus: row.attendanceStatus === 'Present' ? 1 : 0,
    }));

    axios
      .post('http://localhost:8081/saveAttendance', updatedAttendance)
      .then(() => {
        toast.success('Attendance saved successfully.');
        navigate('/TrainerViewAttendance', { state: { sessionId } });
      })
      .catch((error) => {
        console.error('Error saving attendance:', error);
        toast.success('Error saving attendance. Please try again.');
        navigate('/TrainerViewAttendance', { state: { sessionId } });
      });
  };

  return (
    <div className='Trainer-overall-container'>
      <div className='TrainerEditAttendance-title'><h2>Edit Attendance</h2></div>
      <div className="TableComponent-container">
        <div className='header-and-save'>
          <header className="TrainerEditAttendance-header">
          <FiArrowLeftCircle
                className="back-button"
                onClick={() => navigate(`/TrainerSwitch`)}
                title="Go back"
              />
              View Attendance
          </header>
          <button className="TrainerEditAttendance-save-button" onClick={handleSaveAttendance}>
            Save Attendance
          </button>
        </div>
        <div className="TableComponent-scrollbar">
          
          <table className="TrainerEditAttendance-table">
            <thead>
              <tr>
                <th className="TableComponent-headerCell">Employee Name</th>
                <th className="TableComponent-headerCell">Department</th>
                <th className="TableComponent-headerCell">Attendance Status</th>
                <th className="TableComponent-headerCell">Modified</th>
              </tr>
            </thead>
            <tbody>
              {attendanceData.map((row, index) => (
                <tr
                  key={row.employeeId}
                  className={`TableComponent-row ${
                    row.attendanceStatus === 'Present'
                      ? 'TableComponent-presentRow'
                      : 'TableComponent-absentRow'
                  }`}
                  onClick={() => handleRowClick(index)}
                >
                  <td className="TableComponent-cell">{row.employeeName}</td>
                  <td className="TableComponent-cell">{row.departmentName}</td>
                  <td className="TableComponent-cell">{row.attendanceStatus}</td>
                  <td className="TableComponent-cell">
                    {modifiedRows[row.employeeId] ? 'Changed' : ''}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TrainerEditAttendance;
