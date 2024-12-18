import React, { useEffect, useState } from 'react';
import axios from 'axios';
import GeneralSearchBar from '../Components/GenralSearchBar';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import './ShowTrainingDept.css';

const ShowTrainingDept = () => {
  const [empData, setEmpData] = useState({});
  const [departmentTId, setDepartmentTId] = useState({});
  const [depts, setDepts] = useState([]);
  const [skillOptions, setSkillOptions] = useState([]);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get('http://localhost:8081/departments')
      .then((response) => {
        const deptList = response.data.map((dept) => ({
          id: dept.departmentId,
          label: dept.departmentName,
        }));
        setDepts(deptList);
      })
      .catch((error) => {
        console.error('Error fetching departments:', error);
        toast.error('Failed to fetch departments.');
      });
  }, []);

  useEffect(() => {
    if (departmentTId.id) {
      setLoading(true);
      axios
        .get(`http://localhost:8081/DepartmentGiveTskills/${departmentTId.id}`)
        .then((response) => {
          const skills = response.data.map((skill) => ({
            id: skill.skillId,
            label: skill.skillName,
          }));
          setSkillOptions(skills);
        })
        .catch((error) => {
          console.error('Error fetching skills:', error);
          toast.error('Failed to fetch skills.');
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setSkillOptions([]);
    }
  }, [departmentTId.id]);

  useEffect(() => {
    if (departmentTId.id) {
      setLoading(true);
      axios
        .get(
          `http://localhost:8081/get-distinct-department-employess-skill-to-train/${departmentTId.id}`
        )
        .then((response) => {
          const deptData = response.data || {};
          setEmpData(deptData);
        })
        .catch((error) => {
          console.error('Error fetching employee data:', error);
          toast.error('Failed to fetch employee data.');
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setEmpData({});
    }
  }, [departmentTId]);

  const transformDataForTable = () => {
    const departmentRows = Object.keys(empData).map((departmentName) => {
      const employeeSkills = empData[departmentName];

      const skillCounts = skillOptions.reduce((acc, skill) => {
        const count = employeeSkills.filter(
          (emp) => emp.skillName === skill.label
        ).length;
        acc[skill.label] = count;
        return acc;
      }, {});

      return {
        departmentName,
        ...skillCounts,
      };
    });

    return departmentRows;
  };


  const tableData = transformDataForTable();

  const handleHeaderClick = (skillId) => {
    navigate(`/SendEmpToTraining`,{
      state:{skillId}
    });
  };

  return (
    <div>
      <div className="show-training-content">
        <div className="show-training-searchbar">
          <GeneralSearchBar
            label="Select Department"
            options={depts}
            selectedValues={departmentTId}
            setSelectedValues={setDepartmentTId}
            placeholder="Select..."
          />
        </div>
        {/* <div>
          <button style={{ textAlign: 'center', marginTop: '2rem', color: '#F43596' }} onClick={handelSeeEmployeeToTrain()}>Send</button>
        </div> */}
        {loading ? (
          <p className="loading-message">Loading data...</p>
        ) : (
          <div className="employee-table">
            <table>
              <thead>
                <tr>
                  <th>Department</th>
                  {skillOptions.map((skill) => (
                    <th
                      key={skill.id}
                      className="clickable-header"
                      onClick={() => handleHeaderClick(skill.id)}
                    >
                      {skill.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {tableData.map((row, index) => (
                  <tr key={index}>
                    <td>{row.departmentName}</td>
                    {skillOptions.map((skill) => (
                      <td key={skill.id}>
                        {row[skill.label] || 0}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShowTrainingDept;
