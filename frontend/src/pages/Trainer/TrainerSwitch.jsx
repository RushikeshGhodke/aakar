import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FiEdit, FiArrowLeftCircle } from 'react-icons/fi';
import TableComponent from '../Components/TableComponent';
import GeneralSearchBar from '../Components/GenralSearchBar';
import './TrainerSwitch.css';
import { fetchTrainings } from './trainerapi';

const TrainerSwitch = () => {
  const [trainings, setTrainings] = useState([]);
  const [filteredTrainings, setFilteredTrainings] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const { employeeId } = location.state || {};

  useEffect(() => {
    if (employeeId) {
      loadTrainings();
    } else {
      console.error('Employee ID is missing!');
      toast.error('Failed to fetch employee data. Employee ID is not available.');
    }
  }, [employeeId]);

  const loadTrainings = async () => {
    try {
      const data = await fetchTrainings(employeeId);
      setTrainings(data);
      setFilteredTrainings(data);
    } catch (error) {
      toast.error('Error fetching trainings');
      if (error.response && error.response.status === 404) {
        toast.error('No trainings found for this trainer.');
      } else {
        toast.error('Failed to fetch trainings. Please try again later.');
      }
    }
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

  const handleViewDetails = (training) => {
    if (!training || !training.trainingId) {
      console.error('Training details are missing!');
      return;
    }
    navigate('/TrainerTrainingDetails', {
      state: {
        employeeId: employeeId,
        trainingId: training.trainingId,
        trainingTitle: training.trainingTitle,
        trainerName: training.trainerName,
        startTrainingDate: training.startTrainingDate,
        endTrainingDate: training.endTrainingDate,
      },
    });
  };

  const columns = [
    { id: 'trainingTitle', label: 'Training Title', align: 'center' },
    { id: 'trainerName', label: 'Trainer Name', align: 'center' },
    { id: 'startTrainingDate', label: 'Start Date', align: 'center', render: (row) => new Date(row.startTrainingDate).toLocaleDateString() },
    { id: 'endTrainingDate', label: 'End Date', align: 'center', render: (row) => new Date(row.endTrainingDate).toLocaleDateString() },
    {
      id: 'actions',
      label: 'View Details',
      align: 'center',
      render: (row) => (
        <FiEdit onClick={() => handleViewDetails(row)} className="action-icon" size={18} style={{ color: '#0061A1', fontWeight: '900' }} />
      ),
    },
  ];

  return (
    <div>
      <div className="trainerSwitch-training-content">
        <header className="trainerSwitch-dash-header">
          <FiArrowLeftCircle className="employeeSwitch-back-button" onClick={() => navigate(-1)} title="Go back" />
          <h4 className="employeeSwitch-title">Back to main page</h4>
        </header>

        <div className="trainerSwitch-search-bar-container">
          <GeneralSearchBar
            options={trainings}
            label="Search Training"
            displayKey="trainingTitle"
            isMultiSelect={false}
            selectedValues={searchTerm}
            setSelectedValues={handleSearch}
            includeSelectAll={false}
          />
        </div>

        <div className="trainerSwitch-table-container">
          <TableComponent rows={filteredTrainings} columns={columns} onRowClick={(trainingId) => handleViewDetails(trainingId)} />
        </div>
      </div>
    </div>
  );
};

export default TrainerSwitch;
