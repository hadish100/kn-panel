import React, { useState } from 'react'

import './Login.css'
import { ReactComponent as LoginIcon } from "../assets/svg/login.svg"
import { ReactComponent as Logo } from "../assets/svg/logo.svg"
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button'
import axios from "axios"
import ErrorCard from '../components/ErrorCard';

const Login = ({ setIsLoggedIn, setLocation }) => {
    const [hasError, setHasError] = useState(false)
    const navigate = useNavigate();

    const handleClose = () => {
        setHasError(false)
    }

    const send_login_data = async (e) => {
        e.preventDefault();
        var username = e.target[0].value
        var password = e.target[1].value
        var res = await axios.post("/login", { username, password });
        if (res.data === "ERR") {
            setHasError(true)
        }

        else {
            var access_token = res.data.access_token;

            if (res.data.is_admin) {
                setIsLoggedIn(true)
                sessionStorage.setItem("isLoggedIn", "true")
                sessionStorage.setItem("access_token", res.data.access_token)
                var agents = (await axios.post("/get_agents", { access_token })).data;
                var panels = (await axios.post("/get_panels", { access_token })).data;
                console.log(agents);
                console.log(panels);
                sessionStorage.setItem("agents",JSON.stringify(agents));
                sessionStorage.setItem("panels",JSON.stringify(panels));
                setLocation("/admin/panels");
                navigate('/admin/panels');
            }

            else {
                setIsLoggedIn(true)
                sessionStorage.setItem("isLoggedIn", "true")
                setLocation("/agent/users")
                navigate('/agent/users');
            }

        }
    }

    const errorCard = (
        <ErrorCard
            hasError={hasError}
            onClick={handleClose}
            errorTitle="Login Failed"
            errorMessage="Please check your username and password"
        />
    )

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
            {errorCard}
        </div>
    )
}

export default Login