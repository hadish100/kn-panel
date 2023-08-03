import React from 'react'

import { ReactComponent as EditIcon } from '../../assets/svg/edit.svg'
import { ReactComponent as DeleteIcon } from "../../assets/svg/delete.svg"
import { ReactComponent as PowerIcon } from "../../assets/svg/power.svg"
import Form from '../form/Form'

const EditPanel = ({ onClose, showForm, onDeleteItem, item, onPowerItem, onEditItem }) => {

    const formFields = [
        { label: "Name", type: "text", id: "panel_name", name: "name" },
        { label: "Username", type: "text", id: "panel_username", name: "username" },
        { label: "Password", type: "text", id: "panel_password", name: "password" },
        { label: "Panel Url", type: "text", id: "panel_url", name: "panel_url", disabled: true },
        { label: "Capacity", type: "number", id: "panel_user_max_count", name: "capacity" },
        { label: "Traffic", type: "number", id: "panel_traffic", name: "traffic" },
        { label: "Country", type: "text", id: "panel_country", name: "country", disabled: true }
    ]

    const primaryButtons = [
        { label: "Cancel", className: "outlined", onClick: onClose },
        {
            label: "Edit Panel", className: "primary", onClick: () => onEditItem(
                item.id,
                document.getElementById("panel_name").value,
                document.getElementById("panel_username").value,
                document.getElementById("panel_password").value,
                document.getElementById("panel_url").value,
                document.getElementById("panel_user_max_count").value,
                document.getElementById("panel_traffic").value,
                document.getElementById("panel_country").value
            )
        },
    ]

    const secondaryButtons = [
        { icon: <DeleteIcon />, type: "button", label: "Delete", className: "ghosted", onClick: (e) => onDeleteItem(e, item.id) },
        { type: "switch", label: "Power", className: "ghosted", onClick: () => onPowerItem(item.id, item.disable) },
    ]

    return (
        <Form
            onClose={onClose}
            showForm={showForm}
            title="Edit panel"
            iconComponent={<EditIcon />}
            primaryButtons={primaryButtons}
            secondaryButtons={secondaryButtons}
            formFields={formFields}
            item={item}
        />
    )
}

export default EditPanel