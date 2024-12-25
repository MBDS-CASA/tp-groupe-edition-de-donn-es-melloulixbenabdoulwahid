import React from "react";

function Header(props) {
    // let name = "React"
    return (
        <header>
            <img src="https://emsi.ma/wp-content/uploads/2020/07/logo.png"  title="logo" alt="logoemsi"/>
            <h1>Introduction à {props.name}</h1>
            <h2>A la découverte des premières notions de React</h2>
        </header>
    )
}

export default Header;