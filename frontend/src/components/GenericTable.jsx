import React, { useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TableSortLabel, Checkbox, IconButton, Collapse, TextField, Menu, MenuItem, TablePagination } from '@mui/material';
import { FiDownload, FiEdit, FiTrash2, FiEye, FiChevronDown } from 'react-icons/fi';
import { jsPDF } from 'jspdf';
import * as XLSX from 'xlsx';
import { useNavigate } from 'react-router-dom';

const GenericTable = ({
                          columns,
                          data,
                          collapsible = false,
                          selectable = false,
                          actions = false,
                          enableSearch = false,
                          defaultSortOrder = 'newest',
                          redirectLink = '',
                          redirectParam = '',
                          onDelete,
                          onEdit,
                          onView,
                      }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [sortConfig, setSortConfig] = useState({ field: 'createdAt', direction: defaultSortOrder === 'newest' ? 'desc' : 'asc' });
    const [selectedItems, setSelectedItems] = useState([]);
    const [menuAnchorEl, setMenuAnchorEl] = useState(null);
    const [expandedRow, setExpandedRow] = useState(null);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const navigate = useNavigate();

    const handleSearch = (event) => {
        setSearchQuery(event.target.value);
    };

    const handleSort = (field) => {
        setSortConfig((prev) => ({
            field,
            direction: prev.field === field && prev.direction === 'asc' ? 'desc' : 'asc',
        }));
    };

    const handleDownload = (format) => {
        if (format === 'PDF') {
            const doc = new jsPDF();
            doc.text('Table Data', 10, 10);
            const tableHeaders = columns.map((col) => col.headerName);
            const tableRows = data.map((row) => columns.map((col) => row[col.field] || ''));
            doc.autoTable({ head: [tableHeaders], body: tableRows });
            doc.save('table-data.pdf');
        } else if (format === 'EXCEL') {
            const worksheet = XLSX.utils.json_to_sheet(
                data.map((row) => {
                    const formattedRow = {};
                    columns.forEach((col) => {
                        formattedRow[col.headerName] = row[col.field] || '';
                    });
                    return formattedRow;
                })
            );
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, 'Data');
            XLSX.writeFile(workbook, 'table-data.xlsx');
        }
        setMenuAnchorEl(null);
    };

    const filteredData = useMemo(() => {
        if (!searchQuery) return data;
        return data.filter((row) =>
            columns.some((col) => row[col.field]?.toString().toLowerCase().includes(searchQuery.toLowerCase()))
        );
    }, [data, columns, searchQuery]);

    const sortedData = useMemo(() => {
        const sorted = [...filteredData].sort((a, b) => {
            const aValue = a[sortConfig.field];
            const bValue = b[sortConfig.field];
            if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
            if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
            return 0;
        });
        return sorted;
    }, [filteredData, sortConfig]);

    const paginatedData = useMemo(() => {
        return sortedData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
    }, [sortedData, page, rowsPerPage]);

    const handleRowClick = (row) => {
        if (redirectLink && redirectParam) {
            navigate(`${redirectLink}/${row[redirectParam]}`);
        }
    };

    const toggleSelectAll = () => {
        if (selectedItems.length === data.length) {
            setSelectedItems([]);
        } else {
            setSelectedItems(data.map((row) => row.id));
        }
    };

    const toggleSelectItem = (id) => {
        setSelectedItems((prev) =>
            prev.includes(id) ? prev.filter((itemId) => itemId !== id) : [...prev, id]
        );
    };

    const toggleCollapse = (rowId) => {
        setExpandedRow((prev) => (prev === rowId ? null : rowId));
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    return (
        <div>
            {enableSearch && (
                <div className="flex justify-between items-center mb-4">
                    <TextField
                        label="Search"
                        variant="outlined"
                        size="small"
                        value={searchQuery}
                        onChange={handleSearch}
                    />
                    <div>
                        <IconButton onClick={(e) => setMenuAnchorEl(e.currentTarget)}>
                            <FiDownload />
                        </IconButton>
                        <Menu
                            anchorEl={menuAnchorEl}
                            open={Boolean(menuAnchorEl)}
                            onClose={() => setMenuAnchorEl(null)}
                        >
                            <MenuItem onClick={() => handleDownload('PDF')}>Download as PDF</MenuItem>
                            <MenuItem onClick={() => handleDownload('EXCEL')}>Download as Excel</MenuItem>
                        </Menu>
                    </div>
                </div>
            )}

            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            {selectable && (
                                <TableCell padding="checkbox">
                                    <Checkbox
                                        indeterminate={selectedItems.length > 0 && selectedItems.length < data.length}
                                        checked={selectedItems.length === data.length}
                                        onChange={toggleSelectAll}
                                    />
                                </TableCell>
                            )}
                            {collapsible && <TableCell />}
                            {columns.map((col) => (
                                <TableCell key={col.field} align={col.align || 'left'}>
                                    <TableSortLabel
                                        active={sortConfig.field === col.field}
                                        direction={sortConfig.field === col.field ? sortConfig.direction : 'asc'}
                                        onClick={() => handleSort(col.field)}
                                    >
                                        {col.headerName}
                                    </TableSortLabel>
                                </TableCell>
                            ))}
                            {actions && <TableCell align="center">Actions</TableCell>}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {paginatedData.map((row) => (
                            <React.Fragment key={row.id}>
                                <TableRow
                                    hover
                                    onClick={() => handleRowClick(row)}
                                    style={{ cursor: redirectLink && redirectParam ? 'pointer' : 'default' }}
                                >
                                    {selectable && (
                                        <TableCell padding="checkbox">
                                            <Checkbox
                                                checked={selectedItems.includes(row.id)}
                                                onChange={() => toggleSelectItem(row.id)}
                                                onClick={(e) => e.stopPropagation()}
                                            />
                                        </TableCell>
                                    )}
                                    {collapsible && (
                                        <TableCell>
                                            <IconButton onClick={(e) => { e.stopPropagation(); toggleCollapse(row.id); }}>
                                                <FiChevronDown style={{ transform: expandedRow === row.id ? 'rotate(180deg)' : 'rotate(0deg)' }} />
                                            </IconButton>
                                        </TableCell>
                                    )}
                                    {columns.map((col) => (
                                        <TableCell key={col.field} align={col.align || 'left'}>
                                            {row[col.field]}
                                        </TableCell>
                                    ))}
                                    {actions && (
                                        <TableCell align="center">
                                            <IconButton onClick={(e) => { e.stopPropagation(); onView(row); }}>
                                                <FiEye />
                                            </IconButton>
                                            <IconButton onClick={(e) => { e.stopPropagation(); onEdit(row); }}>
                                                <FiEdit />
                                            </IconButton>
                                            <IconButton onClick={(e) => { e.stopPropagation(); onDelete(row); }}>
                                                <FiTrash2 />
                                            </IconButton>
                                        </TableCell>
                                    )}
                                </TableRow>
                                {collapsible && (
                                    <TableRow>
                                        <TableCell colSpan={columns.length + (selectable ? 1 : 0) + (actions ? 1 : 0) + 1}>
                                            <Collapse in={expandedRow === row.id} timeout="auto" unmountOnExit>
                                                <div>Collapsible content for row {row.id}</div>
                                            </Collapse>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </React.Fragment>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={sortedData.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
        </div>
    );
};

GenericTable.propTypes = {
    columns: PropTypes.arrayOf(
        PropTypes.shape({
            field: PropTypes.string.isRequired,
            headerName: PropTypes.string.isRequired,
            align: PropTypes.oneOf(['left', 'center', 'right']),
        })
    ).isRequired,
    data: PropTypes.arrayOf(PropTypes.object).isRequired,
    collapsible: PropTypes.bool,
    selectable: PropTypes.bool,
    actions: PropTypes.bool,
    enableSearch: PropTypes.bool,
    defaultSortOrder: PropTypes.oneOf(['newest', 'oldest']),
    redirectLink: PropTypes.string,
    redirectParam: PropTypes.string,
    onDelete: PropTypes.func,
    onEdit: PropTypes.func,
    onView: PropTypes.func,
};

export default GenericTable;
