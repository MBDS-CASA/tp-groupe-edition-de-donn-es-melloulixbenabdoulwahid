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

function Notes() {
    const [data, setData] = useState(dataFromJson); // Utilisation des données JSON
    const [searchTerm, setSearchTerm] = useState("");
    const [formData, setFormData] = useState({
        grade: "",
    });
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingId, setEditingId] = useState(null);

    // Filtrer les notes en fonction de la recherche
    const filteredData = data.filter(
        (item) =>
            item.student.firstname.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.student.lastname.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.course.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Modifier une note existante
    const handleEdit = () => {
        const updatedData = data.map((item) =>
            item.unique_id === editingId
                ? {
                    ...item,
                    grade: formData.grade,
                }
                : item
        );
        setData(updatedData);
        resetForm();
        setIsDialogOpen(false);
    };

    // Préparer le formulaire pour modification
    const handleOpenEditDialog = (note) => {
        setEditingId(note.unique_id);
        setFormData({
            grade: note.grade,
        });
        setIsDialogOpen(true);
    };

    const resetForm = () => {
        setFormData({ grade: "" });
        setEditingId(null);
    };

    return (
        <div>
            <h1>Liste des notes</h1>
            <h3>Pour supprimer une note simplement modifiez et laissez le champ vide</h3>
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
                            <TableRow key={item.unique_id}>
                                <TableCell>{item.student.id}</TableCell>
                                <TableCell>{item.student.firstname}</TableCell>
                                <TableCell>{item.student.lastname}</TableCell>
                                <TableCell>{item.course}</TableCell>
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
                        Modifier
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default Notes;
