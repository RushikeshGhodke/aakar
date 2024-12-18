import axios from 'axios';
import { toast } from 'react-toastify';

// Fetch trainings by employee ID
export const fetchTrainings = async (employeeId) => {
  try {
    const response = await axios.get(`http://localhost:8081/TrainerPov/${employeeId}`);
    return response.data.map((training) => ({
      ...training,
      id: training.trainingId,
    }));
  } catch (error) {
    toast.error('Error fetching trainings');
    if (error.response && error.response.status === 404) {
      toast.error('No trainings found for this trainer.');
    } else {
      toast.error('Failed to fetch trainings. Please try again later.');
    }
    throw error;
  }
};

// Fetch all sessions by training ID
export const fetchAllSessions = async (trainingId) => {
  try {
    const response = await axios.get(`http://localhost:8081/training/all_sessions/${trainingId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching session data:', error);
    throw error;
  }
};

// Save new session
export const saveSession = async (sessionData) => {
  try {
    const response = await axios.post('http://localhost:8081/api/sessions', sessionData);
    toast.success("Session added successfully!");
    return response.data;
  } catch (error) {
    console.error('Error adding session:', error);
    toast.error("Failed to add the session. Please try again.");
    throw error;
  }
};

// Delete a session by session ID
export const deleteSession = async (sessionId) => {
  try {
    await axios.delete(`http://localhost:8081/api/sessions/${sessionId}`);
    toast.success("Session deleted successfully!");
  } catch (error) {
    console.error("Error deleting session:", error);
    toast.error("An error occurred while deleting the session.");
    throw error;
  }
};

// Fetch employees enrolled in a training
export const fetchEmployeesEnrolled = async (trainingId) => {
  try {
    const response = await axios.get(`http://localhost:8081/employeesEnrolled/${trainingId}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Error fetching employees');
  }
};

export const saveFeedback = async (feedbackArray) => {
  try {
    const response = await axios.post(`http://localhost:8081/saveFeedback`, feedbackArray);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Error saving feedback');
  }
};
