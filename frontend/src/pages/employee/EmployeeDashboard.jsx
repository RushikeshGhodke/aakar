import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getAllEmployees } from '../../features/employeeSlice.js';
import { FiPlusCircle } from 'react-icons/fi';
import Infocard from "../../components/Infocard/Infocard.jsx";
import GenericTable from "../../components/GenericTable.jsx"

const EmployeeList = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { employees, loading, error } = useSelector((state) => state.employee);

    const access = useSelector((state) => state?.auth?.user?.employeeAccess)?.split(',');
    const HRManagementAccess = access[0];

    const [rows, setRows] = useState([]);
    const columns = [
        { field: 'empId', headerName: 'Employee ID' },
        { field: 'empName', headerName: 'Name' },
        { field: 'empEmail', headerName: 'Email ID' },
        { field: 'empJobTitle', headerName: 'Role' },
        { field: 'empDept', headerName: 'Department' },
    ];

    useEffect(() => {
        dispatch(getAllEmployees());
    }, [dispatch]);

    useEffect(() => {
        if (employees) {
            const processedRows = employees.map((data, index) => {
                const { employee, jobProfiles } = data;

                // Extract and join job profile details
                const roles = jobProfiles.map((profile) => profile.designationName || "N/A").join(", ");
                const departments = jobProfiles.map((profile) => profile.departmentName || "N/A").join(", ");

                return {
                    id: index + 1, // Row ID
                    empId: employee?.customEmployeeId,
                    empName: employee?.employeeName,
                    empEmail: employee?.employeeEmail,
                    empJobTitle: roles || "N/A",
                    empDept: departments || "N/A",
                    createdAt: employee?.createdAt,
                };
            });
            setRows(processedRows);
        }
    }, [employees]);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div className="dashboard">
            <div className="flex justify-between items-end mb-3">
                <div className="infocard-container h-max">
                    <Infocard
                        icon={`<FiUser />`}
                        number={rows.length}
                        text={"All Employees"}
                        className={"selected"}
                    />
                </div>
                {HRManagementAccess[1] === '1' && (
                    <button
                        className="flex border-2 border-[#0061A1] rounded text-[#0061A1] font-semibold p-3 hover:cursor-pointer"
                        onClick={() => navigate('/employee/addEmployee')}
                    >
                        <FiPlusCircle style={{ marginRight: '10px', width: '25px', height: '25px' }} />
                        Add employee
                    </button>
                )}
            </div>

            <div className="employee-list-container">
                <GenericTable
                    columns={columns}
                    data={rows}
                    collapsible={false}
                    selectable={true}
                    actions={true}
                    enableSearch={true}
                    onDelete={(item) => console.log('Delete:', item)}
                    onEdit={(item) => console.log('Edit:', item)}
                    onView={(item) => console.log('View:', item)}
                />
            </div>
        </div>
    );
};

export default EmployeeList;
