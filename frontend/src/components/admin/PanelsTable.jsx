import React from "react"
import axios from 'axios'

import { ReactComponent as DeleteIcon } from "../../assets/svg/delete.svg"
import { ReactComponent as PowerIcon } from "../../assets/svg/power.svg"
import Button from "../Button"
import EmptyTable from "../EmptyTable"
import "./PanelsTable.css"

async function delete_panel(e, panel_id) {
    e.stopPropagation();
    const access_token = sessionStorage.getItem("access_token");
    var delete_panel = (await axios.post("/delete_panel", { access_token, panel_id })).data;
    var panels = (await axios.post("/get_panels", { access_token })).data;
    sessionStorage.setItem("panels", JSON.stringify(panels));
}

function power_panel(e) {
    e.stopPropagation();
}

const AdminPanelsTable = ({ items, itemsPerPage, currentItems, onEditItem, onCreateItem }) => {
    return (
        <div className="wrapper" style={{ overflowX: "auto" }}>
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
                    {currentItems.lenght === undefined
                        ? <EmptyTable tableType={"panel"} colSpan={7} onCreateButton={onCreateItem} />
                        : currentItems.map((user) => (
                            <tr onClick={onEditItem} key={user.id}>
                                <td>{user.panel_name}</td>
                                <td>
                                    <span className={`status ${user.status ? "limited" : "active"}`} >
                                        {user.status ? "Deactive" : "Active"}
                                    </span>
                                </td>
                                <td>{user.panel_traffic + " GB"}</td>
                                <td >{user.active_user + " / " + (user.active_user + user.deactive_user)}</td>
                                <td >{user.panel_user_max_count}</td>
                                <td>{user.country}</td>
                                <td className="table__actions">
                                    <Button onClick={(e) => delete_panel(e, user.id)} className="ghosted">
                                        <DeleteIcon />
                                    </Button>
                                    <Button onClick={(e) => power_panel(e)} className="ghosted">
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