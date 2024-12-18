import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './Attendance.css';
import { FiArrowLeftCircle } from 'react-icons/fi';
import TableComponent from '../Components/TableComponent'; // Import the reusable table component

const Attendance = () => {
  const { sessionId } = useParams(); // Get sessionId from URL params
  const [attendanceData, setAttendanceData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const response = await fetch(`http://localhost:8081/api/sessions/attendance/${sessionId}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setAttendanceData(data);
      } catch (error) {
        console.error('Error fetching attendance data:', error);
      }
    };

    fetchAttendance();
  }, [sessionId]);

  // Define columns for the attendance table
  const columns = [
    { id: 'employeeName', label: 'Employee Name', align: 'left' },
    { 
      id: 'attendanceStatus', 
      label: 'Attendance Status', 
      align: 'left',
      render: (row) => (row.attendanceStatus === 1 ? 'Present' : 'Absent') // Render the status dynamically
    }
  ];

  return (
    <div className="attendance-container">
      <h2 className="attendance-title">Attendance</h2>

      <header className="attendance-dash-header">
        <FiArrowLeftCircle className="employeeSwitch-back-button" onClick={() => navigate(-1)} title="Go back"/>
        <h4 className='employeeSwitch-title'>Training Details</h4>
      </header>

      <div className='attendance-table-container'>
        <TableComponent 
          rows={attendanceData} 
          columns={columns} 
          linkBasePath={null} 
        />
      </div>
    </div>
  );
};

export default Attendance;
