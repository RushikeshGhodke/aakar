import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import TableComponent from '../Components/TableComponent'; 
import './UpdateSkill.css';
import { toast } from 'react-toastify'; 
import { FiPlusCircle, FiXCircle, FiEdit, FiTrash2 } from 'react-icons/fi'; 
import Textfield from '../Components/Textfield'; 
import DSearchbar from './DSearchBar';

const UpdateSkill = () => {
  const location = useLocation();
  const [allDept,setAllDept] = useState([]);
  const { departmentId, departmentName } = location.state || {}; // Extract departmentId from location state
  const [skills, setSkills] = useState([]);
  const [error, setError] = useState(null); // For error handling
  const [loading, setLoading] = useState(true); // Added for loading state
  const [isBoxOpen, setIsBoxOpen] = useState(false);
  const [currentSkill, setCurrentSkill] = useState(null); // For updating a skill
  const [skillName, setSkillName] = useState('');
  const [skillDescription, setSkillDescription] = useState('');
  const [departmentIdGivingTraining , setDepartmentIdGivingTraining] = useState(0);

  useEffect(() => {
    if (departmentId) {
      setLoading(true);
      axios.get(`http://localhost:8081/skills/${departmentId}`)
        .then(response => {
          console.log("Skills ",response.data)
          setSkills(response.data);
          setLoading(false);
        })
        .catch(err => {
          console.error('Error fetching skills:', err);
          setError('Failed to fetch skills.');
          setLoading(false);
        });
    } else {
      setSkills([]);
      setLoading(false);
      setError('No department selected. Please go back and select a department.');
    }
    axios.get(`http://localhost:8081/departments`)
      .then(response =>{
        
        const depts = response.data
        setAllDept(depts)
        console.log(depts)
      })
      .catch(error =>{
        console.error("There Is Error In fetching departments in update skill",error);
      })
  }, [departmentId]);

  const handleAddSkill = () => {
    if (isBoxOpen) {
      setSkillName('');
      setSkillDescription('');
      setCurrentSkill(null);
      setIsBoxOpen(false);
    } else {
      setIsBoxOpen(true);
    }
  };

  const handleUpdateSkill = (skill) => {
    setSkillName(skill.skillName);
    setSkillDescription(skill.skillDescription);
    setCurrentSkill(skill.skillId);
    setIsBoxOpen(true);
  };

  const handleDeptSelect = (departmentId)=>{
      setDepartmentIdGivingTraining(departmentId);
      console.log('T_dept_id', departmentId);
      }

      const handleDelete = (skillId) => {
        // Confirm before deactivating
        if (window.confirm('Are you sure you want to delete this skill?')) {
          axios.put(`http://localhost:8081/skills/${skillId}/deactivate`)
            .then(() => {
              // Remove the deactivated skill from the state
              setSkills(skills.filter(skill => skill.skillId !== skillId));
              toast.success('Skill deleted successfully'); // Toast success notification
            })
            .catch(err => {
              console.error('Error deleting skill:', err);
              setError('Failed to delete skill.');
              toast.error('Failed to delete skill.'); // Toast error notification
            });
        }
      };

  const handleSave = () => {
    const skillData = { skillName: skillName, skillDescription , departmentIdGivingTraining};
    if (currentSkill) {
      axios.put(`http://localhost:8081/skills/${currentSkill}`, skillData)
        .then(() => {
          // Update the skill in the state
          setSkills(skills.map(skill => skill.skillId === currentSkill ? { ...skill, ...skillData } : skill));
          setIsBoxOpen(false);
          toast.success('Skill updated successfully'); 
        })
        .catch(err => {
          console.error('Error updating skill:', err);
          setError('Failed to update skill.');
          toast.error('Failed to update skill.'); 
        });
    } else {
      axios.post(`http://localhost:8081/skills/${departmentId}`, skillData)
        .then(response => {
          // Add the new skill to the state
          setSkills([...skills, response.data]);
          setIsBoxOpen(false);
          toast.success('Skill added successfully'); 
        })
        .catch(err => {
          console.error('Error adding skill:', err);
          setError('Failed to add skill.');
          toast.error('Failed to add skill.'); 
        });
    }
    setSkillName('');
    setSkillDescription("");
  };

  const columns = [
    { id: 'skillName', label: 'Skill Name', align: 'center' },
    { id: 'departmentIdGivingTraining' , label : 'Deartment G Training',align: 'center' },
    { id: 'skillDescription',label:'Description' , align: 'center'}, 
    {
      id: 'actions',
      label: 'Actions',
      align: 'center',
      render: (row) => (
        <div className='skill-action-buttons'>
          <button type='button' onClick={(e) => { e.stopPropagation(); handleUpdateSkill(row); }}>
            <FiEdit size={20} className="update-skill-icon" />
          </button>
          <button type='button' onClick={(e) => { e.stopPropagation(); handleDelete(row.skillId); }}>
            <FiTrash2 size={20} className="update-skill-icon" />
          </button>
        </div>
      )
    },
  ];

  return (
    
    <div className='update-container'>
      <h2 className='update-head'>Update Skills for Department: {departmentName || 'Unknown'}</h2>
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <button className='Add-skill' onClick={handleAddSkill}>
        {isBoxOpen ? <FiXCircle style={{ marginRight: '8px' }} size={20} /> : <FiPlusCircle style={{ marginRight: '8px' }} size={20} />}
        {isBoxOpen ? 'Cancel' : 'Add Skill'}
      </button>
      {isBoxOpen && (
        <div className='input-box'>
          <Textfield
            label='Skill Name'
            value={skillName}
            onChange={(e) => setSkillName(e.target.value)}
            name='skillName'
          />
          <DSearchbar lst = {allDept} onDeptSelect={handleDeptSelect}/>
          <Textfield
            label='Description'
            value={skillDescription}
            onChange={(e) => setSkillDescription(e.target.value)}
            name='skillDescription'
          />
          
          <button className='skill-save'
            onClick={handleSave} style={{ backgroundColor: '#0061A1', color: 'white', border: 'none', padding: '10px 20px', cursor: 'pointer', borderRadius: '25px', alignItems: 'center' }}>
            {currentSkill ? 'Update' : 'Add'}
          </button>
        </div>
      )}
      <TableComponent
        rows={skills}
        columns={columns}
        rowClassName="table-row"
      />
    </div>
  );
};

export default UpdateSkill;
