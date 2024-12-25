import React, { useState } from "react";
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

function Matieres() {
    const [data, setData] = useState(dataFromJson); // Utilisation des données JSON
    const [searchTerm, setSearchTerm] = useState("");
    const [formData, setFormData] = useState({
        course: "",
    });
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingCourse, setEditingCourse] = useState(null);

    // Filtrer les matières en fonction de la recherche
    const filteredData = data.filter((item) =>
        item.course.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Regrouper les matières et calculer les moyennes et le nombre d'étudiants
    const courses = filteredData.reduce((acc, item) => {
        const course = acc.find((c) => c.name === item.course);
        if (!course) {
            acc.push({ name: item.course, grades: [item.grade], students: 1 });
        } else {
            course.grades.push(item.grade);
            course.students += 1;
        }
        return acc;
    }, []);

    const coursesWithDetails = courses.map((course) => ({
        ...course,
        average:
            course.grades.reduce((sum, grade) => sum + parseFloat(grade), 0) /
            course.grades.length,
    }));

    // Ajouter ou modifier une matière
    const handleAddOrEditCourse = () => {
        if (editingCourse) {
            const updatedData = data.map((item) =>
                item.course === editingCourse ? { ...item, course: formData.course } : item
            );
            setData(updatedData);
        } else {
            const newData = {
                unique_id: Date.now(),
                course: formData.course,
                student: { firstname: "", lastname: "", id: Date.now() },
                date: new Date().toISOString().split("T")[0],
                grade: 0,
            };
            setData([...data, newData]);
        }
        resetForm();
        setIsDialogOpen(false);
    };

    // Supprimer une matière
    const handleDeleteCourse = (courseName) => {
        setData(data.filter((item) => item.course !== courseName));
    };

    const resetForm = () => {
        setFormData({ course: "" });
        setEditingCourse(null);
    };

    return (
        <div>
            <h1>Liste des matières</h1>
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
                    style={{ marginTop: "10px" }}
                    onClick={() => setIsDialogOpen(true)}
                >
                    Ajouter une matière
                </Button>
            </div>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell className="table-head">Matière</TableCell>
                            <TableCell className="table-head">Nombre d'étudiants</TableCell>
                            <TableCell className="table-head">Moyenne des notes</TableCell>
                            <TableCell className="table-head">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {coursesWithDetails.map((course, index) => (
                            <TableRow key={index}>
                                <TableCell>{course.name}</TableCell>
                                <TableCell>{course.students}</TableCell>
                                <TableCell>{course.average.toFixed(2)}</TableCell>
                                <TableCell>
                                    <Button
                                        variant="outlined"
                                        color="primary"
                                        onClick={() => {
                                            setEditingCourse(course.name);
                                            setFormData({ course: course.name });
                                            setIsDialogOpen(true);
                                        }}
                                    >
                                        Modifier
                                    </Button>
                                    <Button
                                        variant="outlined"
                                        color="secondary"
                                        onClick={() => handleDeleteCourse(course.name)}
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

            <Dialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)}>
                <DialogTitle>
                    {editingCourse ? "Modifier une matière" : "Ajouter une matière"}
                </DialogTitle>
                <DialogContent>
                    <TextField
                        fullWidth
                        name="course"
                        label="Matière"
                        value={formData.course}
                        onChange={(e) => setFormData({ ...formData, course: e.target.value })}
                        margin="dense"
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setIsDialogOpen(false)} color="secondary">
                        Annuler
                    </Button>
                    <Button onClick={handleAddOrEditCourse} color="primary">
                        {editingCourse ? "Modifier" : "Ajouter"}
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default Matieres;
