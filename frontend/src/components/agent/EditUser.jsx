import React from 'react'
import axios from 'axios'

import { ReactComponent as EditIcon } from '../../assets/svg/edit.svg'
import { ReactComponent as DeleteIcon } from "../../assets/svg/delete.svg"
import { ReactComponent as PowerIcon } from "../../assets/svg/power.svg"
import { ReactComponent as RefreshIcon } from '../../assets/svg/refresh.svg'
import Form from '../form/Form'
import styles from "./EditUser.module.css"

const EditUser = ({ onClose, showForm, onDeleteItem, item, onEditItem, onPowerItem, onResetItem, editMode }) => {

    const formFields = [
        { label: "Username", type: "text", id: "username", name: "username", disabled: true },
        { label: "Data Limit", type: "number", id: "data_limit", name: "data_limit" },
        { label: "Days To Expire", type: "number", id: "expire", name: "expire" },
        { label: "Country", type: "text", id: "country", name: "country", disabled: true }
    ]

    const primaryButtons = [
        { label: "Cancel", className: "outlined", onClick: onClose },
        {
            label: "Edit User", className: "primary", onClick: () => onEditItem(
                item.id,
                document.getElementById("data_limit").value,
                document.getElementById("expire").value,
                document.getElementById("country").value,
            ),
            disabled: editMode,
            pendingText: "Editing..."
        },
    ]

    const secondaryButtons = [
        { icon: <DeleteIcon />, type: "button", label: "Delete", className: "ghosted", onClick: (e) => onDeleteItem(e, item.username) },
        { icon: <RefreshIcon />, type: "button", label: "Reset Usage", className: "ghosted", onClick: () => onResetItem(item.id) },
        { icon: <PowerIcon />, type: "switch", label: "Power", className: "ghosted", onClick: (e) => onPowerItem(e, item.id, item.status) },
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
            width={"40rem"}
            item={item}
            styles={styles}
        />
    )
}

export default EditUser