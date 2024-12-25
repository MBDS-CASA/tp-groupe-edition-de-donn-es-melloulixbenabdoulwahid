import { useState } from 'react';



function Formulaire(){
    const [data, setData] = useState({
        course: '',
    })
    function onDataChange(event){
        console.log(event.target.value);
        setData({
            ...data,
            [event.target.name]: event.target.value
        })
    }
    function onSubmit(){
        console.log(data);
    }
    return (
        <>
        <form>
            <input type="text" name="course" value={data.course} onChange={onDataChange} />
            <button type="submit" onClick={onSubmit}>Ajouter</button>
        </form>

        </>);
};

export default Formulaire;