  import React, { useEffect, useState } from 'react';
  import axios from 'axios';
  import { FiEdit, FiTrash, FiEye, FiPlusCircle, FiXCircle, FiArrowLeftCircle } from 'react-icons/fi'; 
  import { useNavigate } from 'react-router-dom'; 
  import AddTraining from './AddTraining';
  import {toast } from 'react-toastify';
  import 'react-toastify/dist/ReactToastify.css';
  import './AllTraining.css';
  import TableComponent from '../Components/TableComponent';
  import GeneralSearchBar from '../Components/GenralSearchBar';

  const AllTraining = () => {
    const [trainingData, setTrainingData] = useState([]);
    const [filteredData, setFilteredData] = useState(trainingData);
    const [isAdding, setIsAdding] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editTrainingData, setEditTrainingData] = useState(null);
    const [departmentId, setDepartmentId] = useState(1); 
    const navigate = useNavigate(); 
    const [trainingList, setTrainingList] = useState([]);
    const [search, setSearch] = useState("");
    const [trainingId, setTrainingId] = useState([]);


    const fetchTrainingData = async () => {
      try {
        const response = await axios.get(`http://localhost:8081/all-training`);
        setTrainingData(response.data);
        setFilteredData(response.data);
        const traingId_Nmae = response.data.map((train) =>({
          id : train.trainingId,
          label : train.trainingTitle
        }))
        
        const uniqueArray = traingId_Nmae.reduce((accumulator, currentValue) => {
          if (!accumulator.some(item => item.label === currentValue.label)) {
            console.log("currentvalue L :", currentValue.label);
            accumulator.push(currentValue);
          }
          return accumulator;
        }, []);
        
        console.log("Unique titles: ",uniqueArray);
        setTrainingList(uniqueArray)
      } catch (error) {
        console.error('Error fetching training data:', error);
        toast.error('Failed to fetch training data!');
      }
    };
    
    useEffect(() => {
      fetchTrainingData();
    }, []);
    
    const handleSearch = async (searchTerm) => {
      setSearch(searchTerm);
      try {
        const response = await axios.get(`http://localhost:8081/search-training`, {
          params: { q: searchTerm.label }
        });
        setFilteredData(response.data);
      } catch (error) {
        console.error('Error searching training data:', error);
        toast.error('Failed to search training data!');
      }
    };

    const handleDelete = async (trainingId) => {
      const isConfirmed = window.confirm('Are you sure you want to delete this training?');
      
      if (isConfirmed) {
        try {
          await axios.delete(`http://localhost:8081/delete-training/${trainingId}`);
          setTrainingData(prevData => {
            const updatedData = prevData.filter(item => item.trainingId !== trainingId);
            setFilteredData(updatedData); 
            return updatedData;
          });
          toast.success('Training deleted successfully!'); 
        } catch (error) {
          console.error('Error deleting training:', error);
          toast.error('Failed to delete the training!');
        }
      }
    };  

    const handleViewDetails = (training) => {
      
      if (!training) {
        console.error('Training details are missing!');
        return;
      }

      navigate('/training-details', { 
        state: { 
          trainingId: training.trainingId,
          trainingTitle: training.trainingTitle,
          trainerName: training.trainerName,
          startTrainingDate: training.startTrainingDate,
          endTrainingDate: training.endTrainingDate,
        } 
      });
    };

    const handleAddTrainingToggle = () => {
      setIsAdding(prevState => !prevState);
      setIsEditing(false); 
    };

    const handleEditTraining = (training) => {
      const formattedTraining = {
        ...training,
        skills: training.skills ? training.skills.split(', ').map(skill => skill.trim()) : [],
      };
      setEditTrainingData(formattedTraining);  
      setIsAdding(true);
      setIsEditing(true); 
    };

    const handleTrainingAdded = async () => {
      setIsAdding(false);
      setIsEditing(false);
      try {
        const response = await axios.get('http://localhost:8081/all-training');

        setTrainingData(response.data); 
        setFilteredData(response.data); 
        fetchTrainingData();
        modifyTable(filteredData);
        console.log("Filetered data:", filteredData);
        console.log("Save clicked");
        toast.success("Training added successfully!");
      } catch (error) {
        console.error('Error fetching updated training data:', error);
        toast.error('Failed to refresh training data!');
      }
    };

    const handleTrainingUpdated = () => {
      setIsAdding(false);
      setIsEditing(true);
      axios.get(`http://localhost:8081/all-training`)
        .then(response => {
          setTrainingData(response.data);
          
          setFilteredData(response.data); 
          console.log("Filetered data:", filteredData);
        })
        .catch(error => {
          console.error('Error fetching updated training data:', error);
          toast.error('Failed to fetch the updated training data!');
        });
    };

    const renderSkillsBubbles = (skills) => {
      if (!skills || skills.trim() === '') {
        return <span>No Skills</span>;  
      }
      const skillList = skills.split(', ');
      return (
        <div className="skills-bubbles-container">
          {skillList.map((skill, index) => (
            <span key={index} className="skill-bubble">{skill}</span>
          ))}
        </div>
      );
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
        {
          label: 'Training Name',
          id: 'trainingTitle',
        },
        {
          label: 'Trainer Name',
          id: 'trainerName',
        },
        {
          label: 'Training Skills',
          id: 'skills',
          render: (row) => renderSkillsBubbles(row.skills),
        },
        {
          label: 'Start Date',
          id: 'startTrainingDate',
          render: (row) => new Date(row.startTrainingDate).toLocaleDateString(),
        },
        {
          label: 'End Date',
          id: 'endTrainingDate',
          render: (row) => new Date(row.endTrainingDate).toLocaleDateString(),
        },
        {
          label: 'Training Status',
          render: (row) => getTrainingStatus(row.startTrainingDate, row.endTrainingDate),
        },
        {
          label: 'Actions',
          id: 'actions',
          render: (row) => {
            const status = getTrainingStatus(row.startTrainingDate, row.endTrainingDate);
            const isCompleted = status.props.className.includes('completed');
        
            return (
              <div>
                <FiEye
                  onClick={() => handleViewDetails(row)}
                  className="action-icon"
                  size={18}
                  style={{ color: '#0061A1', fontWeight: '900' }}
                />
                {!isCompleted && (
                  <>
                    <FiEdit
                      onClick={() => handleEditTraining(row)}
                      className="action-icon"
                      size={18}
                      style={{ color: '#0061A1', fontWeight: '900' }}
                    />
                    <FiTrash
                      onClick={() => handleDelete(row.trainingId)}
                      className="action-icon"
                      size={18}
                      style={{ color: '#0061A1', fontWeight: '900' }}
                    />
                  </>
                )}
              </div>
            );
          },
        },
      ];

      const modifyTable = (newData) =>{
        console.log("Modified with new data:", newData);
        setFilteredData((prevData) => [...prevData, ...newData]);
      }

    return (
      <div className="all-training-training-content">
        <header className="all-training-dash-header">
          <FiArrowLeftCircle className="employeeSwitch-back-button" onClick={() => navigate(-1)} title="Go back"/>
          <h4 className='employeeSwitch-title'>Employee Details</h4>
        </header>
        <div className="add-training-container">
          <button onClick={handleAddTrainingToggle} className="add-training-btn">
            {isAdding ? <FiXCircle size={18} style={{ marginRight: '8px', color: '#0061A1'}} /> : <FiPlusCircle size={18} style={{ marginRight: '8px', color: '#0061A1'}} />}
            {isAdding ? '  Cancel' : 'New Training'}
          </button>
        </div>

        {isAdding && (
          <AddTraining 
            onTrainingAdded={isEditing ? handleTrainingUpdated : handleTrainingAdded} 
            editTrainingData={isEditing ? editTrainingData : null} 
            isEditing={isEditing} 
            setIsEditing={setIsEditing} 
            departmentId={departmentId}
            modifyTable={modifyTable}
          />      
        )}

        <div className="all-training-search-bar-container">
          <GeneralSearchBar
            options={trainingList}
            label='Search Training'
            //displayKey='trainingTitle'
            isMultiSelect={false}
            selectedValues={search}
            setSelectedValues={handleSearch}
            includeSelectAll={false}
          />
        </div>

        <div className="all-training-table-container">
          <TableComponent rows={filteredData} columns={columns} />
        </div>
      </div>
    );
  };

  export default AllTraining;
