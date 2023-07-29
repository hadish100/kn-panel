import React, { useState } from 'react'
import axios from 'axios';

import { ReactComponent as AddUserIcon } from "../../assets/svg/add-user.svg";
import ErrorCard from '../ErrorCard';
import Form from '../form/Form';

const CreateAgent = ({ onClose }) => {
    const [hasError, setHasError] = useState(false)
    const [error_msg, setError_msg] = useState("failed to create agent");


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
        const max_days = document.getElementById("maxDays").value;
        const prefix = document.getElementById("prefix").value;
        const country = document.getElementById("country").value;
        // Send form data to backend
        createAgentOnServer(name, username, password, volume, min_vol, max_users, max_days, prefix, country)
    }

    const formFields = [
        { label: "Name", type: "text", id: "name", name: "name" },
        { label: "Username", type: "text", id: "userName", name: "userName" },
        { label: "Password", type: "text", id: "password", name: "password" },
        [
            { label: "Volume", type: "number", id: "volume", name: "volume" },
            { label: "Minimum Volume", type: "number", id: "min_vol", name: "min_vol" },
        ],
        [
            { label: "Maximum Users", type: "number", id: "max_users", name: "max_users" },
            { label: "MaxDays", type: "number", id: "maxDays", name: "maxDays" },
        ],
        [
            { label: "Prefix", type: "text", id: "prefix", name: "prefix" },
            { label: "Country", type: "text", id: "country", name: "country" }
        ]
    ]

    const primaryButtons = [
        { label: "Cancel", className: "outlined", onClick: onClose },
        { label: "Create Agent", className: "primary", onClick: handleSubmitForm },
    ]

    return (
        <>
            <Form
                onClose={onClose}
                showForm={true}
                title="Create Agent"
                iconComponent={<AddUserIcon />}
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

export default CreateAgent