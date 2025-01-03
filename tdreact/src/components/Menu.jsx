import React,  { useState } from 'react';
import Notes from './Notes';
import Etudiants from './Etudiants';
import Matieres from './Matieres';
import APropos from './APropos';
import { Link } from 'react-router';


const Menu = () => {
    const [selectedMenuItem, setSelectedMenuItem] = useState(null);
    const menuItems = [
        { id: 1, text: 'Notes', alertText: 'Vous avez cliqué sur Notes', component: <Notes />,name:'notes' },
        { id: 2, text: 'Étudiants', alertText: 'Vous avez cliqué sur Étudiants', component: <Etudiants />,name:'etudiants' },
        { id: 3, text: 'Matières', alertText: 'Vous avez cliqué sur Matières', component: <Matieres />,name: 'matieres' },
        { id: 4, text: 'À propos', alertText: 'Vous avez cliqué sur À propos', component: <APropos /> ,name:'apropos'},
    ];

    const handleMenuItemClick = (item) => {
        setSelectedMenuItem(item);

    };

    return (
        <div>
            <nav>
                <ul>
                    {menuItems.map((item) => (
                        <Link
                            key={item.id}
                            onClick={() => handleMenuItemClick(item)}
                            className={item.id === selectedMenuItem?.id ? 'active' : ''}
                            to={`/${item.name}`}
                        >
                            {item.text}
                        </Link>
                    ))}
                </ul>
            </nav>

            <div className="content">
                {selectedMenuItem ? selectedMenuItem.component=null : <p>Sélectionnez un menu pour commencer.</p>}
            </div>
        </div>
    );
};

export default Menu;
