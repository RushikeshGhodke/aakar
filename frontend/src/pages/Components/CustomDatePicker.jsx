import React from 'react';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import TextField from '@mui/material/TextField';
import dayjs from 'dayjs';
import { styled } from '@mui/material/styles';

const StyledDatePicker = styled(DatePicker)(({ theme }) => ({
  '& .MuiPickersCalendarHeader-root': {
    marginBottom: theme.spacing(1), 
  },
  '& .MuiPickersArrowSwitcher-root': {
    display: 'flex',
    gap: '5px', 
    justifyContent: 'center',
    alignItems: 'center',
  },
  '& .MuiIconButton-root': {
    padding: '8px', 
    backgroundColor: 'transparent', 
    '&:hover': {
      backgroundColor: 'transparent', 
    },
  },
}));

const CustomDatePicker = ({ label, selected, onChange }) => {
  const formattedSelected = dayjs.isDayjs(selected) ? selected : dayjs(selected);
  const formattedDate = formattedSelected.format('YYYY-MM-DD');

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <StyledDatePicker
        label={label}
        value={formattedSelected}
        onChange={onChange}
        slots={{
          textField: (params) => (
            <TextField
              {...params}
              value={formattedDate}
              sx={{
                '& .MuiInputBase-root': {
                  borderRadius: '10px',
                  height: '50px',
                },
                '& .MuiInputBase-input': {
                  fontSize: '1rem',
                  height: '100%',
                },
              }}
            />
          ),
        }}
      />
    </LocalizationProvider>
  );
};

export default CustomDatePicker;

