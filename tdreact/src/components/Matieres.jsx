import React , { useState } from 'react';
import data from '../assets/data.json';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TextField} from '@mui/material';

function Matieres() {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredData = data.filter(
        (item) =>
            item.course.toLowerCase().includes(searchTerm.toLowerCase())
    );
    const courses = filteredData.reduce((acc, item) => {
        const course = acc.find((c) => c.name === item.course);
        if (!course) {
            acc.push({ name: item.course, students: 1 });
        } else {
            course.students += 1;
        }
        return acc;
    }, []);

    return (
        <div>
            <h1>Liste des matières</h1>

                <div style={{maxWidth: 800,
                    margin: 'auto',
                    marginBottom: '20px',
                    padding: '20px',
                    backgroundColor: '#f7f7f7',
                    border: '1px solid #ddd',
                    borderRadius: '10px',
                    boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)'}}>
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
                            <TableCell className="table-head">Matière</TableCell>
                            <TableCell className="table-head">Nombre d'étudiants</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {courses.map((course, index) => (
                            <TableRow key={index} className="table-row">
                                <TableCell>{course.name}</TableCell>
                                <TableCell>{course.students}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
};

export default Matieres;
