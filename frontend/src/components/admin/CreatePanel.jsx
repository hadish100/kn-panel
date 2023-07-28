import React, { useState } from 'react'
import axios from 'axios'

import { ReactComponent as PanelIcon } from "../../assets/svg/panel.svg";
import ErrorCard from '../ErrorCard';
import Form from "../form/Form"
import "../agent/CreateUserForm.css"


const CreatePanel = ({ onClose }) => {
    const [hasError, setHasError] = useState(false)

    const access_token = sessionStorage.getItem("access_token");

    const createPanelOnServer = async (
        panel_name,
        panel_url,
        panel_username,
        panel_password,
        panel_country,
        panel_user_max_count,
        panel_user_max_date,
        panel_traffic
    ) => {
        const res = await axios.post("/create_panel", { panel_name, panel_url, panel_username, panel_password, panel_country, panel_user_max_count, panel_user_max_date, panel_traffic, access_token });

        if (res.data === "ERR") {
            setHasError(true)
        } else {
            const panels = (await axios.post("/get_panels", { access_token })).data;
            sessionStorage.setItem("panels", JSON.stringify(panels));
            onClose()
        }
    }

    const handleSubmitForm = () => {
        // Gather form data
        const panel_name = document.getElementById("name").value;
        const panel_url = document.getElementById("panel_url").value;
        const panel_username = document.getElementById("username").value;
        const panel_password = document.getElementById("password").value;
        const panel_country = document.getElementById("country").value;
        const panel_user_max_count = document.getElementById("capacity").value;
        const panel_traffic = document.getElementById("traffic").value;
        // Send form data to backend
        createPanelOnServer(panel_name, panel_url, panel_username, panel_password, panel_country, panel_user_max_count, 30, panel_traffic)
    }

    const formFields = [
        { label: "Name", type: "text", id: "panel_name", name: "name" },
        { label: "Username", type: "text", id: "panel_username", name: "username" },
        { label: "Password", type: "text", id: "panel_password", name: "password" },
        { label: "Panel Url", type: "text", id: "panel_url", name: "panel_url" },
        { label: "Capacity", type: "number", id: "panel_user_max_count", name: "capacity" },
        { label: "Traffic", type: "number", id: "panel_traffic", name: "traffic" },
        { label: "Country", type: "text", id: "country", name: "country" }
    ]

    const primaryButtons = [
        { label: "Cancel", className: "outlined", onClick: onClose },
        { label: "Create Panel", className: "primary", onClick: handleSubmitForm },
    ]

    return (
        <>
            <Form
                onClose={onClose}
                showForm={true}
                title="Create Panel"
                iconComponent={<PanelIcon />}
                primaryButtons={primaryButtons}
                formFields={formFields}
            />
            <ErrorCard
                hasError={hasError}
                setHasError={setHasError}
                errorTitle="ERROR"
                errorMessage="Failed to create panel"
            />
        </>
    )
}

export default CreatePanel