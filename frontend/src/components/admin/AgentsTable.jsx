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

const AdminPanelsTable = ({ items, itemsPerPage, currentItems, onEditItem, onDeleteItem }) => {
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
                    {currentItems.map((item) => (
                        <tr onClick={() => onEditItem(item)} key={item.id} agent_id={item.id} >
                            <td>{item.agent_name}</td>
                            <td>
                                <span className={`status ${item.status ? "limited" : "active"}`} >
                                    {item.status ? "Inactive" : "Active"}
                                </span>
                            </td>
                            <td >{item.active_user}</td>
                            <td>{item.used_traffic + " GB"}</td>
                            <td>{b2gb(item.volume) + " GB"}</td>
                            <td>{b2gb(item.weight_dividable) + " GB"}</td>
                            <td>{item.prefix}</td>
                            <td>{item.country}</td>
                            <td className="table__actions">
                                <Button onClick={(e) => onDeleteItem(e, item.id)} className="ghosted delete-icon">
                                    <DeleteIcon />
                                </Button>
                                <Button onClick={(e) => power_agent(e, item.id)} className="ghosted power-icon">
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