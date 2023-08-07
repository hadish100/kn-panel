import React from "react"

import EmptyTable from "../EmptyTable"
import "./PanelsTable.css"

const show_url = (str) =>
{
    //remove http or https from the beginning and port at the end
    str = str.replace(/^https?:\/\//, '');
    str = str.replace(/:\d+$/, '');
    return "(" + str + ")";
}

const AdminPanelsTable = ({ items, itemsPerPage, currentItems, onEditItem, onCreateItem }) => {
    console.log(items)
    return (
        <div className="wrapper" style={{ overflowX: "auto" }}>
            <table className="panels-table">
                <thead className="panels-table__header">
                    <tr className="panels-table__header__row">
                        <th>Name</th>
                        <th>Status</th>
                        <th>Data Usage</th>
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
                                <td>{item.panel_name} <br></br> <span className='panelUrl' >{show_url(item.panel_url)} </span> </td>
                                <td>
                                    <span className={`status ${item.disable ? "limited" : "active"}`} >
                                        {item.disable ? "Disabled" : "Active"}
                                    </span>
                                </td>
                                <td>{item.panel_data_usage + " GB"}</td>
                                <td>{item.panel_traffic + " GB"}</td>
                                <td >{item.active_users + " / " + item.total_users}</td>
                                <td >{item.panel_user_max_count}</td>
                                <td>{item.panel_country}</td>
                            </tr>
                        ))}
                </tbody>
            </table>
        </div>
    )
}



export default AdminPanelsTable