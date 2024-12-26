import {Route, Routes} from "react-router";
import Notes from "./components/Notes";
import Etudiants from "./components/Etudiants";
import Matieres from "./components/Matieres";
import APropos from "./components/APropos";

function AppRoute() {
    return (
        <Routes>
            <Route path="/etudiants" element={<Etudiants />} />
            <Route path="/matieres" element={<Matieres />} />
            <Route path="/a-propos" element={<APropos />} />
            <Route path="/notes" element={<Notes />} />
        </Routes>
    )
}

export default AppRoute