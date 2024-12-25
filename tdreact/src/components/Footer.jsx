import React from "react";

function Footer() {
    const date = new Date();
    const year = date.getFullYear();
    return (
        <footer>
            <p>© {year} - MELLOULI Mohamed Amine, Tous droits réservés.</p>
        </footer>
    )
}

export default Footer;