import React from "react"

import "./PanelsTable.css"
import { ReactComponent as DeleteIcon } from "../../assets/svg/delete.svg"
import { ReactComponent as PowerIcon } from "../../assets/svg/power.svg"
import Button from "../Button"

const AdminPanelsTable = ({ users, rowsPerPage, currentRows }) => {

    // const checkExpireTime = (isActive, expireTime) => {
    //     if (isActive) {
    //         if (expireTime.days !== 0) {
    //             return `Expires in ${expireTime.days} days`;
    //         } else {
    //             return `Expires in ${expireTime.hours} hours, ${expireTime.minutes} minutes`;
    //         }
    //     } else {
    //         if (expireTime.days !== 0) {
    //             return `Expired ${expireTime.days} days ago`;
    //         } else {
    //             return `Expired ${expireTime.hours} hours, ${expireTime.minutes} minutes ago`;
    //         }
    //     }
    // };

    // const checkStatus = (dataUsage, totalData, isActive) => {
    //     if (dataUsage >= totalData) {
    //         return "limited";
    //     } else if (isActive) {
    //         return "active";
    //     } else {
    //         return "expired";
    //     }
    // };

    return (
        <>
            <div className="wrapper">
                <table className="users-table">
                    <thead className="users-table__header">
                        <tr className="users-table__header__row">
                            <th className="first">Name</th>
                            <th>Status</th>
                            <th>Traffic</th>
                            <th>Active Users</th>
                            <th>capacity</th>
                            <th>Country</th>
                            <th className="last"></th>
                        </tr>
                    </thead>
                    <tbody className="users-table__body">
                        {currentRows.map((user) => (
                            <tr key={user.id}>
                                <td>{user.panel_name}</td>
                                <td>
                                    <span className={user.status ? "limited" : "active"} >
                                        {user.status ? "Deactive" : "Active"}
                                    </span>
                                </td>

                                <td>
                                    {user.panel_traffic + " GB"}
                                </td>

                                <td >
                                    {user.activeUsers}
                                </td>

                                <td >
                                    {user.panel_user_max_count}
                                </td>

                                <td>
                                    {user.country}
                                </td>

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