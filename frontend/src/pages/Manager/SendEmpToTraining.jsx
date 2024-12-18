import React, { useEffect, useState } from "react";
import AddTraining from "./AddTraining";
import { useLocation } from 'react-router-dom';
import axios from "axios";
import TableComponent from "../Components/TableComponent";
import './SendEmpToTraining.css';

const SendEmpToTraining = () => {
  const location = useLocation();
  const { departmentId, selectedEmployees } = location.state || {}; // Extract selectedEmployees along with departmentId
  const [trainingData, setTrainingData] = useState([]);

  useEffect(() => {
    console.log("Department ID:", departmentId);
    console.log("Selected Employees:", selectedEmployees); // Log selected employees
  }, [departmentId, selectedEmployees]);
  const skillId = location.state || null
  useEffect(() => {
    const fetchTrainingData = async () => {
      try {
        const response = await axios.get('http://localhost:8081/all-training');
        setTrainingData(response.data);
        console.log("All training names", response.data);
      } catch (error) {
        console.error('Error fetching training data:', error);
      }
    };

    fetchTrainingData();
  }, []);

  const sentEmpToTraining = (trainingId) => {
    console.log("Sending employees to training with ID:", trainingId);

    // Send selected employees to the training along with trainingId and departmentId
    axios.post('http://localhost:8081/send-multiple-emps-to-trainings', { trainingId, selectedEmployees })
      .then((response) => {
        console.log('Successfully sent employees to training:', response.data);
      })
      .catch((error) => {
        console.log("fhaoufha", selectedEmployees);
        console.log("trainsd", trainingId);
        console.error('Error sending employees to training:', error);
      });
  };

  const columns = [
    { id: 'trainingId', label: "Training ID", align: 'center' },
    { id: 'trainingTitle', label: "Training Name", align: "center" },
    {
      id: "skills",
      label: "Skills",
      align: "center",
      render: (row) => (
        <div className="SendEmp-skill-bubble-container">
          {row.skills ? (
          row.skills.split(',').map((skill, index) => (
            <span key={index} className="SendEmp-skill-bubble">
              {skill.trim()}
            </span>
          ))
        ) : (
          <span className="no-skills">No skills</span>
        )}
        </div>
      )
    },
    {
      id: "sendToTraining",
      label: "Send Emp",
      align: "center",
      render: (row) => (
        <div>
          <button onClick={() => sentEmpToTraining(row.trainingId)}>Send</button>
        </div>
      )
    }
  ];  

  return (
    <div className="SendEmpToTrain">
      <div className="SendEmpToTrain-addTraining">
        <AddTraining
          onTrainingAdded={undefined}
          editTrainingData={undefined}
          isEditing={undefined}
          setIsEditing={undefined}
          departmentId={departmentId}
        />
      </div>
      {/* <div className="SendEmpToTrain-table">
        <TableComponent rows={trainingData} columns={columns}/>
      </div> */}

      <button > Send</button>
    </div>
  );
}

export default SendEmpToTraining;
