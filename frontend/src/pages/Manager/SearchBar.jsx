// SearchBar.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import DepartmentSearchBar from './DepartmentSearchBar';
import Grade from './Grade';
import CheckBox from './CheckBox';
import './SearchBar.css';
import { useNavigate } from 'react-router-dom';
import { FiAward, FiUser } from 'react-icons/fi';

const SearchBar = () => {
  const [departments, setDepartments] = useState([]);
  const [skills, setSkills] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedEmp, setSelectedEmp] = useState([]);
  const [alreadySelect, setSlreadySelect] = useState([]);
  const [newSelectedEmp, setNewSelectedEmp] = useState([]);
  const [removeEmp, setRemoveEmp] = useState([]);
  const [gradeChanges, setGradeChanges] = useState({});

  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://localhost:8081/get-assign-data')
      .then(response => {
        setSelectedEmp(response.data);
        setSlreadySelect(response.data);
      })
      .catch(error => {
        console.error('There was an error fetching the data!', error);
      });
  }, []);

  useEffect(() => {
    axios.get('http://localhost:8081/departments')
      .then(response => setDepartments(response.data))
      .catch(err => console.error('Error fetching departments:', err));
  }, []);

  useEffect(() => {
    if (selectedDepartment) {
      axios.get(`http://localhost:8081/skills/${selectedDepartment.value}`)
        .then(response => {
          const skillsOptions = response.data.map(skill => ({
            label: skill.skillName,
            value: skill.skillId,
          }));
          setSkills([{ label: 'Select All', value: 'select-all' }, ...skillsOptions]);
        })
        .catch(err => console.error('Error fetching skills:', err));
    } else {
      setSkills([]);
    }
  }, [selectedDepartment]);

  useEffect(() => {
    if (selectedSkills.length > 0) {
      fetchData();
    } else {
      setData([]);
    }
  }, [selectedSkills]);

  useEffect(() => {
    // Dispatch custom event whenever selectedDepartment changes
    const event = new CustomEvent('departmentSelected', { detail: selectedDepartment });
    window.dispatchEvent(event);
  }, [selectedDepartment]);

  const fetchData = () => {
    setLoading(true);
    axios.post('http://localhost:8081/fetch-data', {
      skillIds: selectedSkills.map(skill => skill.value),
    })
    .then(response => {
      console.log(response.data); // Check the data format
      const groupedData = groupDataByEmployee(response.data);
      setData(groupedData);
      setLoading(false);
    })
    .catch(err => {
      setError('Failed to fetch data');
      setLoading(false);
    });
  }; 

  const clearDepartment = () => {
    setSelectedDepartment(null);
    setSelectedSkills([]);
    setData([]);
  };

  const OnGradeChange = (employeeId, skillId, newGrade) => {
    setGradeChanges(prev => ({
      ...prev,
      [`${employeeId}-${skillId}`]: { employeeId, skillId, grade: newGrade },
    }));
  };

  const handleSkillChange = (selectedOptions) => {
    const isSelectAllSelected = selectedOptions.some(option => option.value === 'select-all');
  
    if (isSelectAllSelected) {
      if (selectedOptions.length === 1) {
        const allSkills = skills.filter(skill => skill.value !== 'select-all');
        setSelectedSkills(allSkills);
      } else {
        setSelectedSkills([]);
      }
    } else {
      setSelectedSkills(selectedOptions);
    }
  };

  const removeSkill = (skillToRemove) => {
    setSelectedSkills(prevSkills => {
      const updatedSkills = prevSkills.filter(skill => skill.value !== skillToRemove.value);
      if (updatedSkills.length === 0) {
        setData([]); // Clear the table data when no skills are selected
      } else {
        fetchData(); // Fetch data for the remaining skills
      }
      return updatedSkills;
    });
  };
  

  const customStyles = {
    menu: (provided) => ({
      ...provided,
      zIndex: 9999,
    }),
    option: (provided, state) => ({
      ...provided,
      display: 'flex',
      alignItems: 'center',
    }),
    multiValue: (provided) => ({
      ...provided,
      display: 'none' 
    }),
    multiValueLabel: (provided) => ({
      ...provided,
      display: 'none'
    }),
    multiValueRemove: (provided) => ({
      ...provided,
      display: 'none' 
    }),
  };

  const groupDataByEmployee = (data) => {
    const groupedData = {};
    data.forEach(row => {
      if (!groupedData[row.employeeId]) {
        groupedData[row.employeeId] = {
          employeeId: row.employeeId,
          employeeName: row.employeeName,
          skills: {},
        };
      }
      groupedData[row.employeeId].skills[row.skillId] = row.grade;
    });
    console.log(Object.values(groupedData)); // Check the grouped data format
    return Object.values(groupedData);
  };

  const onSelectionChange = (employeeId, skillId, isChecked) => {
    if (isChecked) {
        setNewSelectedEmp(prevEmp => {
            const exists = prevEmp.some(emp => emp.employeeId === employeeId && emp.skillId === skillId);
            if (!exists) {
                return [...prevEmp, { employeeId: employeeId, skillId: skillId }];
            }
            return prevEmp;
        });

        setSelectedEmp(prevEmp => {
            const exists = prevEmp.some(emp => emp.employeeId === employeeId && emp.skillId === skillId);
            if (!exists) {
                return [...prevEmp, { employeeId: employeeId, skillId: skillId }];
            }
            return prevEmp;
        });
    } else {
        setNewSelectedEmp(prevEmp => prevEmp.filter(emp => !(emp.employeeId === employeeId && emp.skillId === skillId)));

        setSelectedEmp(prevEmp => {
            const exists = prevEmp.some(emp => emp.employeeId === employeeId && emp.skillId === skillId);
            if (exists) {
                setRemoveEmp(prevRemove => {
                    const existsInRemove = prevRemove.some(emp => emp.employeeId === employeeId && emp.skillId === skillId);
                    if (!existsInRemove) {
                        return [...prevRemove, { employeeId: employeeId, skillId: skillId }];
                    }
                    return prevRemove;
                });
                return prevEmp.filter(emp => !(emp.employeeId === employeeId && emp.skillId === skillId));
            }
            return prevEmp;
        });
    }
    console.log('Selected EMP : ', selectedEmp);
    console.log('New Selected emp : ', newSelectedEmp);
    console.log('Remove emp : ', removeEmp);
  };

  const handleSave = () => {
    axios.post('http://localhost:8081/update-bulk', {
        newSelectedEmp,
        removeEmp,
        grades: Object.values(gradeChanges), // Include the grade changes here
    })
    .then(response => {
        toast.success('Data updated successfully!');
        setNewSelectedEmp([]);
        setRemoveEmp([]);
        setGradeChanges({}); // Clear local grade changes
        fetchData(); // Refresh data
    })
    .catch(error => {
        console.error('There was an error saving the data!', error);
    });
  };

  const handelUpdateSkill = () => {
    if (!selectedDepartment) {
      toast.error('Select department first'); // Show toast message if no department is selected
      return;
    }
    // Emit custom event for selected department
    const event = new CustomEvent('departmentSelected', { detail: selectedDepartment });
    window.dispatchEvent(event);

    // Navigate to the UpdateSkill page with the selected department's ID
    navigate('/Update_skills', {
      state: {
        departmentId: selectedDepartment.value,
        departmentName: selectedDepartment.label,
      },
    });
  };  

  return (
    <div className='content'>
      <div className='assign-cls'>
        <button className='assign' onClick={handleSave}>Assign</button>
      </div>

      <div className='button-bar'>
        <DepartmentSearchBar
          departments={departments}
          selectedDepartment={selectedDepartment}
          setSelectedDepartment={setSelectedDepartment}
          skills={skills}
          setSkills={setSkills}
          handleSkillChange={handleSkillChange}
          selectedSkills={selectedSkills}
          clearDepartment={clearDepartment}
        />
      </div>
    
      <div className="selected-skills-container">
        {selectedSkills.map(skill => (
          <div key={skill.value} className="skill-bubble">
            {skill.label}
            <span className="remove-skill" onClick={() => removeSkill(skill)}>x</span>
          </div>
        ))}
      </div>
  
      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}
  
      {data.length > 0 && (
        <div className="table-containerr">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                {selectedSkills.map(skill => (
                  <th key={skill.value}>{skill.label}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((row, index) => (
                <tr key={index}>
                  <td>{row.employeeName}</td>
                  {selectedSkills.map(skill => (
                    <td key={skill.value}>
                      <Grade 
                        pemp_id={row.employeeId}
                        pskill_id={skill.value}
                        pgrade={row.skills[skill.value] || 0}
                        onGradeChange={OnGradeChange} // Pass the function here
                        isChangable ={true}
                      />
                      <CheckBox
                        pemp_id={row.employeeId}
                        pskill_id={skill.value}
                        pselectedEmp={selectedEmp}
                        onSelectionChnge={onSelectionChange}
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <ToastContainer />
    </div>
  );
};

export default SearchBar;
