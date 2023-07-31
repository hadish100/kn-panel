import React, { useState } from 'react'
import axios from "axios";

import { ReactComponent as AddUserIcon } from "../../assets/svg/add-user.svg";
import ErrorCard from '../ErrorCard';
import Form from '../form/Form';
import "./CreateUser.css"

const CreateUser = ({ onClose, showForm }) => {
    const [hasError, setHasError] = useState(false)
    const [error_msg, setError_msg] = useState("failed to create user");
    const access_token = sessionStorage.getItem("access_token");
    const createUserOnServer = async (
        username, data_limit, expire, country
    ) => {
        var res = await axios.post("/create_user", { username, expire, data_limit, country, access_token });

        if (res.data.status === "ERR") {
            setError_msg(res.data.msg || "Failed to create user (BAD REQUEST)")
            setHasError(true)
        } else {
            var users = (await axios.post("/get_users", { access_token })).data;
            sessionStorage.setItem("users", JSON.stringify(users));
            onClose()
        }
    }

    const handleSubmitForm = () => {
        // Gather form data
        const username = document.getElementById("username").value;
        const data_limit = document.getElementById("dataLimit").value;
        const expire = document.getElementById("daysToExpire").value;
        const country = "HI";
        // Send form data to backend
        createUserOnServer(username, data_limit, expire, country)
    }

    const formFields = [
        { label: "Username", type: "text", id: "username", name: "username" },
        { label: "Data Limit", type: "number", id: "dataLimit", name: "dataLimit" },
        { label: "Days To Expire", type: "number", id: "daysToExpire", name: "daysToExpire" }
    ]

    const primaryButtons = [
        { label: "Cancel", className: "outlined", onClick: onClose },
        { label: "Create User", className: "primary", onClick: handleSubmitForm }
    ]

    return (
        <>
            <Form
                onClose={onClose}
                title="Create new user"
                iconComponent={<AddUserIcon />}
                formFields={formFields}
                primaryButtons={primaryButtons}
                showForm={showForm}
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

export default CreateUser