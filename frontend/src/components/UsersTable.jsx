import React, { useEffect, useState } from "react"

import "./UsersTable.css"
import ProgressBar from "./ProgressBar";
import SubscriptionActions from "./SubscriptionActions";
import Accordion from "./Accordion"
import { ReactComponent as ChevronDownIcon } from "../assets/chevron-down.svg";
import Button from "./Button"

const UsersTable = ({ users, rowsPerPage, currentRows }) => {
    const [screenWidth, setScreenWidth] = useState(window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth);
    const shouldRenderTr = screenWidth < 690;

    useEffect(() => {
        const handleResize = () => {
            setScreenWidth(window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth);
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

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

    const convertData = (data) => {
        const units = ['B', 'KB', 'MB', 'GB', 'TB'];
        let size = data;
        let unitIndex = 0;

        while (size >= 1000 && unitIndex < units.length - 1) {
            size /= 1000;
            unitIndex++;
        }

        return size.toFixed(2) + ' ' + units[unitIndex];
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
                    <div className="users-table__progress-bar">
                        <ProgressBar dataUsage={user.dataUsage} totalData={user.totalData} status={checkStatus(user.dataUsage, user.totalData, user.isActive)} />
                        <div className="progress-bar__text">
                            <span className="progress-bar__text__data-usage">{convertData(user.dataUsage)} / {convertData(user.totalData)}</span>
                            <span className="progress-bar__text__total-data">Total: {convertData(user.totalData)}</span>
                        </div>
                    </div>
                </td>
                <td style={{ width: "9rem" }}>
                    <div className="users-table__subscription-actions">
                        <div className="subscription-actions">
                            {<SubscriptionActions subscriptionLink={user.subscriptionLink} config={user.config} />}
                        </div>
                        <div className="chevron-icon">
                            <Button className="ghosted" onClick={() => handleClick(user.id)}>
                                <ChevronDownIcon />
                            </Button>
                        </div>
                    </div>
                </td>
            </tr>

            {
                shouldRenderTr
                &&
                user.id === expandedId
                &&
                <tr className="accordion-row">
                    <td className="accordion-row" style={{ borderTop: "none", padding: "0 1.5rem 1rem" }} colSpan={4}>
                        <Accordion id={user.id} >
                            <span style={{ fontSize: "0.75rem", fontFamily: "InterMedium", fontWeight: "600" }}>Data Usage</span>
                            <ProgressBar dataUsage={user.dataUsage} totalData={user.totalData} status={checkStatus(user.dataUsage, user.totalData, user.isActive)} />
                            <div className="progress-bar__text">
                                <span className="progress-bar__text__data-usage">{convertData(user.dataUsage)} / {convertData(user.totalData)}</span>
                                <span className="progress-bar__text__total-data">Total: {convertData(user.totalData)}</span>
                            </div>
                            <div style={{ marginTop: "1.25rem", display: "flex", justifyContent: "space-between" }}>
                                <div>
                                    <span className={`accordion__${checkStatus(user.dataUsage, user.totalData, user.isActive)}`}>
                                        {checkStatus(user.dataUsage, user.totalSData, user.isActive)}
                                    </span>
                                    <span className="accordion__expire-time">
                                        {checkExpireTime(user.isActive, user.expireTime)}
                                    </span>
                                </div>
                                <div className="accordion__subscription-actions" style={{ display: "flex", justifyContent: "space-around", width: "6rem" }}>
                                    {<SubscriptionActions subscriptionLink={user.subscriptionLink} config={user.config} />}
                                </div>
                            </div>
                        </Accordion>
                    </td>
                </tr>
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