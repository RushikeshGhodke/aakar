import React, { useEffect, useState } from 'react';
import axios from 'axios';
import TableComponent from './TableComponent';


const AssignTraining = () => {
    const [assignTraining, setAssignTraining] = useState([]);

    useEffect(() => {
        axios.get(`http://localhost:8081/alreadyAssignedEmp`)
            .then((response) => {
                const data = response.data;
                const transformedData = transformData(data);
                setAssignTraining(transformedData);
            })
            .catch((error) => {
                console.error('Error fetching data:', error);
            });
    }, []);

    const transformData = (data) => {
        const groupedData = data.reduce((acc, item) => {
            const existingEmployee = acc.find(emp => emp.employeeId === item.employeeId);
            if (existingEmployee) {
                existingEmployee.skills.push({
                    skillName: item.skillName,
                    grade: item.grade
                });
            } else {
                acc.push({
                    employeeId: item.employeeId,
                    employeeName: item.employeeName,
                    skills: [{
                        skillName: item.skillName,
                        grade: item.grade
                    }]
                });
            }
            return acc;
        }, []);

        return groupedData;
    };

    const columns = [
        { id: 'employeeId', label: 'Employee ID', align: 'left' },
        { id: 'employeeName', label: 'Employee Name', align: 'left' },
        { id: 'skills', label: 'Skills', align: 'left', render: (row) => (
            <ul>
                {row.skills.map((skill, index) => (
                    <li key={index}>{skill.skillName} - Grade: {skill.grade}</li>
                ))}
            </ul>
        )},
        { id: 'actions', label: 'Actions', align: 'center' }
    ];

    return (
        <div className='assign-training-content'>
            <TableComponent rows={assignTraining} columns={columns} />
        </div>
    );
};

export default AssignTraining;
