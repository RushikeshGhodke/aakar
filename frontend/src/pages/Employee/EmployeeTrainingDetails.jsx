import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import Textfield from '../Components/Textfield';
import TableComponent from '../Components/TableComponent'; // Import the reusable table component
import '../Overall/TrainingDetails.css';
import { FiArrowLeftCircle } from 'react-icons/fi';

import dayjs from 'dayjs';
import '../Overall/TrainingDetails.css';

const EmployeeTrainingDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [sessionData, setSessionData] = useState([]);

  const [attendanceStatuses, setAttendanceStatuses] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { 
    employeeId,
    trainingId, 
    trainingTitle, 
    trainerName, 
    startTrainingDate, 
    endTrainingDate 
  } = location.state || {};
  


  useEffect(() => {
    // Fetch session data
    axios.get(`http://localhost:8081/training/all_sessions/${trainingId}`)
      .then((response) => {
        if (Array.isArray(response.data)) {
          setSessionData(response.data);
        } else {
          console.error('Session data format is incorrect:', response.data);
        }
      })
      .catch((error) => console.error('Error fetching session data:', error));
    
  }, [trainingId]);

  // Fetch attendance data for sessions
  useEffect(() => {
    const fetchAttendanceForSession = async (sessionId) => {
      try {
        const response = await fetch(
          `http://localhost:8081/api/attendance?employeeId=${employeeId}&sessionId=${sessionId}`
        );
        if (!response.ok) {
          throw new Error(`Failed to fetch attendance for session ${sessionId}. Status: ${response.status}`);
        }
        const data = await response.json();
        return data.attendanceStatus; // Assuming the response contains attendanceStatus field
      } catch (error) {
        console.error(`Error fetching attendance for session ${sessionId}:`, error);
        throw error;
      }
    };

    const fetchAllAttendance = async () => {
      try {
        if (!sessionData || sessionData.length === 0) return;

        const statuses = {};
        for (const session of sessionData) {
          if (session.sessionId) {
            const attendanceStatus = await fetchAttendanceForSession(session.sessionId);
            statuses[session.sessionId] = attendanceStatus;
          }
        }
        setAttendanceStatuses(statuses);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (sessionData.length > 0) {
      fetchAllAttendance();
    }
  }, [employeeId, sessionData]);

  if (loading) {
    return <p>Loading attendance data...</p>;
  }

  if (error) {
    return <p>Error loading attendance data: {error}</p>;
  }

  const sessionColumns = [
    { id: 'sessionName', label: 'Session Name' },
    { id: 'sessionDate', label: 'Date', render: (row) => new Date(row.sessionDate).toLocaleDateString('en-US') },
    { id: 'sessionStartTime', label: 'Start Time' },
    { id: 'sessionEndTime', label: 'End Time' },
    {
      id: 'attendanceStatus',
      label: 'Attendance Status',
      render: (row) => attendanceStatuses[row.sessionId] === 1 ? 'Present' : 'Absent',
    },
  ];

  return (
    <div className="training-details-page">
      <div className="training-main-content">
        <header className="training-details-dash-header">
          <FiArrowLeftCircle
            className="employeeSwitch-back-button"
            onClick={() => navigate(-1)}
            title="Go back"
          />
          <h4 className='employeeSwitch-title'>All Trainings</h4>
        </header>
        <section className="training-details-section">
          <h3>Training Details</h3>
          <div className="training-details-form">
            <Textfield label="Training Name" value={trainingTitle || ''} readOnly />
            <Textfield label="Trainer Name" value={trainerName || ''} readOnly />
            <Textfield label="Start Date" value={dayjs(startTrainingDate).format("YYYY-MM-DD") || ''} readOnly />
            <Textfield label="End Date" value={dayjs(endTrainingDate).format("YYYY-MM-DD") || ''} readOnly />
          </div>
        </section>
        <section className="training-details-session-details-section">
          <h3>Session Details</h3>
          <TableComponent
            rows={sessionData}
            columns={sessionColumns}
            linkBasePath={null} 
          />
        </section>
      </div>
    </div>
  );
};

export default EmployeeTrainingDetails;