import React, { useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import { Autocomplete, Checkbox, ListItemText, ListItem, TextField } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import './DepartmentSearchBar.css';

function SkillSearchBar({ skillOptions = [], selectedSkills, handleSelectSkill, handleClearSkills }) {
  const [isSelectAllChecked, setIsSelectAllChecked] = useState(false);

  // Memoizing allOptions to prevent recalculation on every render
  const allOptions = useMemo(() => {
    return [{ id: 'selectAll', label: 'Select All' }, ...skillOptions];
  }, [skillOptions]);

  const handleSelectAll = () => {
    if (isSelectAllChecked) {
      handleSelectSkill([]); // Deselect all
    } else {
      handleSelectSkill(skillOptions.map(skill => skill.id)); // Select all skill ids
    }
    setIsSelectAllChecked(!isSelectAllChecked);
  };

  return (
    <Autocomplete
      multiple
      freeSolo={false}
      disableCloseOnSelect
      options={allOptions}
      getOptionLabel={(option) => option.label}
      value={allOptions.filter(option => selectedSkills.includes(option.id))}
      onChange={(event, newValue) => {
        const selectedIds = newValue.map(option => option.id);
        if (selectedIds.includes('selectAll')) {
          handleSelectAll();
        } else {
          handleSelectSkill(selectedIds);
        }
      }}
      blurOnSelect={false}
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
                {selectedSkills.length > 0 && (
                  <ClearIcon
                    className="clear-icon"
                    onClick={handleClearSkills}
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
      renderOption={(props, option) => (
        <ListItem {...props} key={option.id} button="true">
          <Checkbox
            checked={selectedSkills.includes(option.id) || (option.id === 'selectAll' && isSelectAllChecked)}
            onChange={option.id === 'selectAll' ? handleSelectAll : undefined}
          />
          <ListItemText primary={option.label} />
        </ListItem>
      )}
      
      sx={{ width: '250px' }}
    />
  );
}

// Prop Types Validation
SkillSearchBar.propTypes = {
  skillOptions: PropTypes.array.isRequired,
  selectedSkills: PropTypes.array.isRequired,
  handleSelectSkill: PropTypes.func.isRequired,
  handleClearSkills: PropTypes.func.isRequired,
};

export default SkillSearchBar;
