import React from 'react'
import power_img from '../../assets/power.png';
import { useNavigate } from 'react-router-dom';



const AdminHomePage = ({ setLocation }) => {

    const navigate = useNavigate();

    const handleLogout = () => {
        sessionStorage.clear();
        setLocation("/login")
        navigate("/login");
    }

    return (
        <div onClick={handleLogout} class="exit-account" >
            <img src={power_img} />
            <span>LOGOUT</span>
        </div>
    )
}

export default AdminHomePage