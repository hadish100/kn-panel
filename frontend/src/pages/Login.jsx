import React, { useState } from 'react'
import './Login.css'
import { ReactComponent as LoginIcon } from "../assets/svg/login.svg"
import { ReactComponent as Logo } from "../assets/svg/logo.svg"
import { ReactComponent as RefreshIcon } from "../assets/svg/refresh.svg"
import LogoIcon from "../assets/logo.png"
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button'
import axios from "axios"
import ErrorCard from '../components/ErrorCard';
import OkCard from '../components/OkCard';


var error_message = "Please check your username and password";
var ok_message = "Login successful , retrieving data";


const Login = ({ setIsLoggedIn, setLocation }) => {
    const [hasError, setHasError] = useState(false)
    const [hasOk, setHasOk] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const navigate = useNavigate();

    const send_login_data = async (e) => {
        e.preventDefault();
        setIsLoading(true)
        document.querySelectorAll(".login__btn")[0].disabled = true;
        document.querySelectorAll(".login__btn")[0].classList.add("login__btn__clicked");
        var username = e.target[0].value
        var password = e.target[1].value
        var res;

        try {
            
            res = await axios.post("/login", { username, password }, { timeout: 20000 });
            setHasOk(true);
        }

        catch (err) {
            if(err.response.status == 401) error_message = "Please check your username and password";
            else error_message = "server is not responding";
            res = {};
            res.data = "ERR";
        }


        if (res.data === "ERR") {
            setHasError(true)
            document.querySelectorAll(".login__btn")[0].disabled = false;
            document.querySelectorAll(".login__btn")[0].classList.remove("login__btn__clicked");
        }


        else {
            var access_token = res.data.access_token;

            if (res.data.is_admin) {
                setIsLoggedIn(true)
                sessionStorage.setItem("isLoggedIn", "true")
                sessionStorage.setItem("access_token", res.data.access_token)

                try {
                    var agents = (await axios.post("/get_agents", { access_token }, { timeout: 20000 })).data;
                    var panels = (await axios.post("/get_panels", { access_token }, { timeout: 20000 })).data;
                    sessionStorage.setItem("agents", JSON.stringify(agents));
                    sessionStorage.setItem("panels", JSON.stringify(panels));
                    setLocation("/admin/panels");
                    navigate('/admin/panels');
                }

                catch (err) {
                    error_message = "server is not responding";
                    setHasError(true)
                    document.querySelectorAll(".login__btn")[0].disabled = false;
                    document.querySelectorAll(".login__btn")[0].classList.remove("login__btn__clicked");
                }
            } 

            else {
                setIsLoggedIn(true)
                sessionStorage.setItem("isLoggedIn", "true");
                sessionStorage.setItem("access_token", res.data.access_token)

                try {
                    //var users = (await axios.post("/get_users", { access_token }, { timeout: 20000 })).data;
                    var agent = (await axios.post("/get_agent", { access_token }, { timeout: 20000 })).data;
                    //sessionStorage.setItem("users", JSON.stringify(users.obj_arr));
                    sessionStorage.setItem("agent", JSON.stringify(agent));
                    setLocation("/agent/users");
                    navigate('/agent/users');
                }

                catch (err) {
                    error_message = "server is not responding";
                    setHasError(true)
                    document.querySelectorAll(".login__btn")[0].disabled = false;
                    document.querySelectorAll(".login__btn")[0].classList.remove("login__btn__clicked");
                }
            }
        }

        setIsLoading(false)
    }

    var errorCard = (
        <ErrorCard
            hasError={hasError}
            setHasError={setHasError}
            errorTitle="Login Failed"
            errorMessage={error_message}
        />
    )
 

    var okCard = (
        <OkCard
            hasError={hasOk}
            setHasError={setHasOk}
            errorTitle="WELCOME"
            errorMessage={ok_message}
        />
    )

    return (
        <div className='login'>
            <img src={LogoIcon} alt="logo" className="login__logo" />
            <h1 className='login__title'>Login to your account</h1>
            <h2 className='login__subtitle'>Welcome back, please enter your details</h2>
            <form className='login__form' action="" onSubmit={send_login_data}>
                <input type="text" placeholder='Username' className="username" name="username" />
                <input type="password" placeholder='Password' className="password" name="password" />
                <Button className={`primary login__btn ${isLoading ? 'spin' : ''}`} disabled={isLoading} >
                    {isLoading ? <RefreshIcon /> : <LoginIcon />}
                    {isLoading ? 'Logging in...' : 'Login'}
                </Button>
            </form>
            {errorCard}
            {okCard}
        </div>
    )
}

export default Login