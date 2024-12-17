// src/features/employeeSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Async Thunks for API calls
export const getAllEmployees = createAsyncThunk('employees/getAllEmployees', async () => {
    const response = await axios.get('http://localhost:3000/api/v1/employee/getAllEmployees', {
        withCredentials: true,
    });
    console.log(response.data);
    return response.data;
});

export const addEmployee = createAsyncThunk('employees/addEmployee', async (employeeData) => {
    const response = await axios.post('http://localhost:3000/api/v1/employee/addEmployee', employeeData);
    return response.data; // Assuming the added employee data is returned
});

export const updateEmployee = createAsyncThunk(
    'employees/updateEmployee',
    async ({ employeeId, updates, jobProfiles }) => {
        // Prepare the data structure as per your requirement
        const data = {
            employeeId,
            updates,
            jobProfiles
        };

        const response = await axios.put(
            `http://localhost:3000/api/v1/employee/updateEmployee/${employeeId}`,
            data
        );
        return response.data; // Assuming the updated employee data is returned
    }
);


export const deleteEmployee = createAsyncThunk('employees/deleteEmployee', async (employeeId) => {
    try {
        const response = await axios.post('http://localhost:3000/api/v1/employee/deleteEmployee', { employeeId });

        // Log the response from the server (optional)
        // console.log(response);

        // Return employeeId for removing it from the state
        return employeeId;
    } catch (error) {
        console.error("Error deleting employee:", error);
        throw new Error(error.response?.data?.message || "An error occurred while deleting the employee.");
    }
});


// Initial State
const initialState = {
    employees: [],
    loading: false,
    error: null,
};

// Employee Slice
const employeeSlice = createSlice({
    name: 'employees',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Get All Employees
            .addCase(getAllEmployees.pending, (state) => {
                state.loading = true;
            })
            .addCase(getAllEmployees.fulfilled, (state, action) => {
                state.loading = false;
                state.employees = action.payload; // Set the fetched employees
            })
            .addCase(getAllEmployees.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            // Add Employee
            .addCase(addEmployee.pending, (state) => {
                state.loading = true;
            })
            .addCase(addEmployee.fulfilled, (state, action) => {
                state.loading = false;
                state.employees.push(action.payload); // Add the new employee to the state
            })
            .addCase(addEmployee.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            // Update Employee
            .addCase(updateEmployee.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(updateEmployee.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.employeeDetails = action.payload; // Updated employee data
            })
            .addCase(updateEmployee.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            // Delete Employee
            .addCase(deleteEmployee.pending, (state) => {
                state.loading = true;
            })
            .addCase(deleteEmployee.fulfilled, (state, action) => {
                state.loading = false;
                state.employees = state.employees.filter(employee => employee.employeeId !== action.payload); // Remove employee by ID
            })
            .addCase(deleteEmployee.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    },
});

export default employeeSlice.reducer;
