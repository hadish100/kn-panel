import React from "react"

import "./UsersTable.css"

const UsersTable = ({ users }) => {
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
                                <span className={user.status}> {user.status}</span>
                                {user.expireTime}
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