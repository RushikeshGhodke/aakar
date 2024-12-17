import React, { useState } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    TablePagination,
    TableSortLabel,
    Button,
    Menu,
    MenuItem,
    Box,
} from '@mui/material';
import { Link } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable'; // Required for auto table
import * as XLSX from 'xlsx'; // Required for Excel
import './TableComponent.css';
import Searchbar from "../../pages/employee/Searchbox/Searchbar.jsx";
import { FiDownload } from "react-icons/fi";


const TableComponent = ({ rows, columns, linkBasePath, itemName }) => {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [order, setOrder] = useState('asc');
    const [orderBy, setOrderBy] = useState(columns[0]?.id || '');
    const [anchorEl, setAnchorEl] = useState(null);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    const handleRequestSort = (property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const stableSort = (array, comparator) => {
        const stabilizedThis = array.map((el, index) => [el, index]);
        stabilizedThis.sort((a, b) => {
            const order = comparator(a[0], b[0]);
            if (order !== 0) return order;
            return a[1] - b[1];
        });
        return stabilizedThis.map((el) => el[0]);
    };

    const getComparator = (order, orderBy) => {
        return order === 'desc'
            ? (a, b) => descendingComparator(a, b, orderBy)
            : (a, b) => -descendingComparator(a, b, orderBy);
    };

    const descendingComparator = (a, b, orderBy) => {
        if (a[orderBy] === undefined || b[orderBy] === undefined) {
            return 0; // Handle undefined properties
        }
        if (b[orderBy] < a[orderBy]) {
            return -1;
        }
        if (b[orderBy] > a[orderBy]) {
            return 1;
        }
        return 0;
    };

    const handleDownloadClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const downloadFile = (fileType) => {
        if (fileType === 'excel') {
            exportToExcel(rows, columns);
        } else if (fileType === 'pdf') {
            exportToPDF(rows, columns);
        }
        handleClose();
    };

    const exportToExcel = (rows, columns) => {
        const worksheet = XLSX.utils.json_to_sheet(rows);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Data');
        XLSX.writeFile(workbook, 'data.xlsx');
    };

    const exportToPDF = (rows, columns) => {
        const doc = new jsPDF();
        doc.autoTable({
            head: [columns.map(col => col.label)],
            body: rows.map(row => columns.map(col => row[col.id])),
        });
        doc.save('' +
            '.pdf');
    };

    return (
        <Box>
            <div className={`flex items-center justify-between`}>
                <Searchbar
                    items={rows}
                    itemKey="de" // Assuming each employee has an empId as a unique key
                    itemLabel={itemName} // Name to search by
                    navigateTo={linkBasePath}
                />
                <div className={`hover:cursor-pointer border-2 border-[#0061A1] rounded px-4 py-1.5 font-semibold text-[#0061A1] flex justify-between items-center gap-3`} onClick={handleDownloadClick}>
                    <FiDownload />
                    <p>Download</p>
                </div>
                <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleClose}
                >
                    <MenuItem onClick={() => downloadFile('excel')}>Download as Excel</MenuItem>
                    <MenuItem onClick={() => downloadFile('pdf')}>Download as PDF</MenuItem>
                </Menu>
            </div>

            <Paper className="table-container">
                <TableContainer className="custom-scrollbar">
                    <Table aria-label="data table">
                        <TableHead>
                            <TableRow>
                                <TableCell
                                    align="left"
                                    sx={{
                                        fontWeight: 'bold',
                                        backgroundColor: '#FFFFFF',
                                        color: '#002773',
                                        fontSize: '16px',
                                        textAlign: 'left',
                                        fontFamily: 'Inter, sans-serif',
                                        position: 'sticky',
                                        top: 0,
                                        zIndex: 1,
                                    }}
                                >
                                    Sr. No.
                                </TableCell>
                                {columns.map((column) => (
                                    <TableCell
                                        key={column.id}
                                        align={column.align}
                                        sx={{
                                            fontWeight: 'bold',
                                            backgroundColor: '#FFFFFF',
                                            color: '#002773',
                                            fontSize: '16px',
                                            textAlign: 'left',
                                            fontFamily: 'Inter, sans-serif',
                                            position: 'sticky',
                                            top: 0,
                                            zIndex: 1,
                                        }}
                                        sortDirection={orderBy === column.id ? order : false}
                                    >
                                        <TableSortLabel
                                            active={orderBy === column.id}
                                            direction={orderBy === column.id ? order : 'asc'}
                                            onClick={() => handleRequestSort(column.id)}
                                        >
                                            {column.label}
                                        </TableSortLabel>
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableHead>

                        <TableBody>
                            {stableSort(rows, getComparator(order, orderBy))
                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map((row, index) => {
                                    const RowComponent = linkBasePath ? Link : 'tr';
                                    const rowProps = linkBasePath
                                        ? {
                                            component: RowComponent,
                                            to: `${linkBasePath}/${row.empId || row.deptId || row.projectId}`,
                                            sx: { cursor: 'pointer', textDecoration: 'none' },
                                        }
                                        : { component: 'tr' };

                                    return (
                                        <TableRow key={uuidv4()} {...rowProps}>
                                            <TableCell align="left">
                                                {(page * rowsPerPage) + index + 1}
                                            </TableCell>
                                            {columns.map((column) => (
                                                <TableCell key={column.id} align={column.align}>
                                                    {row[column.id]}
                                                </TableCell>
                                            ))}
                                        </TableRow>
                                    );
                                })}
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    component="div"
                    count={rows.length}
                    page={page}
                    onPageChange={handleChangePage}
                    rowsPerPage={rowsPerPage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    rowsPerPageOptions={[10, 25, 50]}
                />
            </Paper>
        </Box>
    );
};

export default TableComponent;
