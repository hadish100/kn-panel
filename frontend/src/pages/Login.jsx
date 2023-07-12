import React from 'react'
import { Link } from "react-router-dom";
import './Login.css'
import { ReactComponent as LoginIcon } from "../assets/login.svg"
import { ReactComponent as Logo } from "../assets/logo.svg"

const Login = () => {
    return (
        <>
            <div className='login_flexor'>
                 <Logo />
                <div className='login_title_1'>Login to your account</div>
                <div className='login_title_2'>Welcome back, please enter your details</div>
                <input type="text" placeholder='Username' className="username" name="username" />
                <input type="password" placeholder='Password' className="password" name="password" />
                <Link to="../admin/panels" > <div className='login_btn' >   <LoginIcon /> <span>Login</span>  </div>  </Link>
            </div>
        </>
    )
}

export default Login