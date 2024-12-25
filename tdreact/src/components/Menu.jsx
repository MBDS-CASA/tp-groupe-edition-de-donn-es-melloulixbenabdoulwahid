import React, { useState } from 'react';
import Notes from './Notes';
import Etudiants from './Etudiants';
import Matieres from './Matieres';
import APropos from './APropos';

const Menu = () => {
    const [selectedMenuItem, setSelectedMenuItem] = useState(null);
    const menuItems = [
        { id: 1, text: 'Notes', alertText: 'Vous avez cliqué sur Notes', component: <Notes /> },
        { id: 2, text: 'Étudiants', alertText: 'Vous avez cliqué sur Étudiants', component: <Etudiants /> },
        { id: 3, text: 'Matières', alertText: 'Vous avez cliqué sur Matières', component: <Matieres /> },
        { id: 4, text: 'À propos', alertText: 'Vous avez cliqué sur À propos', component: <APropos /> },
    ];

    const handleMenuItemClick = (item) => {
        setSelectedMenuItem(item);
        alert(item.alertText);
    };

    return (
        <div>
            <nav>
                <ul>
                    {menuItems.map((item) => (
                        <li
                            key={item.id}
                            onClick={() => handleMenuItemClick(item)}
                            className={item.id === selectedMenuItem?.id ? 'active' : ''}
                        >
                            {item.text}
                        </li>
                    ))}
                </ul>
            </nav>

            <div className="content">
                {selectedMenuItem ? selectedMenuItem.component : <p>Sélectionnez un menu pour commencer.</p>}
            </div>
        </div>
    );
};

export default Menu;
