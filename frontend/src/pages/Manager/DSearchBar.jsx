import { useState, useEffect } from 'react';
import { Box, TextField, InputAdornment, Autocomplete } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './DSearchBar.css';

function DSearchbar({onDeptSelect }) {
    const [input, setInput] = useState('');
    const [filteredSuggestions, setFilteredSuggestions] = useState([]);
    const [lst,setLst] = useState([]);
    const navigate = useNavigate();
    useEffect(()=>{
        axios
      .get(`http://localhost:8081/departments`)
      .then((response) => {
        const depts = response.data;
        setLst(depts);
      })
      .catch((error) => {
        console.error('Error fetching departments:', error);
      });
    },[]);

    useEffect(() => {
        // We are assuming `lst` contains objects like { departmentId, departmentName }
        setFilteredSuggestions(lst);
        console.log('List with departments:', lst);
    }, [lst]);

    const handleSelect = (event, selectedDepartment) => {
        if (selectedDepartment) {
            console.log('Selected department ID:', selectedDepartment.departmentId);
            onDeptSelect(selectedDepartment.departmentId);
        } else {
            console.log('No department selected');
        }
    };

    const handleInputChange = (event, newInputValue) => {
        setInput(newInputValue.toLowerCase());

        const filtered = lst.filter(dept => 
            dept.departmentName.toLowerCase().includes(newInputValue.toLowerCase())
        );
        setFilteredSuggestions(filtered);
    };

    
    return (
        <Box className="DSearchbar-container">
            <Autocomplete
                freeSolo
                options={filteredSuggestions}
                getOptionLabel={(option) => option.departmentName} 
                inputValue={input}
                onInputChange={handleInputChange}
                onChange={handleSelect} 
                renderInput={(params) => (
                    <TextField
                        {...params}
                        variant="outlined"
                        placeholder="Select Department"
                        InputProps={{
                            ...params.InputProps,
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon />
                                </InputAdornment>
                            ),
                            className: 'searchbar-input',
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
                        className="searchbar-textfield"
                    />
                )}
                sx={{ width: '100%' }}
            />
        </Box>
    );
}

export default DSearchbar;
