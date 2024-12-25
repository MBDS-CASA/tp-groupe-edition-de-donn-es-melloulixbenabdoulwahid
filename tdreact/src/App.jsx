import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import data from './assets/data.json';
import MainContent from './components/MainContent';
import Header from './components/Header';
import Footer from "./components/Footer.jsx";
import Menu from "./components/Menu.jsx";
import Formulaire from "./components/Formulaire.jsx";


function DisplayItem({ item }) {
    return (
        <div>
            <h2>{item.course}</h2>
            <p>Étudiant : {item.student.firstname} {item.student.lastname} id : {item.student.id}</p>
            <p>Date : {item.date}</p>
            <p>Note : {item.grade}</p>
        </div>
    );
}
function getRandomItem(data) {
    const randomIndex = Math.floor(Math.random() * data.length);
    return data[randomIndex];
}

function App() {
    const [count, setCount] = useState(0)
    const randomItem = getRandomItem(data);

    return (

        <>
            <Menu />
            <div>
                <Formulaire />
                <Header name="React" />
                <a href="https://vite.dev" target="_blank">
                    <img src={viteLogo} className="logo" alt="Vite logo" />
                </a>
                <a href="https://react.dev" target="_blank">
                    <img src={reactLogo} className="logo react" alt="React logo" />
                </a>
            </div>
            <MainContent />
            <h1>Vite + React</h1>
            <div className="card">
                <button onClick={() => setCount((count) => count + 1)}>
                    count is {count}
                </button>
                <p>
                    Edit <code>src/App.jsx</code> and save to test HMR
                </p>
                <DisplayItem item={randomItem} />
            </div>
            <p className="read-the-docs">
                Click on the Vite and React logos to learn more
            </p>
            <Footer />
        </>
    );
}

export default App
