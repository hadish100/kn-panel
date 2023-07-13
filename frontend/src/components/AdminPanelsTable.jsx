import React from "react"

import "./adminPanelsTable.css"

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
                            <th>Data Usage</th>
                            <th>Active Users</th>
                            <th>Country</th>
                            <th className="last"></th>
                        </tr>
                    </thead>
                    <tbody className="users-table__body">
                        {currentRows.map((user) => (
                            <tr key={user.id}>
                                <td>{user.name}</td>
                                <td>
                                     <span className={user.status?"active":"limited"} > 
                                        {user.status?"CONNECTED":"DISCONNECTED"}
                                    </span>
                                </td>

                                <td>
                                    {user.dataUsage}
                                 </td>
                                <td >
                                    {user.activeUsers}
                                </td>

                                <td>
                                    {user.country}
                                </td>

                                <td>
                                    <img className="deletePanel" src="../delete.png" />
                                    <img className="togglePanel" src="../power.png" />
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