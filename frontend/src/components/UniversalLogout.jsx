import React from 'react'
import { useNavigate } from 'react-router-dom';
import "./UniversalLogout.css"
import Button from "./Button"
import { ReactComponent as PowerIcon } from '../assets/svg/power.svg';

const AdminHomePage = ({ setLocation }) => {

    const navigate = useNavigate();

    const handleLogout = () => {
        sessionStorage.clear();
        setLocation("/login")
        navigate("/login");
    }

    return (
        <Button onClick={handleLogout} className="outlined lo_button" >
            <PowerIcon />
        </Button>
    )
}

export default AdminHomePage