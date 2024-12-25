import React, { useState } from "react";
import '../App.css'
import dataFromJson from "../assets/data.json"; // Importation des données JSON
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    TextField,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle
} from "@mui/material";
import Papa from "papaparse"; // Bibliothèque pour manipuler les fichiers CSV

function Etudiants() {
    const [data, setData] = useState(dataFromJson); // Utilisation des données JSON
    const [searchTerm, setSearchTerm] = useState("");
    const [formData, setFormData] = useState({
        firstname: "",
        lastname: "",
        course: "",
    });
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingId, setEditingId] = useState(null);

    // Fonction pour calculer la moyenne des notes pour chaque étudiant
    const getAverageGrades = (studentId) => {
        const studentGrades = data
            .filter((item) => item.student.id === studentId)
            .map((item) => parseFloat(item.grade));
        if (studentGrades.length === 0) return 0;
        const total = studentGrades.reduce((sum, grade) => sum + grade, 0);
        return (total / studentGrades.length).toFixed(2);
    };

    // Fonction pour télécharger les données en CSV
    const exportToCSV = () => {
        const csvData = data.map((item) => ({
            ID: item.student.id,
            Prénom: item.student.firstname,
            Nom: item.student.lastname,
            Cours: item.course,
            Moyenne: getAverageGrades(item.student.id),
            Date: item.date,
        }));
        const csv = Papa.unparse(csvData);
        const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "etudiants.csv");
        document.body.appendChild(link);
        link.click();
        link.parentNode.removeChild(link);
    };

    // Filtrer les étudiants en fonction de la recherche
    const filteredData = data.filter(
        (item) =>
            item.student.firstname.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.student.lastname.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.course.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Ajouter ou modifier un étudiant
    const handleAddOrEdit = () => {
        if (editingId) {
            const updatedData = data.map((item) =>
                item.unique_id === editingId
                    ? {
                        ...item,
                        course: formData.course,
                        student: {
                            ...item.student,
                            firstname: formData.firstname,
                            lastname: formData.lastname,
                        },
                    }
                    : item
            );
            setData(updatedData);
        } else {
            const newStudent = {
                unique_id: Date.now(),
                course: formData.course,
                student: {
                    firstname: formData.firstname,
                    lastname: formData.lastname,
                    id: Date.now(),
                },
                date: new Date().toISOString().split("T")[0],
                grade: 0,
            };
            setData([...data, newStudent]);
        }
        resetForm();
        setIsDialogOpen(false);
    };

    const handleEdit = (student) => {
        setEditingId(student.unique_id);
        setFormData({
            firstname: student.student.firstname,
            lastname: student.student.lastname,
            course: student.course,
        });
        setIsDialogOpen(true);
    };

    const handleDelete = (id) => {
        setData(data.filter((item) => item.unique_id !== id));
    };

    const resetForm = () => {
        setFormData({ firstname: "", lastname: "", course: "" });
        setEditingId(null);
    };

    return (
        <div>
            <h1>Liste des étudiants</h1>
            <div
                style={{
                    maxWidth: 800,
                    margin: "auto",
                    marginBottom: "20px",
                    padding: "20px",
                    backgroundColor: "#f7f7f7",
                    border: "1px solid #ddd",
                    borderRadius: "10px",
                    boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)",
                }}
            >
                <TextField
                    fullWidth
                    label="Rechercher"
                    variant="outlined"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Button
                    variant="contained"
                    color="primary"
                    style={{ marginTop: "10px", marginRight: "10px" }}
                    onClick={() => setIsDialogOpen(true)}
                >
                    Ajouter un étudiant
                </Button>
                <Button
                    variant="contained"
                    color="secondary"
                    style={{ marginTop: "10px" }}
                    onClick={exportToCSV}
                >
                    Télécharger CSV
                </Button>
            </div>

            {/* Tableau */}
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell className="table-head">ID</TableCell>
                            <TableCell className="table-head">Prénom</TableCell>
                            <TableCell className="table-head">Nom</TableCell>
                            <TableCell className="table-head">Cours</TableCell>
                            <TableCell className="table-head">Moyenne</TableCell>
                            <TableCell className="table-head">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredData.map((item) => (
                            <TableRow key={item.unique_id}>
                                <TableCell>{item.student.id}</TableCell>
                                <TableCell>{item.student.firstname}</TableCell>
                                <TableCell>{item.student.lastname}</TableCell>
                                <TableCell>{item.course}</TableCell>
                                <TableCell>{getAverageGrades(item.student.id)}</TableCell>
                                <TableCell>
                                    <Button
                                        variant="outlined"
                                        color="primary"
                                        onClick={() => handleEdit(item)}
                                    >
                                        Modifier
                                    </Button>
                                    <Button
                                        variant="outlined"
                                        color="secondary"
                                        onClick={() => handleDelete(item.unique_id)}
                                        style={{ marginLeft: "10px" }}
                                    >
                                        Supprimer
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Dialog */}
            <Dialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)}>
                <DialogTitle>{editingId ? "Modifier un étudiant" : "Ajouter un étudiant"}</DialogTitle>
                <DialogContent>
                    <TextField
                        fullWidth
                        name="firstname"
                        label="Prénom"
                        value={formData.firstname}
                        onChange={(e) => setFormData({ ...formData, firstname: e.target.value })}
                        margin="dense"
                    />
                    <TextField
                        fullWidth
                        name="lastname"
                        label="Nom"
                        value={formData.lastname}
                        onChange={(e) => setFormData({ ...formData, lastname: e.target.value })}
                        margin="dense"
                    />
                    <TextField
                        fullWidth
                        name="course"
                        label="Cours"
                        value={formData.course}
                        onChange={(e) => setFormData({ ...formData, course: e.target.value })}
                        margin="dense"
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setIsDialogOpen(false)} color="secondary">
                        Annuler
                    </Button>
                    <Button onClick={handleAddOrEdit} color="primary">
                        {editingId ? "Modifier" : "Ajouter"}
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default Etudiants;
