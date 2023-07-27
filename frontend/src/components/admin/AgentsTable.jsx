import React from "react"

import "./AgentsTable.css"
import { ReactComponent as DeleteIcon } from "../../assets/svg/delete.svg"
import { ReactComponent as PowerIcon } from "../../assets/svg/power.svg"
import Button from "../Button"

function b2gb(x) {
    return parseInt(x / (2 ** 10) ** 3)
}

function power_agent(e) {
    e.stopPropagation();
}

const AdminPanelsTable = ({ users, rowsPerPage, currentRows, setShowEditModal, onDeleteItem }) => {
    const handleClick = () => {
        setShowEditModal(true)
    }

    return (
        <div className="wrapper" style={{ Width: "1230px", overflowX: "auto" }}>
            <table className="agents-table">
                <thead className="agents-table__header">
                    <tr className="agents-table__header__row">
                        <th>Name</th>
                        <th>Status</th>
                        <th>Active Users</th>
                        <th>Data Usage</th>
                        <th>Remaining Data</th>
                        <th>Allocatable Data</th>
                        <th>Prefix</th>
                        <th>Country</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody className="agents-table__body">
                    {currentRows.map((user) => (
                        <tr onClick={handleClick} key={user.id} agent_id={user.id} >
                            <td>{user.agent_name}</td>
                            <td>
                                <span className={`status ${user.status ? "limited" : "active"}`} >
                                    {user.status ? "Inactive" : "Active"}
                                </span>
                            </td>
                            <td >{user.active_user}</td>
                            <td>{user.used_traffic + " GB"}</td>
                            <td>{b2gb(user.volume) + " GB"}</td>
                            <td>{b2gb(user.weight_dividable) + " GB"}</td>
                            <td>{user.prefix}</td>
                            <td>{user.country}</td>
                            <td className="table__actions">
                                <Button onClick={(e) => onDeleteItem(e, user.id)} className="ghosted delete-icon">
                                    <DeleteIcon />
                                </Button>
                                <Button onClick={(e) => power_agent(e,user.id)} className="ghosted power-icon">
                                    <PowerIcon />
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default AdminPanelsTable