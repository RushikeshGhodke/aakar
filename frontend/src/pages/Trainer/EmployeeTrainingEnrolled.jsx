import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FiArrowLeftCircle } from 'react-icons/fi';
import { fetchEmployeesEnrolled, saveFeedback } from './trainerapi';
import './EmployeeTrainingEnrolled.css';

const EmployeeTrainingEnrolled = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { trainingId, active } = location.state || {};
  const [employeeData, setEmployeeData] = useState([]);
  const [feedbackData, setFeedbackData] = useState({});

  useEffect(() => {
    if (!trainingId) {
      toast.error('Training ID is missing.');
      navigate(-1);
      return;
    }

    const loadEmployees = async () => {
      try {
        const employees = await fetchEmployeesEnrolled(trainingId);
        const data = employees.map((employee) => ({
          ...employee,
          employeeId: employee.employeeId || employee.id,
        }));
        setEmployeeData(data);

        // Initialize feedbackData with trainerFeedback
        const initialFeedback = {};
        data.forEach((employee) => {
          initialFeedback[employee.employeeId] = employee.trainerFeedback;
        });
        setFeedbackData(initialFeedback);
      } catch (error) {
        toast.error('Error fetching employee data. Please try again later.');
      }
    };

    loadEmployees();
  }, [trainingId, navigate]);

  const handleFeedbackChange = (employeeId, feedback) => {
    setFeedbackData((prev) => ({
      ...prev,
      [employeeId]: feedback,
    }));
  };

  const handleSaveFeedback = async () => {
    const feedbackArray = Object.keys(feedbackData).map((employeeId) => ({
      employeeId,
      feedback: feedbackData[employeeId],
    }));

    try {
      await saveFeedback(feedbackArray);
      toast.success('Feedback saved successfully!');
    } catch (error) {
      toast.error('Error saving feedback. Please try again.');
    }
  };

  const handleSelectAllFeedback = (feedback) => {
    const updatedFeedback = {};
    employeeData.forEach((employee) => {
      updatedFeedback[employee.employeeId] = feedback;
    });
    setFeedbackData(updatedFeedback);
  };

  return (
    <div className="employee-training-enrolled-page">
      <div className="employee-training-enrolled-title">
        <h2>Employees Enrolled for Training</h2>
      </div>
      <div className="TableComponent-container">
        <header className="employee-training-enrolled-header">
          <FiArrowLeftCircle
            className="employeeSwitch-back-button"
            onClick={() => navigate(`/TrainerSwitch`)}
            title="Go back"
          />
          <h4 className="employeeSwitch-title">View Training Details</h4>
        </header>

        <div className="employee-training-enrolled-buttons">
          {active && (
            <>
              <button
                className="save-feedback-button"
                onClick={handleSaveFeedback}
                disabled={!active}
              >
                Save
              </button>
              <div className="select-all-buttons">
                <button onClick={() => handleSelectAllFeedback(1)}>Select All Pass</button>
                <button onClick={() => handleSelectAllFeedback(0)}>Select All Fail</button>
              </div>
            </>
          )}
        </div>

        <div className="TableComponent-scrollbar">
          <table className="TrainerEditAttendance-table">
            <thead>
              <tr>
                <th className="TableComponent-headerCell">Sr. No.</th>
                <th className="TableComponent-headerCell">Employee Name</th>
                <th className="TableComponent-headerCell">Department</th>
                <th className="TableComponent-headerCell">Feedback</th>
              </tr>
            </thead>
            <tbody>
              {employeeData.map((employee, index) => (
                <tr key={employee.employeeId} className="TableComponent-row">
                  <td className="TableComponent-cell">{index + 1}</td>
                  <td className="TableComponent-cell">{employee.employeeName}</td>
                  <td className="TableComponent-cell">{employee.departmentName}</td>
                  <td>
                    <div className="feedback-buttons">
                      <button
                        className={`feedback-button ${
                          feedbackData[employee.employeeId] === 1 ? 'pass' : ''
                        }`}
                        onClick={() => handleFeedbackChange(employee.employeeId, 1)}
                        disabled={!active}
                      >
                        Pass
                      </button>
                      <button
                        className={`feedback-button ${
                          feedbackData[employee.employeeId] === 0 ? 'fail' : ''
                        }`}
                        onClick={() => handleFeedbackChange(employee.employeeId, 0)}
                        disabled={!active}
                      >
                        Fail
                      </button>
                    </div>
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

export default EmployeeTrainingEnrolled;
