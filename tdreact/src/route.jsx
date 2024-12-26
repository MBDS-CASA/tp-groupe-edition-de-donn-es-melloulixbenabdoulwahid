import {Route, Routes} from "react-router";
import Etudiants from "./components/Etudiants.jsx";
import Notes from "./components/Notes.jsx";
import Matieres from "./components/Matieres.jsx";
import APropos from "./components/APropos.jsx";
function AppRoute() {
    return (
        <Routes>
            <Route path="/etudiants" element={<Etudiants />} />
            <Route path="/notes" element={<Notes />} />
            <Route path="/matieres" element={<Matieres />} />
            <Route path="/apropos" element={<APropos />} />
        </Routes>
    )
}
export default AppRoute