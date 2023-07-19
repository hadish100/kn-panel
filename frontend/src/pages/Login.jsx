import React from 'react'

import './Login.css'
import { ReactComponent as LoginIcon } from "../assets/svg/login.svg"
import { ReactComponent as Logo } from "../assets/svg/logo.svg"
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button'
import axios from "axios"


const Login = ({ setIsLoggedIn }) => {
    const navigate = useNavigate();
    const send_login_data = async (e) => {
        e.preventDefault();
        var username = e.target[0].value
        var password = e.target[1].value
        var res = await axios.post("/login", { username, password });
        if (res.data === "ERR") {
            alert("LOGIN FAILED");
        }

        else {
            if (res.data.is_admin) {
                setIsLoggedIn(true)
                sessionStorage.setItem("isLoggedIn", "true")
                navigate('/admin/agents', { state: { access_token: res.data.access_token } });
            }

            else {
                setIsLoggedIn(true)
                sessionStorage.setItem("isLoggedIn", "true")
                navigate('/agent/users', { state: { access_token: res.data.access_token } });
            }

        }
    }

    return (
        <div className='login'>
            <Logo />
            <h1 className='login__title'>Login to you account</h1>
            <h2 className='login__subtitle'>Welcome back, please enter your details</h2>
            <form className='login__form' action="" onSubmit={send_login_data}>
                <input type="text" placeholder='Username' className="username" name="username" />
                <input type="password" placeholder='Password' className="password" name="password" />
                <Button className="primary login__btn">
                    <LoginIcon />
                    Login
                </Button>
            </form>
        </div>
    )
}

export default Login