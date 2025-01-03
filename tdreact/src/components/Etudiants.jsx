import React, { useState, useEffect } from "react";
import '../App.css'
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
import Papa from "papaparse";

function Etudiants() {
    const [data, setData] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [formData, setFormData] = useState({
        firstname: "",
        lastname: "",
        courseId: "", // Store course ID for modifications
        courseName: "" // Store course name for display
    });
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingId, setEditingId] = useState(null);

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

    // Group grades by student and calculate average grade
    const studentData = data.reduce((acc, item) => {
        const studentId = item.student._id;
        if (!acc[studentId]) {
            acc[studentId] = {
                id: studentId,
                firstname: item.student.firstName,
                lastname: item.student.lastName,
                grades: [],
                courses: [] // Keep track of courses for each student
            };
        }
        acc[studentId].grades.push(item.grade);
        // Add course if not already present
        if (!acc[studentId].courses.some(c => c.id === item.course._id)) {
            acc[studentId].courses.push({ id: item.course._id, name: item.course.name });
        }
        return acc;
    }, {});

    const students = Object.values(studentData).map(student => ({
        ...student,
        average: student.grades.length > 0
            ? (student.grades.reduce((sum, grade) => sum + grade, 0) / student.grades.length).toFixed(2)
            : "N/A"
    }));

    // Function to download CSV data
    const exportToCSV = () => {
        const csvData = students.map((student) => ({
            ID: student.id,
            Prénom: student.firstname,
            Nom: student.lastname,
            "Cours suivis": student.courses.map(course => course.name).join(", "), // All courses in one column
            Moyenne: student.average
        }));

        const csv = Papa.unparse(csvData);
        const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "etudiants.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    // Filter students based on search term
    const filteredStudents = students.filter(
        (student) =>
            student.firstname.toLowerCase().includes(searchTerm.toLowerCase()) ||
            student.lastname.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Add or edit a student
    // Consider having separate API endpoints and frontend components to manage grades.
    const handleAddOrEdit = async () => {
        if (editingId) {
          // API call to modify student here if wanted
        } else {
            // Only modify student without grades if you want here.
        }
        resetForm();
        setIsDialogOpen(false);
    };
  
    // Open edit dialog
    const handleEdit = (student) => {
        setEditingId(student.id);
        // Assuming you only want to edit basic student info, not grades
        setFormData({
            firstname: student.firstname,
            lastname: student.lastname,
            courseId: "", // Not directly editing courses here
            courseName: ""
        });
        setIsDialogOpen(true);
    };

    // Handle student deletion
    const handleDelete = async (studentId) => {
        const gradeIdsToDelete = data
            .filter((item) => item.student._id === studentId)
            .map((item) => item._id);
      
        try {
            for (const gradeId of gradeIdsToDelete) {
                const deleteRes = await fetch(`http://localhost:8010/api/grades/${gradeId}`, {
                    method: "DELETE",
                });

                if (!deleteRes.ok) {
                    throw new Error(`Failed to delete grade with ID: ${gradeId}`);
                }
            }

            // Refetch data after successful deletion
            fetchData();

        } catch (error) {
            console.error("Error deleting student/grades:", error);
        }
    };

    // Reset form
    const resetForm = () => {
        setFormData({ firstname: "", lastname: "", courseId: "", courseName: "" });
        setEditingId(null);
    };

    // Render component
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

            {/* Table */}
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
                        {filteredStudents.map((student) => (
                            <TableRow key={student.id}>
                                <TableCell>{student.id}</TableCell>
                                <TableCell>{student.firstname}</TableCell>
                                <TableCell>{student.lastname}</TableCell>
                                <TableCell>
                                    {student.courses.map(course => course.name).join(", ")}
                                </TableCell>
                                <TableCell>{student.average}</TableCell>
                                <TableCell>
                                    <Button
                                        variant="outlined"
                                        color="primary"
                                        onClick={() => handleEdit(student)}
                                    >
                                        Modifier
                                    </Button>
                                    <Button
                                        variant="outlined"
                                        color="secondary"
                                        onClick={() => handleDelete(student.id)}
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