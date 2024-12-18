import React from 'react';
import { Box, Autocomplete, Checkbox, ListItemText, ListItem } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import TextField from '@mui/material/TextField';
import './DepartmentSearchBar.css';

const DepartmentSearchBar = ({
  departments = [],
  selectedDepartment,
  setSelectedDepartment,
  skills = [],
  handleSkillChange,
  selectedSkills = [],
  clearDepartment
}) => {

  const departmentOptions = Array.isArray(departments) ? departments.map(dept => dept.departmentName) : [];
  const skillOptions = Array.isArray(skills) ? skills.map(skill => skill.label) : [];

  const handleSelectDepartment = (event, value) => {
    const selectedDept = departments.find(dept => dept.departmentName === value);
    setSelectedDepartment(selectedDept ? { label: value, value: selectedDept.departmentId } : null);
  };

  const handleSelectSkill = (event, value) => {
    const selectedSkills = skills.filter(skill => value.includes(skill.label));
    handleSkillChange(selectedSkills.map(skill => ({ label: skill.label, value: skill.value })));
  };

  const handleClearDepartment = () => {
    setSelectedDepartment(null);
    handleSkillChange([]); 
  };

  const handleClearSkills = () => {
    handleSkillChange([]);
  };

  return (
    <div className="search-bar-containerr">
      <Box className="searchbar-container">
        <Autocomplete
          freeSolo
          options={departmentOptions}
          value={selectedDepartment ? selectedDepartment.label : ''}
          onInputChange={(event, newInputValue) => {
            const matchingDepartment = departments.find(dept =>
              dept.departmentName.toLowerCase() === newInputValue.toLowerCase()
            );
            setSelectedDepartment(matchingDepartment ? { label: newInputValue, value: matchingDepartment.departmentId } : null);
          }}
          onChange={handleSelectDepartment}
          renderInput={(params) => (
            <TextField
              {...params}
              variant="outlined"
              placeholder="Select Department"
              InputProps={{
                ...params.InputProps,
                startAdornment: (
                  <SearchIcon style={{ marginRight: '8px' }} />
                ),
                endAdornment: (
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    {selectedDepartment ? (
                      <ClearIcon
                        className="clear-icon"
                        onClick={handleClearDepartment}
                        style={{ cursor: 'pointer', marginRight: '0px', marginLeft: '0px'}}
                      />
                    ) : null}
                  </div>
                ),
                sx: { borderRadius: 5 },
              }}
              sx={{
                width: "250px",
                '& .MuiOutlinedInput-root': {
                  height: '50px',
                },
                '& .MuiFormLabel-root': {
                  height: '50px',
                  lineHeight: '50px',
                  top: '-15px',
                },
              }}
            />
          )}
          sx={{ width: '250px' }}
        />
      </Box>

      <Box className="searchbar-container searchbar-container-gap">
        <Autocomplete
          multiple
          freeSolo
          options={skillOptions}
          value={selectedSkills.map(skill => skill.label)}
          onInputChange={(event, newInputValue) => {
            const filteredSkills = skills.filter(skill =>
              skill.label.toLowerCase().includes(newInputValue.toLowerCase())
            );
            handleSelectSkill(filteredSkills.map(skill => skill.label));
          }}
          onChange={handleSelectSkill}
          renderInput={(params) => (
            <TextField
              {...params}
              variant="outlined"
              placeholder="Select Skills"
              InputProps={{
                ...params.InputProps,
                startAdornment: (
                  <SearchIcon style={{ marginRight: '8px' }} />
                ),
                endAdornment: (
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    {selectedSkills.length > 0 ? (
                      <ClearIcon
                        className="clear-icon"
                        onClick={handleClearSkills}
                        style={{ cursor: 'pointer', marginRight: '0px' }}
                      />
                    ) : null}
                  </div>
                ),
                sx: { borderRadius: 5 },
              }}
              sx={{
                width: "250px",
                '& .MuiOutlinedInput-root': {
                  height: '50px',
                },
                '& .MuiFormLabel-root': {
                  height: '50px',
                  lineHeight: '50px',
                  top: '-15px',
                },
              }}
            />
          )}
          renderOption={(props, option) => {
            const { key, ...restProps } = props;
            return (
              <ListItem key={key} {...restProps} button={true}>
                <Checkbox
                  checked={selectedSkills.some(skill => skill.label === option)}
                  onChange={(event) => {
                    const selected = selectedSkills.map(skill => skill.label);
                    const newSelected = event.target.checked
                      ? [...selected, option]
                      : selected.filter(s => s !== option);
                    handleSkillChange(skills.filter(skill => newSelected.includes(skill.label)));
                  }}
                />
                <ListItemText primary={option} />
              </ListItem>
            );
          }}
          sx={{ width: '250px' }}
        />
      </Box>

      <button className='clear-button' onClick={clearDepartment}>Clear</button>
    </div>
  );
};

export default DepartmentSearchBar;
