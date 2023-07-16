import React from 'react'
import './Login.css'
import { ReactComponent as LoginIcon } from "../assets/login.svg"
import { ReactComponent as Logo } from "../assets/logo.svg"
import Button from '../components/Button'

const Login = () => {
    return (
        <div className='login'>
            <Logo />
            <div className='login_title_1'>Login to your account</div>
            <div className='login_title_2'>Welcome back, please enter your details</div>
            <input type="text" placeholder='Username' className="username" name="username" />
            <input type="password" placeholder='Password' className="password" name="password" />
            <Button className="primary login__btn">
                <LoginIcon />
                <span>Login</span>
            </Button>
            {/* <Link to="../admin/panels" >
                <div className='login_btn' >
                    <LoginIcon />
                   
                </div>
            </Link> */}
        </div>
    )
}

export default Login