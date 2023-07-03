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
                <tbody>
                    {users.map((user) => (
                        <tr key={user.id}>
                            <td>{user.username}</td>
                            <td>{user.status}</td>
                            <td>{user.dataUsage}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default UsersTable