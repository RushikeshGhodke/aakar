import { useState, useEffect } from 'react';
import { Box, TextField, InputAdornment, Autocomplete } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useNavigate } from 'react-router-dom';
import './Searchbar.css';

function Searchbar({ items, itemKey, itemLabel, navigateTo }) {
    const [input, setInput] = useState('');
    const [filteredSuggestions, setFilteredSuggestions] = useState([]);

    const navigate = useNavigate();

    useEffect(() => {
        const sanitizedList = Array.isArray(items) ? items.map(item => item[itemLabel]).filter(name => typeof name === 'string') : [];
        setFilteredSuggestions(sanitizedList);
    }, [items, itemLabel]);

    const handleSelect = (event, value) => {
        if (typeof value === 'string') {
            const selectedItem = items.find(item => item[itemLabel].toLowerCase() === value.toLowerCase());
            console.log(selectedItem.empId)
            if (selectedItem) {
                navigate(`${navigateTo}/${selectedItem[itemKey]}`);
            }
        }
    };

    return (
        <Box className="searchbar-container">
            <Autocomplete
                freeSolo
                options={filteredSuggestions}
                inputValue={input}
                onInputChange={(event, newInputValue) => {
                    setInput(newInputValue.toLowerCase());
                    const filtered = filteredSuggestions.filter(name =>
                        name.toLowerCase().includes(newInputValue.toLowerCase())
                    );
                    setFilteredSuggestions(filtered);
                }}
                onChange={handleSelect}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        variant="outlined"
                        // placeholder={`Search for ${itemLabel.toLowerCase()}`}
                        placeholder={`Search`}
                        InputProps={{
                            ...params.InputProps,
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon />
                                </InputAdornment>
                            ),
                            className: 'searchbar-input',
                        }}
                        className="searchbar-textfield"
                    />
                )}
                sx={{ width: '100%' }}
            />
        </Box>
    );
}

export default Searchbar;
