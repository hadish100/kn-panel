import React, { useState, useRef } from 'react'
import axios from 'axios';

import { ReactComponent as AddUserIcon } from "../../assets/svg/add-user.svg";
import ErrorCard from '../ErrorCard';
import { AnimatePresence, motion } from 'framer-motion'
import Modal from '../Modal';
import LeadingIcon from '../LeadingIcon';
import { ReactComponent as XMarkIcon } from '../../assets/svg/x-mark.svg';
import FormField from '../form/FormField';
import Button from '../Button';

const CreateAgent = ({ onClose, showForm }) => {
    const [hasError, setHasError] = useState(false)
    const [error_msg, setError_msg] = useState("failed to create agent");
    const businessModeRef = useRef(null);

    const access_token = sessionStorage.getItem("access_token");

    const createAgentOnServer = async (
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

        if (res.data.status === "ERR") {
            setError_msg(res.data.msg || "Failed to create agent (BAD REQUEST)")
            setHasError(true)
        } else {
            var agents = (await axios.post("/get_agents", { access_token })).data;
            sessionStorage.setItem("agents", JSON.stringify(agents));
            onClose()
        }
    }

    const handleSubmitForm = () => {
        // Gather form data
        const name = document.getElementById("name").value;
        const username = document.getElementById("userName").value;
        const password = document.getElementById("password").value;
        const volume = document.getElementById("volume").value;
        const min_vol = document.getElementById("min_vol").value;
        const max_users = document.getElementById("max_users").value;
        const max_days = document.getElementById("max_days").value;
        const prefix = document.getElementById("prefix").value;
        const country = document.querySelectorAll(".MuiSelect-nativeInput")[0].value;
        const max_non_active_days = document.getElementById("max_non_active_days").value
        const businessModeValue = businessModeRef.current.checked
        // Send form data to backend
        createAgentOnServer(name, username, password, volume, min_vol, max_users, max_days, prefix, country)
    }

    const formFields = [
        { label: "Name", type: "text", id: "name", name: "name" },
        { label: "Username", type: "text", id: "username", name: "username" },
        { label: "Password", type: "text", id: "password", name: "password" },
        [
            { label: "Volume", type: "value-adjuster", id: "volume", name: "volume" },
            { label: "Minimum Volume", type: "number", id: "min_vol", name: "min_vol" },
        ],
        [
            { label: "Maximum Users", type: "number", id: "max_users", name: "max_users" },
            { label: "MaxDays", type: "number", id: "max_days", name: "maxDays" },
        ],
        [
            { label: "Max non-active days", type: "number", id: "max_non_active_days", name: "max_non_active_days" },
            { label: "Prefix", type: "text", id: "prefix", name: "prefix" },
        ],
        { label: "Country", type: "multi-select", id: "country", name: "country" },
    ]

    const primaryButtons = [
        { label: "Cancel", className: "outlined", onClick: onClose },
        { label: "Create Agent", className: "primary", onClick: handleSubmitForm },
    ]

    const formHeader = (
        <header className="modal__header">
            <LeadingIcon><AddUserIcon /></LeadingIcon>
            <h1 className="modal__title">Edit agent</h1>
            <div className="close-icon" onClick={onClose}>
                <XMarkIcon />
            </div>
        </header>
    )


    const formFooter = (
        <motion.footer className="modal__footer justify-end" style={{ paddingTop: "1rem" }} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                {primaryButtons.map((button, index) => (
                    <Button
                        key={index}
                        className={button.className}
                        onClick={button.onClick}
                    >
                        {button.label}
                    </Button>
                ))}
            </div>
        </motion.footer>
    )

    return (
        <>
            <AnimatePresence>
                {showForm && (
                    <Modal onClose={onClose} width={"40rem"}>
                        {formHeader}
                        <main className="modal__body" style={{ marginBottom: ".5rem" }}>
                            <form className="modal__form">
                                {formFields.map((group, rowIndex) => (
                                    <div key={rowIndex} className="flex gap-16">
                                        {Array.isArray(group) ? group.map((field, index) => {
                                            return (<FormField
                                                key={index}
                                                label={field.label}
                                                type={field.type}
                                                id={field.id}
                                                name={field.name}
                                                animateDelay={rowIndex * 0.1}
                                                disabled={field.disabled}
                                                options={field.options}
                                                value={field.value}
                                                onChange={field.onChange}
                                                placeholder={field.placeholder}
                                            />);
                                        }) : (
                                            <FormField
                                                key={rowIndex}
                                                label={group.label}
                                                type={group.type}
                                                id={group.id}
                                                name={group.name}
                                                animateDelay={rowIndex * 0.1}
                                                disabled={group.disabled}
                                                options={group.options}
                                                value={group.value}
                                                onChange={group.onChange}
                                                placeholder={group.placeholder}
                                            />
                                        )}
                                    </div>
                                ))}
                            </form>
                        </main>
                        <div className='flex gap-1.5' style={{ marginTop: "1rem" }}>
                            <input ref={businessModeRef} type="checkbox" id="business-mode" name="business-mode" defaultChecked={false} value={false} />
                            <label htmlFor="business-mode">Business Mode</label>
                        </div>
                        {formFooter}
                    </Modal>
                )}
            </AnimatePresence>
            <ErrorCard
                hasError={hasError}
                setHasError={setHasError}
                errorTitle="ERROR"
                errorMessage={error_msg}
            />
        </>
    )
}

export default CreateAgent