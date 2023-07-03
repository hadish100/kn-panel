import React from "react"

import "./UsersTable.css"

const UsersTable = ({ users }) => {

    const checkExpireTime = (isActive, expireTime) => {
        if (isActive) {
            if (expireTime.days !== 0) {
                return `Expires in ${expireTime.days} days`;
            } else {
                return `Expires in ${expireTime.hours} hours, ${expireTime.minutes} minutes`;
            }
        } else {
            if (expireTime.days !== 0) {
                return `Expired ${expireTime.days} days ago`;
            } else {
                return `Expired ${expireTime.hours} hours, ${expireTime.minutes} minutes ago`;
            }
        }
    };



    const checkStatus = (status, isActive) => {
        if (status === "limited") {
            return "limited";
        } else if (isActive) {
            return "active";
        } else {
            return "expired";
        }
    };


    return (
        <div className="wrapper">
            <table className="users-table">
                <thead className="users-table__header">
                    <tr className="users-table__header__row">
                        <th className="first">Username</th>
                        <th>Status</th>
                        <th className="last">Data Usage</th>
                    </tr>
                </thead>
                <tbody className="users-table__body">
                    {users.map((user) => (
                        <tr key={user.id}>
                            <td>{user.username}</td>
                            <td>
                                <span className={checkStatus(user.status, user.isActive)}>
                                    {checkStatus(user.status, user.isActive)}
                                </span>
                                <span className="expire-time">
                                    {checkExpireTime(user.isActive, user.expireTime)}
                                </span>
                            </td>
                            <td>{user.dataUsage}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default UsersTable