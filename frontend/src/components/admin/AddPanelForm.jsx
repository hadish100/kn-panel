import React,{ useState } from 'react'

import Modal from "../Modal";
import LeadingIcon from "../LeadingIcon";
import Button from "../Button";
import { ReactComponent as PanelIcon } from "../../assets/svg/panel.svg";
import { ReactComponent as XMarkIcon } from "../../assets/svg/x-mark.svg";
import { motion } from "framer-motion"
import "../agent/CreateUserForm.css"
import axios from 'axios'
import ErrorCard from '../../components/ErrorCard';


const PanelForm = ({ handleClose }) => {
    const [hasError, setHasError] = useState(false)

    const errorCard = (
        <ErrorCard
            hasError={hasError}
            setHasError={setHasError}
            errorTitle="ERROR"
            errorMessage="failed to create panel"
        />
    )
    const access_token = sessionStorage.getItem("access_token");

    const handleSubmit = async (
        panel_name,
        panel_url,
        panel_username,
        panel_password,
        panel_country,
        panel_user_max_count,
        panel_user_max_date,
        panel_traffic

    ) => {
        var res = await axios.post("/create_panel", { panel_name, panel_url, panel_username, panel_password, panel_country, panel_user_max_count, panel_user_max_date, panel_traffic, access_token });

        if (res.data === "ERR") {
            setHasError(true)
        }

        else {
            var panels = (await axios.post("/get_panels", { access_token })).data;
            sessionStorage.setItem("panels", JSON.stringify(panels));
            handleClose()
        }
        
    }


    return (
        <Modal onClose={handleClose} >
            <header className="modal__header">
                <LeadingIcon>
                    <PanelIcon />
                </LeadingIcon>
                <h1 className="modal__title">Add new panel</h1>
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

                    <motion.div className="modal__form__group" animate={{ x: 0, opacity: 1 }} initial={{ x: -40, opacity: 0 }} transition={{ delay: 0.3 }}>
                        <label className="modal__form__label" htmlFor="panel_url">Panel Url</label>
                        <input className="modal__form__input" type="text" id="panel_url" name="panel_url" />
                    </motion.div>

                    <motion.div className="modal__form__group" animate={{ x: 0, opacity: 1 }} initial={{ x: -40, opacity: 0 }} transition={{ delay: 0.4 }}>
                        <label className="modal__form__label" htmlFor="capacity">Capacity</label>
                        <input className="modal__form__input" type="number" id="capacity" name="capacity" />
                    </motion.div>

                    <motion.div className="modal__form__group" animate={{ x: 0, opacity: 1 }} initial={{ x: -40, opacity: 0 }} transition={{ delay: 0.5 }}>
                        <label className="modal__form__label" htmlFor="traffic">Traffic</label>
                        <input className="modal__form__input" type="number" id="traffic" name="traffic" />
                    </motion.div>

                    <motion.div className="modal__form__group" animate={{ x: 0, opacity: 1 }} initial={{ x: -40, opacity: 0 }} transition={{ delay: 0.6 }}>
                        <label className="modal__form__label" htmlFor="country">Country</label>
                        <input className="modal__form__input" type="text" id="country" name="country" />
                    </motion.div>
                </form>
            </main>
            <motion.footer className="modal__footer" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <Button className={"transparent outlined"} onClick={handleClose}>Cancel</Button>
                <Button className={"primary"}
                    onClick={() => handleSubmit(
                        document.getElementById("name").value,
                        document.getElementById("panel_url").value,
                        document.getElementById("userName").value,
                        document.getElementById("password").value,
                        document.getElementById("country").value,
                        document.getElementById("capacity").value,
                        30,
                        document.getElementById("traffic").value
                    )}
                >
                    Add Panel</Button>
            </motion.footer>
        </Modal>
    )
}

export default PanelForm