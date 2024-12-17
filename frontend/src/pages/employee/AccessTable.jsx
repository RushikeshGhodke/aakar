import React, { useState } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Checkbox,
    Paper,
    Typography,
    Box,
    Collapse,
    IconButton,
    Button
} from '@mui/material';
import { Add, Visibility, Edit, Delete } from '@mui/icons-material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const AccessTable = ({ access, setAccess }) => {
    // Initial state for checkboxes
    const initialState = {
        Employee: [false, false, false, false], // Create, Read, Update, Delete for Employee
        Project: [false, false, false, false],  // Create, Read, Update, Delete for Project
        TicketTracking: [false, false, false, false], // Create, Read, Update, Delete for Ticket Tracking
        EmpTraining: [false, false, false, false], // Create, Read, Update, Delete for Employee Training
    };

    const [checkboxState, setCheckboxState] = useState(initialState);
    const [open, setOpen] = useState(false);

    // Handle checkbox change
    const handleCheckboxChange = (row, index) => {
        setCheckboxState(prevState => {
            const updatedState = { ...prevState };
            updatedState[row][index] = !updatedState[row][index];
            updateAccessString(updatedState);
            return updatedState;
        });
    };

    // Update access string based on checkbox state
    const updateAccessString = (state) => {
        const accessString = [
            ...Object.values(state).map(row => row.map(value => value ? '1' : '0').join('')),
            '0'.repeat(196) // Keep the remaining bits as 0
        ].join('');
        setAccess(accessString);
    };

    // Reset checkboxes to initial state
    const handleReset = () => {
        setCheckboxState(initialState);
        updateAccessString(initialState); // Ensure access string is reset
    };

    // Toggle collapse section
    const handleToggle = () => {
        setOpen(!open);
    };

    return (
        <Box sx={{ maxWidth: 500, mt: '10px', mb: '25px'}} >
            <Box
                onClick={handleToggle}
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    cursor: 'pointer',
                }}
            >
                <Typography
                    variant="h6"
                    component="div"
                    sx={{
                        fontFamily: 'Inter',
                        fontSize: '18px',
                        marginBottom: '10px',
                        color: '#7D7D7D',
                        flexGrow: 1,
                        fontWeight: 'bold',
                    }}
                >
                    Access
                </Typography>
                <IconButton size="small" sx={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s' }} >
                    <ExpandMoreIcon />
                </IconButton>
            </Box>
            <Collapse in={open}>
                <Box sx={{ mb: 2 }}>
                    <Button
                        sx={{
                            width: '95px',
                            color: '#0061A1',
                            border: '3px solid #0061A1',
                            fontWeight: '600'
                        }}
                        onClick={handleReset}
                    >
                        Reset
                    </Button>
                </Box>
                <TableContainer
                    component={Paper}
                    sx={{
                        borderRadius: 2,
                        border: '1px solid #c4c4c4',
                        boxShadow: 'none',
                    }}
                >
                    <Table sx={{ minWidth: 400 }}>
                        <TableHead>
                            <TableRow>
                                <TableCell></TableCell>
                                <TableCell align="center">
                                    <Box sx={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center' }}>
                                        <Add fontSize="small" sx={{ color: '#A3A3A3', mb: 0.5 }} />
                                        <Typography variant="caption" sx={{ color: '#585858', fontFamily: 'Inter' }}>Add</Typography>
                                    </Box>
                                </TableCell>
                                <TableCell align="center">
                                    <Box sx={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center' }}>
                                        <Visibility fontSize="small" sx={{ color: '#A3A3A3', mb: 0.5 }} />
                                        <Typography variant="caption" sx={{ color: '#585858', fontFamily: 'Inter' }}>Read</Typography>
                                    </Box>
                                </TableCell>
                                <TableCell align="center">
                                    <Box sx={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center' }}>
                                        <Edit fontSize="small" sx={{ color: '#A3A3A3', mb: 0.5 }} />
                                        <Typography variant="caption" sx={{ color: '#585858', fontFamily: 'Inter' }}>Update</Typography>
                                    </Box>
                                </TableCell>
                                <TableCell align="center">
                                    <Box sx={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center' }}>
                                        <Delete fontSize="small" sx={{ color: '#A3A3A3', mb: 0.5 }} />
                                        <Typography variant="caption" sx={{ color: '#585858', fontFamily: 'Inter' }}>Delete</Typography>
                                    </Box>
                                </TableCell>
                            </TableRow>
                        </TableHead>

                        <TableBody>
                            {['Employee', 'Project', 'TicketTracking', 'EmpTraining'].map((row) => (
                                <TableRow key={row}>
                                    <TableCell
                                        component="th"
                                        scope="row"
                                        sx={{
                                            borderBottom: '1px solid #e0e0e0',
                                            fontFamily: 'Inter',
                                            color: '#585858',
                                        }}
                                    >
                                        {row}
                                    </TableCell>
                                    {['Add', 'Read', 'Update', 'Delete'].map((action, index) => (
                                        <TableCell
                                            align="center"
                                            key={action}
                                            sx={{
                                                borderBottom: '1px solid #e0e0e0',
                                            }}
                                        >
                                            <Checkbox
                                                checked={checkboxState[row][index]}
                                                onChange={() => handleCheckboxChange(row, index)}
                                                sx={{ color: '#A3A3A3' }}
                                            />
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Collapse>
        </Box>
    );
};

export default AccessTable;
