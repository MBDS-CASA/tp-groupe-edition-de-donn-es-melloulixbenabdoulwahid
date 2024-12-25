import React from 'react';

function MainContent() {
    const date = new Date();
    const day = date.getDate();
    const month = date.toLocaleString('default', { month: 'long' });
    const year = date.getFullYear();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();
    return (
        <main>
            <p>Bonjour, on est le {day} {month} {year} et il est {hours}:{minutes}:{seconds}</p>
        </main>
    )
}

export default MainContent;