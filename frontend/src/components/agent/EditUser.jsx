import React from 'react'
import axios from 'axios'

import { ReactComponent as EditIcon } from '../../assets/svg/edit.svg'
import { ReactComponent as DeleteIcon } from "../../assets/svg/delete.svg"
import { ReactComponent as PowerIcon } from "../../assets/svg/power.svg"
import Form from '../form/Form'

const EditUser = ({ onClose, showForm, onDeleteItem, item, onEditItem, onPowerItem }) => {

    const formFields = [
        { label: "Username", type: "text", id: "username", name: "username", disabled: true },
        { label: "Data Limit", type: "number", id: "data_limit", name: "data_limit" },
        { label: "Days To Expire", type: "number", id: "expire", name: "expire" },
    ]

    const primaryButtons = [
        { label: "Cancel", className: "outlined", onClick: onClose },
        { label: "Edit User", className: "primary", onClick: () => onEditItem(
            item.id,
            document.getElementById("data_limit").value,
            document.getElementById("expire").value,
            "HI"
        ) },
    ]

    const secondaryButtons = [
        { icon: <DeleteIcon />, label: "Delete", className: "ghosted", onClick: (e) => onDeleteItem(e, item.username) },
        { icon: <PowerIcon />, label: "Power", className: "ghosted", onClick:(e) => onPowerItem(e,item.id,item.status) },
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