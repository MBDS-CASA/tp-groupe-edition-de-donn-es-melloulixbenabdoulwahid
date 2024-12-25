import React , { useState } from 'react';
import data from '../assets/data.json';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TextField} from '@mui/material';

function Etudiants() {
    const [searchTerm, setSearchTerm] = useState('');
    const filteredData = data.filter(
        (item) =>
            item.student.firstname.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.student.lastname.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.course.toLowerCase().includes(searchTerm.toLowerCase())
    );
    return (
        <div>
            <h1>Liste des étudiants</h1>
                <div style={{maxWidth: 800,
                    margin: 'auto',
                    marginBottom: '20px',
                    padding: '20px',
                    backgroundColor: '#f7f7f7',
                    border: '1px solid #ddd',
                    borderRadius: '10px',
                    boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)' }}>
                    <TextField
                        fullWidth
                        label="Rechercher"
                        variant="outlined"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            <TableContainer component={Paper} className="table-container">
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell className="table-head">ID</TableCell>
                            <TableCell className="table-head">Prénom</TableCell>
                            <TableCell className="table-head">Nom</TableCell>
                            <TableCell className="table-head">Cours</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredData.map((item) => (
                            <TableRow key={item.student.id} className="table-row">
                                <TableCell>{item.student.id}</TableCell>
                                <TableCell>{item.student.firstname}</TableCell>
                                <TableCell>{item.student.lastname}</TableCell>
                                <TableCell>{item.course}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
};

export default Etudiants;