import React, { useState } from "react"

import "./UsersTable.css"
import ProgressBar from "./ProgressBar";
import SubscriptionActions from "./SubscriptionActions";
import Pagination from "./Pagination";

const UsersTable = ({ users, rowsPerPage }) => {

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

    const [currentPage, setCurrentPage] = useState(1)

    const handlePageChange = (page) => {
        setCurrentPage(page)
    }

    const LastRowIndex = currentPage * rowsPerPage
    const FirstRowIndex = LastRowIndex - rowsPerPage
    const currentRows = users.slice(FirstRowIndex, LastRowIndex)

    const totalPages = Math.ceil(users.length / rowsPerPage)

    return (
        <>
            <div className="wrapper">
                <table className="users-table">
                    <thead className="users-table__header">
                        <tr className="users-table__header__row">
                            <th className="first">Username</th>
                            <th>Status</th>
                            <th>Data Usage</th>
                            <th className="last"></th>
                        </tr>
                    </thead>
                    <tbody className="users-table__body">
                        {currentRows.map((user) => (
                            <tr key={user.id}>
                                <td style={{ width: "25vw" }}>{user.username}</td>
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
                        ))}
                    </tbody>
                </table>
            </div>
            <div>
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    handlePageChange={handlePageChange}
                />
            </div>
        </>
    )
}

export default UsersTable