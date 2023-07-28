import React from 'react'
import { useNavigate } from 'react-router-dom';

import Button from "../../components/Button"
import { ReactComponent as PowerIcon } from '../../assets/svg/power.svg';

const AdminHomePage = ({ setLocation }) => {

    const navigate = useNavigate();

    const handleLogout = () => {
        sessionStorage.clear();
        setLocation("/login")
        navigate("/login");
    }

    return (
        <Button onClick={handleLogout} className="outlined" >
            <PowerIcon />
            Logout
        </Button>
    )
}

export default AdminHomePage