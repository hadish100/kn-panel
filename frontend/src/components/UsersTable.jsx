import React, { useState } from "react"

import "./UsersTable.css"
import ProgressBar from "./ProgressBar";
import SubscriptionActions from "./SubscriptionActions";
import Accordion from "./Accordion"

const UsersTable = ({ users, rowsPerPage, currentRows }) => {

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

    const checkStatus = (dataUsage, totalData, isActive) => {
        if (dataUsage >= totalData) {
            return "limited";
        } else if (isActive) {
            return "active";
        } else {
            return "expired";
        }
    };

    const [expandedId, setExpandedId] = useState(null);
    const handleClick = (id) => {
        if (id === expandedId) {
            setExpandedId(null);
        } else {
            setExpandedId(id)
        }
    }

    const renderedUsers = currentRows.map((user) => (
        <>
            <tr key={user.id}>
                <td onClick={() => handleClick(user.id)} style={{ width: "25vw" }}>{user.username}</td>
                <td>
                    <span className={checkStatus(user.dataUsage, user.totalData, user.isActive)}>
                        {checkStatus(user.dataUsage, user.totalData, user.isActive)}
                    </span>
                    <span className="expire-time">
                        {checkExpireTime(user.isActive, user.expireTime)}
                    </span>
                </td>
                <td>
                    <ProgressBar dataUsage={user.dataUsage} totalData={user.totalData} status={checkStatus(user.dataUsage, user.totalData, user.isActive)} />
                </td>
                <td style={{ width: "9rem" }}>
                    {<SubscriptionActions subscriptionLink={user.subscriptionLink} config={user.config} />}
                </td>
            </tr>

            {
                user.id === expandedId
                &&
                <tr><Accordion id={user.id} /></tr>
            }

        </>
    ))

    return (
        <>
            <div className="wrapper">
                <table className="users-table">
                    <thead className="users-table__header">
                        <tr className="users-table__header__row">
                            <th className="first">Username</th>
                            <th >Status</th>
                            <th>Data Usage</th>
                            <th className="last"></th>
                        </tr>
                    </thead>
                    <tbody className="users-table__body">
                        {renderedUsers}
                    </tbody>
                </table>
            </div>
        </>
    )
}

export default UsersTable