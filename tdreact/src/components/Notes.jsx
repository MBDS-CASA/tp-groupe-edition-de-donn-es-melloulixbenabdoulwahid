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

function Notes() {
    const [data, setData] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [formData, setFormData] = useState({
        grade: "",
    });
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingId, setEditingId] = useState(null);

    // Fetch data from API on component mount
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

    // Filter grades based on search term
    const filteredData = data.filter(
        (item) =>
            item.student.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.student.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.course.name.toLowerCase().includes(searchTerm.toLowerCase()) // Use item.course.name
    );

    // Edit an existing grade
    const handleEdit = async () => {
        // Check if the grade is empty and handle it as a delete operation
        if (formData.grade === "") {
            handleDelete(editingId); // Call the delete function
            return;
        }
        try {
            const response = await fetch(`http://localhost:8010/api/grades/${editingId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ grade: parseFloat(formData.grade) }), // Send only the updated grade
            });

            if (!response.ok) {
                throw new Error("Network response was not ok");
            }

            // Update local data after successful API call
            const updatedData = data.map((item) =>
                item._id === editingId
                    ? {
                        ...item,
                        grade: parseFloat(formData.grade),
                    }
                    : item
            );
            setData(updatedData);
            resetForm();
            setIsDialogOpen(false);

        } catch (error) {
            console.error("Error updating grade:", error);
        }
    };

    // Delete a grade
    const handleDelete = async (gradeId) => {
        try {
            const response = await fetch(`http://localhost:8010/api/grades/${gradeId}`, {
                method: "DELETE",
            });

            if (!response.ok) {
                throw new Error("Network response was not ok");
            }

            // Remove the deleted grade from local data
            setData(data.filter((item) => item._id !== gradeId));
            resetForm();
            setIsDialogOpen(false);

        } catch (error) {
            console.error("Error deleting grade:", error);
        }
    };

    // Prepare form for editing
    const handleOpenEditDialog = (note) => {
        setEditingId(note._id); // Use note._id from API
        setFormData({
            grade: note.grade.toString(), // Convert to string for input field
        });
        setIsDialogOpen(true);
    };

    // Reset form
    const resetForm = () => {
        setFormData({ grade: "" });
        setEditingId(null);
    };

    // Export data to CSV
    const exportToCSV = () => {
        const csvData = [
            ["ID", "Prénom", "Nom", "Cours", "Date", "Note"],
            ...data.map((item) => [
                item.student._id,
                item.student.firstName,
                item.student.lastName,
                item.course.name,
                item.date,
                item.grade,
            ]),
        ];

        const csvContent = csvData.map((row) => row.join(",")).join("\n");
        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "notes.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div>
            <h1>Liste des notes</h1>
            <h3>Pour supprimer une note, modifiez-la et laissez le champ vide</h3>
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
                            <TableCell className="table-head">ID</TableCell>
                            <TableCell className="table-head">Prénom</TableCell>
                            <TableCell className="table-head">Nom</TableCell>
                            <TableCell className="table-head">Cours</TableCell>
                            <TableCell className="table-head">Date</TableCell>
                            <TableCell className="table-head">Note</TableCell>
                            <TableCell className="table-head">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredData.map((item) => (
                            <TableRow key={item._id}>
                                <TableCell>{item.student._id}</TableCell>
                                <TableCell>{item.student.firstName}</TableCell>
                                <TableCell>{item.student.lastName}</TableCell>
                                <TableCell>{item.course.name}</TableCell> {/* Use item.course.name */}
                                <TableCell>{item.date}</TableCell>
                                <TableCell>{item.grade}</TableCell>
                                <TableCell>
                                    <Button
                                        variant="outlined"
                                        color="primary"
                                        onClick={() => handleOpenEditDialog(item)}
                                    >
                                        Modifier
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)}>
                <DialogTitle>Modifier la note</DialogTitle>
                <DialogContent>
                    <TextField
                        fullWidth
                        name="grade"
                        label="Note"
                        value={formData.grade}
                        onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
                        margin="dense"
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setIsDialogOpen(false)} color="secondary">
                        Annuler
                    </Button>
                    <Button onClick={handleEdit} color="primary">
                        Enregistrer
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default Notes;