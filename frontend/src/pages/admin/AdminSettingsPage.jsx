import React, {useState} from 'react'
import Button from '../../components/Button'
import "./AdminSettingsPage.css"
import ErrorCard from '../../components/ErrorCard';
import OkCard from '../../components/OkCard';
import axios from 'axios';


const AdminSettingsPage = () => {
    const [error_msg, setError_msg] = useState("Passwords dont match")
    const [hasError, setHasError] = useState(false)
    const [ok_msg, setOk_msg] = useState("Credentials changed")
    const [hasOk, setHasOk] = useState(false)

    const changeCrendtials = async (e) =>
    {
        e.preventDefault();
        const username = document.getElementById("username").value;
        const password = document.getElementById("password").value;
        const password2 = document.getElementById("password2").value;

        if (password !== password2)
        {
            setError_msg("Passwords dont match")
            setHasError(true)
            return
        }

        else
        {
            setHasOk(true)
            const access_token = localStorage.getItem("access_token")
            //await axios.post("/change_credentials", {username, password, access_token})

        }
    }


    return (
        <form autoComplete='off' className="settings-page">
            <div className="modal__form__group">
                <label className="modal__form__label" htmlFor="username">Username</label>
                <input autoComplete='new-username' className="modal__form__input" type="text" id="username" name="username" />
            </div>
            <div className="flex gap-16">
                <div className="modal__form__group">
                    <label className="modal__form__label" htmlFor="password">New Password</label>
                    <input autoComplete='new-password' className="modal__form__input" type="password" id="password" name="password" />
                </div>
                <div className="modal__form__group">
                    <label className="modal__form__label" htmlFor="password">Repeat New Password</label>
                    <input autoComplete='new-password' className="modal__form__input" type="password" id="password2" name="password" />
                </div>
            </div>
            <footer className="settings-page__footer">
                <Button onClick={(e) => changeCrendtials(e)} className="primary">Save</Button>
            </footer>
            <ErrorCard
                hasError={hasError}
                setHasError={setHasError}
                errorTitle="ERROR"
                errorMessage={error_msg}
            />

            <OkCard
                hasError={hasOk}
                setHasError={setHasOk}
                errorTitle="DONE"
                errorMessage={ok_msg}
            />
        </form>
    )
}

export default AdminSettingsPage