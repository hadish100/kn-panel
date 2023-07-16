import React from 'react'

import './Login.css'
import { ReactComponent as LoginIcon } from "../assets/login.svg"
import { ReactComponent as Logo } from "../assets/logo.svg"
import Button from '../components/Button'

const Login = () => {
    return (
        <div className='login'>
            <Logo />
            <h1 className='login__title'>Login to you account</h1>
            <h2 className='login__subtitle'>Welcome back, please enter your details</h2>
            <form className='login__form' action="">
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