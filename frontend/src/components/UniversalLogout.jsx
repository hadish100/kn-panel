import React,{useState} from 'react'
import { useNavigate } from 'react-router-dom';
import "./UniversalLogout.css"
import Button from "./Button"
import VerifyLogout from './admin/VerifyLogout' 
import { ReactComponent as PowerIcon } from '../assets/svg/power.svg';

const AdminHomePage = ({ setLocation }) => {

    const [showVerifyLogout, setShowVerifyLogout] = useState(false)

    const navigate = useNavigate();

    const handleLogout = () => {
        setShowVerifyLogout(true)
    }

    const handleVerifyLogout = () => {
        sessionStorage.clear();
        setLocation("/login")
        navigate("/login");
    }

    const handleCloseVerifyLogout = () => {
        setShowVerifyLogout(false)
    }



    return (
        <>
        <Button onClick={handleLogout} className="outlined lo_button" >
            <PowerIcon />
        </Button>


        <VerifyLogout
        onClose={handleCloseVerifyLogout}
        showForm={showVerifyLogout}
        onDeleteItem={handleVerifyLogout}
        />
        </>
    )
}

export default AdminHomePage