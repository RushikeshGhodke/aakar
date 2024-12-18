import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import Textfield from '../Components/Textfield';
import TableComponent from '../Components/TableComponent'; 
import '../Overall/TrainingDetails.css';
import { FiEye, FiArrowLeftCircle } from 'react-icons/fi';
import dayjs from 'dayjs';
import '../Overall/TrainingDetails.css'

const TrainingDetails = () => {
    const location = useLocation();
    const { 
        trainingId, 
        trainingTitle, 
        trainerName, 
        startTrainingDate, 
        endTrainingDate 
      } = location.state || {};
    const navigate = useNavigate();
    const [trainingData, setTrainingData] = useState({});
    const [sessionData, setSessionData] = useState([]);
    
    useEffect(() => {
      // Fetch session data
      console.log("Location rtrsifi",trainingId)
      axios.get(`http://localhost:8081/training/all_sessions/${trainingId}`)
          .then((response) => {
              if (Array.isArray(response.data)) {
                  const formattedSessions = response.data.map((session) => ({
                      ...session,
                      sessionDate: formatDate(session.sessionDate), // Format sessionDate here
                  }));
                  setSessionData(formattedSessions);
              } else {
                  console.error('Session data format is incorrect:', response.data);
              }
          })
          .catch((error) => console.error('Error fetching session data:', error));
  }, [trainingId]);
  

    const formatDate = (dateString) => {
      if (!dateString) return '';
      const date = new Date(dateString);
      // Format date as MM/DD/YYYY
      return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
    };

    const handleEmployees = () => {
        navigate('/EmployeeTrainingEnrolled', { state: { trainingId } });
      }

    const handleViewAttendance = (sessionId) => {
        navigate(`/attendance/${sessionId}`);
    };


    // Define columns for TableComponent
    const columns = [
        { id: 'sessionName', label: 'Session Name', align: 'center' },
        { id: 'sessionDate', label: 'Date', align: 'center' },
        { id: 'sessionStartTime', label: 'Start Time', align: 'center' },
        { id: 'sessionEndTime', label: 'End Time', align: 'center' },
        {
            id: 'actions',
            label: 'Actions',
            align: 'center',
            render: (row) => (
                <>
                <FiEye onClick={() => handleViewAttendance(row.sessionId)} className="action-icon" size={18} style={{color: '#0061A1', fontWeight: '900'}}/>                    
                </>
            ),
        },
    ];


    return (
        <div className="training-details-page">
            <div className="training-details-main-content">
                <header className="training-details-dash-header">
                    <FiArrowLeftCircle
                        className="employeeSwitch-back-button"
                        onClick={() => navigate(-1)}
                        title="Go back"
                    />
                    <h4 className='employeeSwitch-title'>All Trainings</h4>
                </header>
                <section className="training-details-section">
                    <h3>Training details
                    <button className="training-details-employee-button" onClick={handleEmployees}>
                            Employees
                        </button>
                    </h3>
                    <div className="training-details-form">
                        <Textfield label="Training Name" value={trainingTitle || ''} readOnly />
                        <Textfield label="Trainer Name" value={trainerName || ''} readOnly />
                        <Textfield label="Start Date" value={dayjs(startTrainingDate).format("YYYY-MM-DD") || ''} readOnly />
                        <Textfield label="End Date" value={dayjs(endTrainingDate).format("YYYY-MM-DD") || ''} readOnly />
                    </div>
                </section>

                <section className="training-details-session-details-section">
                    <h3>Session details</h3>
                    <TableComponent
                        rows={sessionData}
                        columns={columns}
                    />
                </section>
            </div>
        </div>
    );
};

export default TrainingDetails;