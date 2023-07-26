import React from 'react'
import power_img from '../../assets/power.png';
import { useNavigate } from 'react-router-dom';



const AdminHomePage = () => {

    const navigate = useNavigate();

    const exit_account = () => {
        sessionStorage.clear();
        navigate("/login");
    }

    return (
        <div onClick={exit_account} class="exit-account" >
            <img src={power_img} />
            <span>LOGOUT</span>
        </div>
    )
}

export default AdminHomePage