import React from 'react'

import { ReactComponent as EditIcon } from '../../assets/svg/edit.svg'
import { ReactComponent as DeleteIcon } from '../../assets/svg/delete.svg'
import { ReactComponent as PowerIcon } from '../../assets/svg/power.svg'
import Form from '../form/Form'

const EditAgent = ({ item, onClose, showForm, onDeleteItem }) => {
    
    async function power_agent(e,agent_id)
    {
        e.stopPropagation();
        const access_token = sessionStorage.getItem("access_token");
        var disable_agent = (await axios.post("/disable_agent", { access_token, agent_id })).data;
        var agents = (await axios.post("/get_agents", { access_token })).data;
        sessionStorage.setItem("agents", JSON.stringify(agents));
    }

    const formFields = [
        { label: "Name", type: "text", id: "agent_name", name: "name" },
        { label: "Username", type: "text", id: "username", name: "username" },
        { label: "Password", type: "text", id: "password", name: "password" },
        [
            { label: "Volume", type: "number", id: "volume", name: "volume" },
            { label: "Minimum Volume", type: "number", id: "minimum_volume", name: "min_vol" },
        ],
        [
            { label: "Maximum Users", type: "number", id: "maximum_user", name: "max_users" },
            { label: "MaxDays", type: "number", id: "maximum_day", name: "maxDays" },
        ],
        [
            { label: "Prefix", type: "text", id: "prefix", name: "prefix" },
            { label: "Country", type: "text", id: "country", name: "country" }
        ]
    ]

    const primaryButtons = [
        { label: "Cancel", className: "outlined", onClick: onClose },
        { label: "Edit Agent", className: "primary", onClick: onClose },
    ]

    const secondaryButtons = [
        { icon: <DeleteIcon />, label: "Delete", className: "ghosted", onClick: (e) => onDeleteItem(e, item.id) },
        { icon: <PowerIcon />, label: "Power", className: "ghosted", onClick: power_agent },
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

export default EditAgent