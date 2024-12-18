import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';

import { FiEdit, FiArrowLeftCircle } from 'react-icons/fi';
import TableComponent from '../Components/TableComponent'; 
import './EmployeeSwitch.css';
import GeneralSearchBar from '../Components/GenralSearchBar';
import { toast } from 'react-toastify';

const EmployeeSwitch = () => {
  const [trainings, setTrainings] = useState([]);
  const [filteredTrainings, setFilteredTrainings] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const { employeeId } = location.state || {};

  useEffect(() => {
    if (employeeId) {
      fetchTrainings();
    } else {
      console.error("Employee ID is missing!");
      toast.error("Failed to fetch employee data. Employee ID is not available.");
    }
  }, [employeeId]);

  const fetchTrainings = async () => {
    try {
      const response = await axios.get(`http://localhost:8081/employee/${employeeId}`);
      const formattedData = response.data.map((training) => ({
        ...training,
        id: training.trainingId, 
      }));
      setTrainings(formattedData);
      setFilteredTrainings(formattedData);
    } catch (error) {
      toast.error('Error fetching trainings');
      if (error.response && error.response.status === 404) {
        toast.error('No trainings found for this employee.');
      } else {
        toast.error('Failed to fetch trainings. Please try again later.');
      }
    }
  };

  const handleViewDetails = (training) => {
    if (!training || !training.trainingId) {
      console.error('Training details are missing!');
      return;
    }
    navigate('/EmployeeTrainingDetails', { 
      state: { 
        
        trainingId: training.trainingId,
        trainingTitle: training.trainingTitle,
        trainerName: training.trainerName,
        startTrainingDate: training.startTrainingDate,
        endTrainingDate: training.endTrainingDate,
      } 
    });
  };

  const handleSearch = (selectedValue) => {
    setSearchTerm(selectedValue);
    if (!selectedValue) {
      setFilteredTrainings(trainings);
    } else {
      setFilteredTrainings(
        trainings.filter((training) => training.id === selectedValue.id)
      );
    }
  };

  const getTrainingStatus = (startDate, endDate) => {
    const today = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);
  
    if (today >= start && today <= end) {
      return <span className="status-bubble ongoing">Ongoing</span>;
    } else if (today > end) {
      return <span className="status-bubble completed">Completed</span>;
    } else {
      return <span className="status-bubble upcoming">Upcoming</span>;
    }
  };
  
  const columns = [
    { id: 'trainingTitle', label: 'Training Title', align: 'center' },
    { id: 'trainerName', label: 'Trainer Name', align: 'center' },
    { id: 'startTrainingDate', label: 'Start Date', align: 'center', render: (row) => new Date(row.startTrainingDate).toLocaleDateString() },
    { id: 'endTrainingDate', label: 'End Date', align: 'center', render: (row) => new Date(row.endTrainingDate).toLocaleDateString() },
    { id: 'trainingStatus', label: 'Training Status', align: 'center', render: (row) => getTrainingStatus(row.startTrainingDate, row.endTrainingDate) },
    {
      id: 'actions',
      label: 'View Details',
      align: 'center',
      render: (row) => (
        <FiEdit onClick={() => handleViewDetails(row)} className="action-icon" size={18} style={{color: '#0061A1', fontWeight: '900'}}/>
      ),
    },
  ];

  return (
    <div>
      <div className="employeeSwitch-training-content">
        <header className="employeeSwitch-dash-header">
          <FiArrowLeftCircle className="employeeSwitch-back-button" onClick={() => navigate(-1)} title="Go back"/>
          <h4 className='employeeSwitch-title'>Back to main page</h4>
        </header>

        <div className="employeeSwitch-search-bar-container">
          <GeneralSearchBar
            options={trainings}
            label='Search Training'
            displayKey='trainingTitle'
            includeSelectAll={false}
            selectedValues={searchTerm}
            setSelectedValues={handleSearch}
            isMultiSelect={false}
          />
        </div>
        
        <div className="employeeSwitch-table-container">
          <TableComponent
            rows={filteredTrainings}
            columns={columns}
            onRowClick={(trainingId) => handleViewDetails(trainingId)} // Optional row click handling
          />
        </div>
      </div>
    </div>
  );
};

export default EmployeeSwitch;
