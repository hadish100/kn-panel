import React from "react"

import "./PanelsTable.css"
import { ReactComponent as DeleteIcon } from "../../assets/svg/delete.svg"
import { ReactComponent as PowerIcon } from "../../assets/svg/power.svg"
import Button from "../Button"
import axios from 'axios'

async function delete_panel(panel_id) {
    const access_token = sessionStorage.getItem("access_token");
    var delete_panel = (await axios.post("/delete_panel", { access_token, panel_id })).data;
    var panels = (await axios.post("/get_panels", { access_token })).data;
    sessionStorage.setItem("panels", JSON.stringify(panels));
}

const AdminPanelsTable = ({ users, rowsPerPage, currentRows, setShowEditModal }) => {
    const handleClick = () => {
        setShowEditModal(true)
    }

    return (
        <div className="border">
            <table className="panels-table">
                <thead className="panels-table__header">
                    <tr className="panels-table__header__row">
                        <th>Name</th>
                        <th>Status</th>
                        <th>Traffic</th>
                        <th>Active Users</th>
                        <th>capacity</th>
                        <th>Country</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody className="panels-table__body">
                    {currentRows.map((user) => (
                        <tr onClick={handleClick} key={user.id}>
                            <td>{user.panel_name}</td>
                            <td>
                                <span className={`status ${user.status ? "limited" : "active"}`} >
                                    {user.status ? "Deactive" : "Active"}
                                </span>
                            </td>
                            <td>{user.panel_traffic + " GB"}</td>
                            <td >{user.activeUsers}</td>
                            <td >{user.panel_user_max_count}</td>
                            <td>{user.country}</td>
                            <td className="table__actions">
                                <Button onClick={() => delete_panel(user.id)} className="ghosted">
                                    <DeleteIcon />
                                </Button>
                                <Button className="ghosted">
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