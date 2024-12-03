import React from 'react';
import { useParams } from 'react-router-dom';
import { FiArrowLeftCircle, FiEdit } from "react-icons/fi";
import { useSelector } from "react-redux";
import TableComponent from "../../components/Table/TableComponent.jsx";
import AccessTableOutput from "./AccessTableOutput.jsx";
import './EmployeeDashboard.css';

function EmployeeProfile() {
    const { id } = useParams();
    const allEmployeesData = useSelector((state) => state.employee); // Fetch employees from Redux store
    const employeesData = allEmployeesData.employees;

    // Function to find an employee by customEmployeeId
    const findEmployeeById = (customEmployeeId) => {
        for (let i = 0; i < employeesData.length; i++) {
            if (employeesData[i].employee.customEmployeeId === customEmployeeId) {
                return employeesData[i];
            }
        }
        return null; // Return null if not found
    };


    // Check if employeesData is still loading
    if (!employeesData || employeesData.length === 0) {
        return <div>Loading...</div>;
    }

    console.log('Emp data ala')
    const employee = findEmployeeById(id);
    console.log(employee);
    // Handle case when employee is not found
    if (!employee) {
        return <div>Employee not found.</div>;
    }


    const columns = [
        { id: 'projectName', label: 'Project Name', align: 'center' },
        { id: 'projectNumber', label: 'Project Number', align: 'center' },
        { id: 'startDate', label: 'Start Date', align: 'center' },
        { id: 'endDate', label: 'End Date', align: 'center' },
        { id: 'duration', label: 'Duration', align: 'center' },
    ];

    const designationColumns = [
        { id: 'designation', label: 'Designation', align: 'left' },
        { id: 'department', label: 'Department', align: 'left' },
        { id: 'manager', label: 'Reporting Authority', align: 'left' },
    ];

    const designationRows = employee.jobProfiles.map((jobProfile, index) => ({
        id: index + 1, // Unique identifier for each row
        designation: jobProfile.designationName || 'N/A',
        department: jobProfile.departmentName || 'N/A',
        manager: jobProfile.managerName || 'N/A',
    }));


    const rows = []; // Example: You can populate this dynamically if needed

    return (
        <div>
            <div className="add-employee-dashboard">
                <section className="add-employee-head flex justify-between mb-3">
                    <div className="flex items-center gap-3">
                        <FiArrowLeftCircle size={28} className="text-[#0061A1]" onClick={() => window.history.back()} />
                        <div className="text-[17px]">
                            <span>Dashboard / </span>
                            <span className="font-semibold">Employee Details</span>
                        </div>
                    </div>
                    <button className="flex justify-center items-center gap-3 bg-[#0061A1] text-white py-1.5 px-2 rounded">
                        <FiEdit size={20} className="save-icon" />
                        <span>Edit details</span>
                    </button>
                </section>

                <section className="add-employee-body bg-white px-10 py-7 rounded">
                    <h3 style={{ fontSize: "18px", marginBottom: "10px", color: "#7D7D7D", fontWeight: "bold" }}>
                        Personal details
                    </h3>
                    <div className="border-[#C3C3C3] border-2 flex flex-row items-center justify-between p-6 rounded-xl mb-10">
                        <div className="flex flex-col w-max">
                            <span className="text-[#585858] text-[16px]">Name</span>
                            <span className="text-black text-lg font-semibold">{employee.employee.employeeName}</span>
                        </div>
                        <div className="flex flex-col w-max">
                            <span className="text-[#585858] text-[16px]">ID</span>
                            <span className="text-black text-lg font-semibold">{employee.employee.customEmployeeId}</span>
                        </div>
                        <div className="flex flex-col w-max">
                            <span className="text-[#585858] text-[16px]">Department</span>
                            <span className="text-black text-lg font-semibold">{employee.jobProfiles[0]?.departmentName || 'N/A'}</span>
                        </div>
                        <div className="flex flex-col w-max">
                            <span className="text-[#585858] text-[16px]">Experience</span>
                            <span className="text-black text-lg font-semibold">{employee.employee.experienceInYears} Years</span>
                        </div>
                        <div className="flex flex-col w-max">
                            <span className="text-[#585858] text-[16px]">Role</span>
                            <span className="text-black text-lg font-semibold">{employee.jobProfiles[0]?.designationName || 'N/A'}</span>
                        </div>
                    </div>
                    <AccessTableOutput binaryString={employee.employee.employeeAccess} />
                </section>

                <section className="add-employee-body bg-white px-10 py-1 rounded">
                    <h3 style={{ fontSize: "18px", marginBottom: "10px", color: "#7D7D7D", fontWeight: "bold" }}>
                        Designations
                    </h3>
                    <TableComponent columns={designationColumns} rows={designationRows} />
                </section>

                <section className="add-employee-body bg-white px-10 py-10 rounded">
                    <h3 style={{ fontSize: "18px", marginBottom: "10px", color: "#7D7D7D", fontWeight: "bold" }}>
                        Projects
                    </h3>
                    <TableComponent columns={columns} rows={rows} />
                </section>
            </div>
        </div>
    );
}

export default EmployeeProfile;