import React, { useEffect, useState } from "react";
import axios from "axios";
import GeneralSearchBar from "../Components/GenralSearchBar";
import "./SendConformEmpToTraining.css";
import GenralCheckBox from "../Components/GenralCheckBox";

const SendConformEmpToTraining = () => {
    const [department, setDepartment] = useState([]);
    const [selectedDepartment, setSelectedDepartment] = useState("");
    const [filterTrainingData, setFilterTrainingData] = useState([]);
    const [expandedRowId, setExpandedRowId] = useState(null);
    const [selectedTrainingId, setSelectedTrainingId] = useState(null);
    const [eligibleEmployees, setEligibleEmployees] = useState([]);
    const [PreSelectedEmp, setPreSelectedEmp] = useState([]);
    const [selectToSend, setSelectToSend] = useState([]);

    const formatDateToYYYYMMDD = (date) => {
        if (!date) return null;
        const d = new Date(date);
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const renderSkillsBubbles = (skills) => {
        if (!skills || skills.trim() === "") {
            return <span>No Skills</span>;
        }
        const skillList = skills.split(", ");
        return (
            <div className="skills-bubbles-container">
                {skillList.map((skill, index) => (
                    <span key={index} className="skill-bubble">
                        {skill}
                    </span>
                ))}
            </div>
        );
    };

    const handelToSend = (trainingId) => {
        if (selectToSend.length > 0) {
          console.log("Employees to send:", selectToSend); // Debug log to see selected employees
          
          // Send selected employee IDs and training ID to the server
          axios.post('http://localhost:8081/send-multiple-emps-to-trainings', {
            trainingId: trainingId,
            selectedEmployees: selectToSend  // Make sure the name matches the API parameter
          })
          .then((response) => {
            console.log("Employees successfully sent to training:", response.data);
            // Handle success, for example:
            // - Show success message
            // - Reset the selected employees array or UI state
          })
          .catch((error) => {
            console.error("Error sending employees to training:", error);
            // Optionally, show an error message to the user
          });
        } else {
          console.log("No employees selected.");
          // Optionally, show a message indicating no employees were selected
        }
      };
      
    

    useEffect(() => {
        axios.get('http://localhost:8081/GetEmpFormRegister')
            .then((response) => {
                const preSelectedEmpIds = response.data.map(emp => emp.employeeId);  // Extract employee IDs
                setPreSelectedEmp(preSelectedEmpIds);  // Store pre-selected employee IDs
                //setSelectToSend(preSelectedEmpIds);  // Set pre-selected employees to selectToSend state
            })
            .catch((error) => {
                console.error("Error fetching pre-selected employees:", error);
            });
    }, []);
    
    

    useEffect(() => {
        axios
            .get("http://localhost:8081/departments")
            .then((response) => {
                const array = response.data.map((arr) => ({
                    id: arr.departmentId,
                    label: arr.departmentName,
                }));
                setDepartment(array);
            })
            .catch((error) => {
                console.error("Error fetching departments:", error);
            });
    }, []);

    useEffect(() => {
        if (!selectedDepartment.id) return;
        axios
            .get(`http://localhost:8081/department-eligible-for-training/${selectedDepartment.id}`)
            .then((response) => {
                const today = formatDateToYYYYMMDD(new Date());
                const filteredData = response.data.filter((train) => {
                    const startDate = formatDateToYYYYMMDD(new Date(train.startTrainingDate));
                    return startDate > today;
                });
                setFilterTrainingData(filteredData);
            })
            .catch((error) => {
                console.error("Error fetching trainings:", error);
            });
    }, [selectedDepartment]);

    useEffect(() => {
        if (!selectedTrainingId) return;
        axios
            .get(`http://localhost:8081/eligible-employee-to-send-to-training/${selectedTrainingId}`)
            .then((response) => {
                setEligibleEmployees(response.data);
            })
            .catch((error) => {
                console.error("Error fetching eligible employees:", error);
            });
    }, [selectedTrainingId]);

    const handleDeptSelect = (dept) => {
        setSelectedDepartment(dept);
    };

    const toggleRowExpand = (id) => {
        setExpandedRowId((prevId) => (prevId === id ? null : id));
    };

    const onSelectionChange = (emp_id, isChecked) => {
        setSelectToSend((prevSelected) => {
            let updated;
            if (isChecked) {
                // Add to selectToSend only if it's not already in the array
                if (!prevSelected.includes(emp_id)) {
                    updated = [...prevSelected, emp_id];
                    console.log("Updated selectToSend (added):", updated); // Debug log
                } else {
                    updated = [...prevSelected]; // No changes if already present
                }
            } else {
                // Remove from selectToSend if it's checked off
                updated = prevSelected.filter((id) => id !== emp_id);
                console.log("Updated selectToSend (removed):", updated); // Debug log
            }
            return updated;
        });
    
        setPreSelectedEmp((prev) => {
            let updatedPreSelected;
            if (isChecked) {
                // Add to PreSelectedEmp only if it's not already in the array
                if (!prev.includes(emp_id)) {
                    updatedPreSelected = [...prev, emp_id];
                    console.log("Updated PreSelectedEmp (added):", updatedPreSelected); // Debug log
                } else {
                    updatedPreSelected = [...prev]; // No changes if already present
                }
            } else {
                // Remove from PreSelectedEmp if it's checked off
                updatedPreSelected = prev.filter((id) => id !== emp_id);
                console.log("Updated PreSelectedEmp (removed):", updatedPreSelected); // Debug log
            }
            return updatedPreSelected;
        });
    };
    
    
    

    const columns = [
        {
            label: "Training Name",
            id: "trainingTitle",
        },
        {
            label: "Trainer Name",
            id: "trainerName",
        },
        {
            label: "Training Skills",
            id: "skills",
            render: (row) => renderSkillsBubbles(row.skills),
        },
        {
            label: "Start Date",
            id: "startTrainingDate",
            render: (row) => new Date(row.startTrainingDate).toLocaleDateString(),
        },
        {
            label: "End Date",
            id: "endTrainingDate",
            render: (row) => new Date(row.endTrainingDate).toLocaleDateString(),
        },
    ];

    return (
        <div>
            <div className="department-search-bar">
                <GeneralSearchBar
                    options={department}
                    selectedValues={selectedDepartment}
                    setSelectedValues={handleDeptSelect}
                    placeholder="Select a Department"
                />
            </div>

            <div className="all-training-table-container">
                <table>
                    <thead>
                        <tr>
                            {columns.map((col) => (
                                <th key={col.id}>{col.label}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {filterTrainingData.map((row) => (
                            <React.Fragment key={row.trainingId}>
                                <tr
                                    onClick={() => {
                                        toggleRowExpand(row.trainingId);
                                        setSelectedTrainingId(row.trainingId);
                                    }}
                                    style={{ cursor: "pointer" }}
                                >
                                    {columns.map((col) => (
                                        <td key={col.id}>
                                            {col.render ? col.render(row) : row[col.id]}
                                        </td>
                                    ))}
                                </tr>
                                {expandedRowId === row.trainingId && (
                                    <tr>
                                        <td colSpan={columns.length + 1}>
                                            <div className="expanded-row-content">
                                                <strong>Eligible Employees:</strong>
                                                <table className="employee-details-table">
                                                    <thead>
                                                        <tr>
                                                            <th>Employee ID</th>
                                                            <th>Employee Name</th>
                                                            <th>Skills</th>
                                                            <th>Select</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                    {eligibleEmployees.map((emp, index) => (
    <tr key={index}>
        <td>{emp.employeeId}</td>
        <td>{emp.employeeName}</td>
        <td>{renderSkillsBubbles(emp.skillName)}</td>
        <td>
            <GenralCheckBox
                emp_id={emp.employeeId}
                selectToSend={PreSelectedEmp}  // Pass selectToSend to GenralCheckBox
                onSelectionChnge={onSelectionChange}
            />
        </td>
    </tr>
))}

                                                        <button onClick={() => handelToSend(row.trainingId)}>
                                                            Send
                                                        </button>
                                                    </tbody>
                                                </table>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </React.Fragment>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default SendConformEmpToTraining;

