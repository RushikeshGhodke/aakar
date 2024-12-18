import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { fetchAllSessions, saveSession, deleteSession } from './trainerapi'; // Centralized API functions
import Textfield from '../Components/Textfield';
import TableComponent from '../Components/TableComponent';
import { FiArrowLeftCircle, FiEdit2, FiTrash } from 'react-icons/fi';
import { toast } from 'react-toastify';
import CustomDatePicker from '../Components/CustomDatePicker';
import CustomTimePicker from '../Components/CustomTimePicker';
import '../Overall/TrainingDetails.css';
import dayjs from 'dayjs';

const TrainerTrainingDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [sessionData, setSessionData] = useState([]);
  const {
    trainingId,
    trainingTitle,
    trainerName,
    startTrainingDate,
    endTrainingDate,
  } = location.state || {};

  const [newSession, setNewSession] = useState({
    sessionName: '',
    date: '',
    startTime: null,
    endTime: null,
    trainingId: trainingId,
  });

  const [refreshTrigger, setRefreshTrigger] = useState(false);

  // Fetch session data on component mount or refresh
  useEffect(() => {
    if (!trainingId) {
      console.error('No trainingId found in location.state.');
      navigate(-1); // Navigate back if trainingId is missing
      return;
    }

    const loadSessions = async () => {
      try {
        const data = await fetchAllSessions(trainingId);
        setSessionData(data);
      } catch (error) {
        console.error('Error fetching session data:', error);
        toast.error('Failed to fetch session data. Please try again.');
      }
    };

    loadSessions();
  }, [trainingId, refreshTrigger, navigate]);

  const handleAttendanceClick = (session) => {
    navigate('/TrainerViewAttendance', {
      state: { trainingId, sessionId: session.sessionId, session },
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewSession((prevSession) => ({ ...prevSession, [name]: value }));
  };

  const handleDateChange = (name, date) => {
    const startDate = dayjs(startTrainingDate).format('YYYY-MM-DD');
    const endDate = dayjs(endTrainingDate).format('YYYY-MM-DD');
    const selectedDate = dayjs(date).format('YYYY-MM-DD');
    const today = dayjs().format('YYYY-MM-DD');

    if (selectedDate >= startDate && selectedDate <= endDate && selectedDate >= today) {
      setNewSession((prevState) => ({
        ...prevState,
        [name]: dayjs(date),
      }));
    } else {
      toast.error('Select a date within the valid range.');
      setNewSession((prevSession) => ({ ...prevSession, [name]: null }));
    }
  };

  const handleTimeChange = (name, time) => {
    setNewSession((prevSession) => ({ ...prevSession, [name]: time }));
  };

  const handleEmployees = () => {
    const today = new Date();
    const trainingEndDate = new Date(endTrainingDate);
    const isActive = today > trainingEndDate ? 1 : 0;

    navigate('/EmployeeTrainingEnrolled', {
      state: { trainingId, active: isActive },
    });
  };

  const handleSave = async () => {
    try {
      const formattedSession = {
        ...newSession,
        sessionStartTime: dayjs(newSession.startTime).format('HH:mm:ss'),
        sessionEndTime: dayjs(newSession.endTime).format('HH:mm:ss'),
        sessionDate: dayjs(newSession.date).format('YYYY-MM-DD'),
      };

      await saveSession(formattedSession);
      setRefreshTrigger((prev) => !prev);
      toast.success('Session added successfully!');
      setNewSession({
        sessionName: '',
        date: '',
        startTime: null,
        endTime: null,
        trainingId: trainingId,
      });
    } catch (error) {
      console.error('Error adding session:', error);
      toast.error('Failed to add the session. Please try again.');
    }
  };

  const handleDeleteSession = async (sessionId) => {
    const confirmed = window.confirm('Are you sure you want to delete this session?');
    if (confirmed) {
      try {
        await deleteSession(sessionId);
        setRefreshTrigger((prev) => !prev);
        toast.success('Session deleted successfully!');
      } catch (error) {
        console.error('Error deleting session:', error);
        toast.error('Failed to delete the session. Please try again.');
      }
    }
  };

  const sessionColumns = [
    { id: 'sessionName', label: 'Session Name' },
    {
      id: 'sessionDate',
      label: 'Date',
      render: (row) => dayjs(row.sessionDate).format('YYYY-MM-DD'),
    },
    { id: 'sessionStartTime', label: 'Start Time' },
    { id: 'sessionEndTime', label: 'End Time' },
    {
      id: 'attendance',
      label: 'Actions',
      render: (row) => {
        const today = dayjs().format('YYYY-MM-DD');
        const sessionDate = dayjs(row.sessionDate).format('YYYY-MM-DD');
        const isTrainingEditable =
          dayjs().isBefore(dayjs(endTrainingDate), 'day') || dayjs().isSame(dayjs(endTrainingDate), 'day');
        const isSessionFutureOrToday = sessionDate >= today;

        return (
          <>
            <FiEdit2
              onClick={() => handleAttendanceClick(row)}
              className="action-icon"
              size={18}
              style={{ color: '#0061A1', fontWeight: '900' }}
            />
            {isTrainingEditable && isSessionFutureOrToday && (
              <FiTrash
                onClick={() => handleDeleteSession(row.sessionId)}
                className="action-icon"
                size={18}
                style={{ color: '#0061A1', fontWeight: '900' }}
              />
            )}
          </>
        );
      },
    },
  ];

  return (
    <div className="training-details-page">
      <div className="training-details-main-content">
        <header className="training-details-dash-header">
          <FiArrowLeftCircle
            className="employeeSwitch-back-button"
            onClick={() => navigate('/TrainerSwitch')}
            title="Go back"
          />
          <h4 className="employeeSwitch-title">Training Details</h4>
        </header>

        <section className="training-details-section">
          <h3>
            Training Details
            <button className="training-details-employee-button" onClick={handleEmployees}>
              Employees
            </button>
          </h3>
          <div className="training-details-form">
            <Textfield label="Training Name" value={trainingTitle || ''} readOnly />
            <Textfield label="Trainer Name" value={trainerName || ''} readOnly />
            <Textfield
              label="Start Date"
              value={dayjs(startTrainingDate).format('YYYY-MM-DD') || ''}
              readOnly
            />
            <Textfield
              label="End Date"
              value={dayjs(endTrainingDate).format('YYYY-MM-DD') || ''}
              readOnly
            />
          </div>
        </section>

        <section className="training-details-add-session-details-section">
          <div className="training-details-add-session-header">
            <h3>Add session details</h3>
            <button className="training-details-save-button" onClick={handleSave}>
              Save
            </button>
          </div>
          <div className="training-details-session-form">
            <Textfield
              label="Session Name"
              value={newSession.sessionName}
              onChange={handleInputChange}
              name="sessionName"
              isRequired={true}
            />
            <CustomDatePicker
              label="Date"
              value={newSession.date || null}
              onChange={(date) => handleDateChange('date', date)}
            />
            <CustomTimePicker
              label="Start Time"
              value={newSession.startTime}
              onChange={(time) => handleTimeChange('startTime', time)}
            />
            <CustomTimePicker
              label="End Time"
              value={newSession.endTime}
              onChange={(time) => handleTimeChange('endTime', time)}
            />
          </div>
        </section>

        <section className="training-details-session-details-section">
          <h3>Session Details</h3>
          <TableComponent rows={sessionData} columns={sessionColumns} linkBasePath={null} />
        </section>
      </div>
    </div>
  );
};

export default TrainerTrainingDetails;
