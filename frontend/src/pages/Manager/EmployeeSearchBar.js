import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Autocomplete, TextField } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import './EmployeeSearchBar.css';

function EmployeeSearchBar({ employeeOptions = [], selectedEmployee, handleSelectEmployee, handleClearEmployee }) {
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    if (selectedEmployee) {
      const selectedOption = employeeOptions.find(option => option.id === selectedEmployee);
      setInputValue(selectedOption.label); 
    } else {
      setInputValue('');
    }
  }, [selectedEmployee, employeeOptions]);

  return (
    <Autocomplete
      freeSolo={false}
      disableCloseOnSelect={false}
      options={employeeOptions}
      getOptionLabel={(option) => option.label || ''}
      value={employeeOptions.find(option => option.id === selectedEmployee) || null} 
      
      onChange={(event, newValue) => {
        if (newValue) {
          handleSelectEmployee(newValue.label); 
        } else {
          handleClearEmployee();
        }
      }}
      onInputChange={(event, newInputValue) => setInputValue(newInputValue)}
      blurOnSelect={false}
      renderInput={(params) => (
        <TextField
          {...params}
          variant="outlined"
          placeholder="Select Trainer"
          InputProps={{
            ...params.InputProps,
            startAdornment: (
              <SearchIcon style={{ marginRight: '8px' }} />
            ),
            endAdornment: (
              <div style={{ display: 'flex', alignItems: 'center' }}>
                {selectedEmployee && (
                  <ClearIcon
                    className="clear-icon"
                    onClick={() => {
                      handleClearEmployee();
                      setInputValue(''); 
                    }}
                    style={{ cursor: 'pointer', marginRight: '0px' }}
                  />
                )}
              </div>
            ),
            sx: { borderRadius: 5 },
          }}
          sx={{
            width: "250px",
            '& .MuiOutlinedInput-root': {
              height: '45px',
            },
            '& .MuiFormLabel-root': {
              height: '45px',
              lineHeight: '50px',
              top: '-15px',
            },
          }}
        />
      )}
      sx={{ width: '250px' }}
    />
  );
}

EmployeeSearchBar.propTypes = {
  employeeOptions: PropTypes.array.isRequired,
  selectedEmployee: PropTypes.string.isRequired,
  handleSelectEmployee: PropTypes.func.isRequired,
  handleClearEmployee: PropTypes.func.isRequired,
};

export default EmployeeSearchBar;
