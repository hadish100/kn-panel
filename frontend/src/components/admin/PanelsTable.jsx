import React from "react"

import EmptyTable from "../EmptyTable"
import "./PanelsTable.css"

const AdminPanelsTable = ({ items, itemsPerPage, currentItems, onEditItem, onCreateItem, onDeleteItem }) => {
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
                    </tr>
                </thead>
                <tbody className="panels-table__body">
                    {items.length === 0
                        ? <EmptyTable tableType={"panel"} colSpan={7} onCreateButton={onCreateItem} />
                        : currentItems.map((item) => (
                            <tr onClick={() => onEditItem(item)} key={item.id}>
                                <td>{item.panel_name}</td>
                                <td>
                                    <span className={`status ${item.status ? "limited" : "active"}`} >
                                        {item.status ? "Deactive" : "Active"}
                                    </span>
                                </td>
                                <td>{item.panel_traffic + " GB"}</td>
                                <td >{item.active_user + " / " + (item.active_user + item.deactive_user)}</td>
                                <td >{item.panel_user_max_count}</td>
                                <td>{item.country}</td>
                            </tr>
                        ))}
                </tbody>
            </table>
        </div>
    )
}



export default AdminPanelsTable