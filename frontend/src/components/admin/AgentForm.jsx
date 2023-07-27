import React,{ useState } from 'react'

import Modal from "../Modal";
import LeadingIcon from "../LeadingIcon";
import Button from "../Button";
import { ReactComponent as AddUserIcon } from "../../assets/svg/add-user.svg";
import { ReactComponent as XMarkIcon } from "../../assets/svg/x-mark.svg";
import { motion } from "framer-motion"
import "../agent/CreateUserForm.css"
import axios from 'axios';
import ErrorCard from '../../components/ErrorCard';

const CreateUserForm = ({ handleClose }) => {
    const [hasError, setHasError] = useState(false)

    const errorCard = (
        <ErrorCard
            hasError={hasError}
            setHasError={setHasError}
            errorTitle="ERROR"
            errorMessage="failed to create agent"
        />
    )
    const access_token = sessionStorage.getItem("access_token");



    const handleSubmit = async (
        name,
        username,
        password,
        volume,
        min_vol,
        max_users,
        max_days,
        prefix,
        country
    ) => {
        var res = await axios.post("/create_agent", { name, username, password, volume, min_vol, max_users, max_days, prefix, country, access_token });

        if (res.data === "ERR") {
            setHasError(true)
        }

        else {
            var agents = (await axios.post("/get_agents", { access_token })).data;
            sessionStorage.setItem("agents",JSON.stringify(agents));
            handleClose()
        }
        
    }

    return (
        <Modal onClose={handleClose} >
            <header className="modal__header">
                <LeadingIcon>
                    <AddUserIcon />
                </LeadingIcon>
                <h1 className="modal__title">Create new agent</h1>
                <div className="close-icon" onClick={handleClose}>
                    <XMarkIcon />
                </div>
            </header>
            <main className="modal__body">
                <form className="modal__form">
                    <motion.div className="modal__form__group" animate={{ x: 0, opacity: 1 }} initial={{ x: -40, opacity: 0 }}>
                        <label className="modal__form__label" htmlFor="name">Name</label>
                        <input className="modal__form__input" type="text" id="name" name="name" />
                    </motion.div>

                    <motion.div className="modal__form__group" animate={{ x: 0, opacity: 1 }} initial={{ x: -40, opacity: 0 }} transition={{ delay: 0.1 }}>
                        <label className="modal__form__label" htmlFor="userName">UserName</label>
                        <input className="modal__form__input" type="text" id="userName" name="userName" />
                    </motion.div>

                    <motion.div className="modal__form__group" animate={{ x: 0, opacity: 1 }} initial={{ x: -40, opacity: 0 }} transition={{ delay: 0.2 }}>
                        <label className="modal__form__label" htmlFor="password">Password</label>
                        <input className="modal__form__input" type="text" id="password" name="password" />
                    </motion.div>


                    <motion.div className="flex gap-16" animate={{ x: 0, opacity: 1 }} initial={{ x: -40, opacity: 0 }} transition={{ delay: 0.3 }}>
                        <div className="modal__form__group" >
                            <label className="modal__form__label" htmlFor="volume">Volume</label>
                            <input className="modal__form__input" type="number" id="volume" name="volume" />
                        </div>

                        <div className="modal__form__group">
                            <label className="modal__form__label" htmlFor="min_vol">Minimum Volume</label>
                            <input className="modal__form__input" type="number" id="min_vol" name="min_vol" />
                        </div>
                    </motion.div>

                    <motion.div className="flex gap-16" animate={{ x: 0, opacity: 1 }} initial={{ x: -40, opacity: 0 }} transition={{ delay: 0.4 }}>
                        <div className="modal__form__group" >
                            <label className="modal__form__label" htmlFor="max_users">Maximum Users</label>
                            <input className="modal__form__input" type="number" id="max_users" name="max_users" />
                        </div>

                        <div className="modal__form__group">
                            <label className="modal__form__label" htmlFor="maxDays">MaxDays</label>
                            <input className="modal__form__input" type="number" id="maxDays" name="maxDays" />
                        </div>
                    </motion.div>

                    <motion.div className="flex gap-16" animate={{ x: 0, opacity: 1 }} initial={{ x: -40, opacity: 0 }} transition={{ delay: 0.5 }}>
                        <div className="modal__form__group">
                            <label className="modal__form__label" htmlFor="prefix">Prefix</label>
                            <input className="modal__form__input" type="text" id="prefix" name="prefix" />
                        </div>

                        <div className="modal__form__group">
                            <label className="modal__form__label" htmlFor="country">Country</label>
                            <input className="modal__form__input" type="text" id="country" name="country" />
                        </div>
                    </motion.div>

                </form>
            </main>
            <motion.footer className="modal__footer" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>

                <Button className="outlined" onClick={handleClose}>Cancel</Button>
                <Button
                    className="primary"
                    onClick={() => handleSubmit(
                        document.getElementById("name").value,
                        document.getElementById("userName").value,
                        document.getElementById("password").value,
                        document.getElementById("volume").value,
                        document.getElementById("min_vol").value,
                        document.getElementById("max_users").value,
                        document.getElementById("maxDays").value,
                        document.getElementById("prefix").value,
                        document.getElementById("country").value
                    )}
                >
                    Add Agent
                </Button>

            </motion.footer>
            {errorCard}
        </Modal>
    )
}

export default CreateUserForm