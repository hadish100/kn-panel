import React, { useState } from 'react'
import axios from 'axios'

import { ReactComponent as PanelIcon } from "../../assets/svg/panel.svg";
import ErrorCard from '../ErrorCard';
import Form from "../form/Form"
import "../agent/CreateUser.css"


const CreatePanel = ({ onClose }) => {
    const [hasError, setHasError] = useState(false)
    const [error_msg, setError_msg] = useState("Failed to create panel")

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

        if (res.data.status === "ERR") {
            setError_msg(res.data.msg || "Failed to create panel (BAD REQUEST)")
            setHasError(true)
        } else {
            const panels = (await axios.post("/get_panels", { access_token })).data;
            sessionStorage.setItem("panels", JSON.stringify(panels));
            onClose()
        }
    }

    const handleSubmitForm = () => {
        // Gather form data
        const panel_name = document.getElementById("panel_name").value;
        const panel_url = document.getElementById("panel_url").value;
        const panel_username = document.getElementById("panel_username").value;
        const panel_password = document.getElementById("panel_password").value;
        const panel_country = document.getElementById("country").value;
        const panel_user_max_count = document.getElementById("panel_user_max_count").value;
        const panel_user_max_date = document.getElementById("panel_user_max_date").value;
        const panel_traffic = document.getElementById("panel_traffic").value;
        // Send form data to backend
        createPanelOnServer(panel_name, panel_url, panel_username, panel_password, panel_country, panel_user_max_count, panel_user_max_date, panel_traffic)
    }

    const formFields = [
        { label: "Name", type: "text", id: "panel_name", name: "name" },
        { label: "Username", type: "text", id: "panel_username", name: "username" },
        { label: "Password", type: "text", id: "panel_password", name: "password" },
        { label: "Panel Url", type: "text", id: "panel_url", name: "panel_url" },
        { label: "Capacity", type: "number", id: "panel_user_max_count", name: "capacity" },
        { label: "User Max Days", type: "number", id: "panel_user_max_date", name: "panel_user_max_date" },
        { label: "Traffic", type: "number", id: "panel_traffic", name: "traffic" },
        { label: "Country", type: "number", id: "country", name: "country" },
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
                title="Create new panel"
                iconComponent={<PanelIcon />}
                primaryButtons={primaryButtons}
                formFields={formFields}
            />
            <ErrorCard
                hasError={hasError}
                setHasError={setHasError}
                errorTitle="ERROR"
                errorMessage={error_msg}
            />
        </>
    )
}

export default CreatePanel