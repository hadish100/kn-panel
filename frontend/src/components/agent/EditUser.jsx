import React from 'react'
import axios from 'axios'

import { ReactComponent as EditIcon } from '../../assets/svg/edit.svg'
import { ReactComponent as DeleteIcon } from "../../assets/svg/delete.svg"
import { ReactComponent as PowerIcon } from "../../assets/svg/power.svg"
import Form from '../form/Form'

const EditUser = ({ onClose, showForm, onDeleteItem, item }) => {
    async function power_user(e, panel_id) {
        e.stopPropagation();
        const access_token = sessionStorage.getItem("access_token");
        var disable_panel = (await axios.post("/disable_panel", { access_token, panel_id })).data;
        var panels = (await axios.post("/get_panels", { access_token })).data;
        sessionStorage.setItem("panels", JSON.stringify(panels));
    }

    const formFields = [
        { label: "Username", type: "text", id: "username", name: "username", disabled: true },
        { label: "Data Limit", type: "number", id: "data_limit", name: "data_limit" },
        { label: "Days To Expire", type: "number", id: "expire", name: "expire" },
    ]

    const primaryButtons = [
        { label: "Cancel", className: "outlined", onClick: onClose },
        { label: "Edit User", className: "primary", onClick: onClose },
    ]

    const secondaryButtons = [
        { icon: <DeleteIcon />, label: "Delete", className: "ghosted", onClick: (e) => onDeleteItem(e, item.temp_id) },
        { icon: <PowerIcon />, label: "Power", className: "ghosted", onClick: power_user },
    ]

    return (
        <Form
            title="Edit User"
            onClose={onClose}
            showForm={showForm}
            iconComponent={<EditIcon />}
            primaryButtons={primaryButtons}
            secondaryButtons={secondaryButtons}
            formFields={formFields}
            item={item}
        />
    )
}

export default EditUser