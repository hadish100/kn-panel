import React, { useState } from 'react'
import axios from 'axios'

import Modal from "../Modal";
import LeadingIcon from "../LeadingIcon";
import Button from "../Button";
import { ReactComponent as PanelIcon } from "../../assets/svg/panel.svg";
import { ReactComponent as XMarkIcon } from "../../assets/svg/x-mark.svg";
import { motion } from "framer-motion"
import ErrorCard from '../../components/ErrorCard';
import FormField from '../form/FormField';
import "../agent/CreateUserForm.css"


const PanelForm = ({ onClose }) => {
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
            onClose()
        }

    }


    return (
        <Modal onClose={onClose} >
            <header className="modal__header">
                <LeadingIcon>
                    <PanelIcon />
                </LeadingIcon>
                <h1 className="modal__title">Add new panel</h1>
                <div className="close-icon" onClick={onClose}>
                    <XMarkIcon />
                </div>
            </header>
            <main className="modal__body">
                <form className="modal__form">
                    <FormField label="Name" type="text" id="name" name="name" animateDelay={0} />
                    <FormField label="Username" type="text" id="username" name="usermame" animateDelay={0.1} />
                    <FormField label="Password" type="text" id="password" name="password" animateDelay={0.2} />
                    <FormField label="Panel Url" type="text" id="panel_url" name="panel_url" animateDelay={0.3} />
                    <FormField label="Capacity" type="number" id="capacity" name="capacity" animateDelay={0.4} />
                    <FormField label="Traffic" type="number" id="traffic" name="traffic" animateDelay={0.5} />
                    <FormField label="Country" type="text" id="country" name="country" animateDelay={0.6} />
                </form>
            </main>
            <motion.footer className="modal__footer" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <Button className={"transparent outlined"} onClick={onClose}>Cancel</Button>
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
            {errorCard}
        </Modal>
    )
}

export default PanelForm