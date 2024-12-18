// DepartmentContext.js
import React, { createContext, useState } from 'react';

// Create the context
export const DepartmentContext = createContext();

// Provider component
export const DepartmentProvider = ({ children }) => {
  const [selectedDepartment, setSelectedDepartment] = useState(null);

  return (
    <DepartmentContext.Provider value={{ selectedDepartment, setSelectedDepartment }}>
      {children}
    </DepartmentContext.Provider>
  );
};
