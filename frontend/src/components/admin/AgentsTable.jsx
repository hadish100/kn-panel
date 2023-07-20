import React from "react"

import "./PanelsTable.css"
import { ReactComponent as DeleteIcon } from "../../assets/svg/delete.svg"
import { ReactComponent as PowerIcon } from "../../assets/svg/power.svg"
import Button from "../Button"


function b2gb(x)
{
    return parseInt(x/10**9)
}

const AdminPanelsTable = ({ users, rowsPerPage, currentRows }) => {

    return (
        <>
            <div className="wrapper" style={{ Width: "1230px" }}>
                <table className="users-table">
                    <thead className="users-table__header">
                        <tr className="users-table__header__row">
                            <th className="firbst">Name</th>
                            <th>Status</th>
                            <th>Active Users</th>
                            <th>Data Usage</th>
                            <th>Remaining Data</th>
                            <th>Allocatable Data</th>
                            <th>Prefix</th>
                            <th>Country</th>
                            <th className="last"></th>
                        </tr>
                    </thead>
                    <tbody className="users-table__body">
                        {currentRows.map((user) => (
                            <tr key={user.id}>
                                <td>{user.agent_name}</td>
                                <td>
                                    <span className={user.status ? "limited" : "active"} >
                                        {user.status ? "Inactive" : "Active"}
                                    </span>
                                </td>
                                <td >{user.activeUsers}</td>
                                <td>{user.used_traffic + " GB"}</td>
                                <td>{b2gb(user.volume) + " GB"}</td>
                                <td>{b2gb(user.weight_dividable) + " GB"}</td>
                                <td>{user.prefix}</td>
                                <td>{user.country}</td>
                                <td className="table__actions">
                                    <Button className="ghosted delete-icon">
                                        <DeleteIcon />
                                    </Button>
                                    <Button className="ghosted power-icon">
                                        <PowerIcon />
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    )
}

export default AdminPanelsTable