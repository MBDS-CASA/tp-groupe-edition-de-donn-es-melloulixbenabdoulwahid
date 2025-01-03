import React, { useState, useEffect } from "react";
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
    const [data, setData] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [formData, setFormData] = useState({
        course: "", // Now stores course ID
        courseName: "" // For display purposes
    });
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingCourse, setEditingCourse] = useState(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const response = await fetch("http://localhost:8010/api/grades");
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            const jsonData = await response.json();
            setData(jsonData);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    // Filtrer les matières en fonction de la recherche (using course name)
    const filteredData = data.filter((item) =>
        item.course.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Regrouper les matières, calculer les moyennes et le nombre d'étudiants
    const courses = filteredData.reduce((acc, item) => {
        const course = acc.find((c) => c.id === item.course._id); // Use course ID
        if (!course) {
            acc.push({ id: item.course._id, name: item.course.name, grades: [item.grade], students: 1 });
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
    const handleAddOrEditCourse = async () => {
        if (editingCourse) {
            // Handle modification: Only the name should be editable.
            // You might want a separate API endpoint for changing just course names
            // For now, updating only the locally stored `courses` object:

            const courseIndex = courses.findIndex((c) => c.id === editingCourse)
            if (courseIndex !== -1) {
                courses[courseIndex].name = formData.courseName
                // Refresh displayed courses
                setData([...data]);
            }

        } else {
            // No need for adding grades here as grades are added separately.
        }
        resetForm();
        setIsDialogOpen(false);
    };

    // Supprimer une matière (and related grades)
    const handleDeleteCourse = async (courseId) => {
        // We must delete related grades as well, or orphan grades will exist in the db.
        const gradeIdsToDelete = data
            .filter((grade) => grade.course._id === courseId)
            .map((grade) => grade._id);

        try {
            // Make separate API calls to delete grades using their IDs.
            // Best way is to have an API call for multiple deletion for performance, like so:
            // /api/grades/deleteMany using POST and sending an array of IDs.

            for (const gradeId of gradeIdsToDelete) {
                const deleteGradeRes = await fetch(`http://localhost:8010/api/grades/${gradeId}`, {
                    method: "DELETE"
                });

                if (!deleteGradeRes.ok) {
                    console.error(`Failed to delete grade with ID: ${gradeId}`);
                    // Optionally stop the entire process on one error. Or handle somehow else.
                }
            }

            // Now fetch data again, or remove the affected items manually (less safe)
            fetchData();

        } catch (err) {
            console.error("Error during course deletion: ", err)
        }
    };

    const resetForm = () => {
        setFormData({ course: "", courseName: "" });
        setEditingCourse(null);
    };

    // Fonction pour télécharger les données en CSV
    const exportToCSV = () => {
        const csvData = [
            ["Matière", "Nombre d'étudiants", "Moyenne des notes"],
            ...coursesWithDetails.map((course) => [
                course.name,
                course.students,
                course.average.toFixed(2),
            ]),
        ];

        const csvContent = csvData.map((row) => row.join(",")).join("\n");
        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "matieres.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
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
                    style={{ marginTop: "10px", marginRight: "10px" }}
                    onClick={() => setIsDialogOpen(true)}
                >
                    Ajouter une matière
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
                                            setEditingCourse(course.id);
                                            setFormData({ course: course.id, courseName: course.name });
                                            setIsDialogOpen(true);
                                        }}
                                    >
                                        Modifier
                                    </Button>
                                    <Button
                                        variant="outlined"
                                        color="secondary"
                                        onClick={() => handleDeleteCourse(course.id)}
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
                        name="courseName"
                        label="Matière"
                        value={formData.courseName}
                        onChange={(e) => setFormData({ ...formData, courseName: e.target.value })}
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