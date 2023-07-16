import React, { useEffect, useState } from "react"

import "./UsersTable.css"
import ProgressBar from "../ProgressBar";
import SubscriptionActions from "./SubscriptionActions";
import { ReactComponent as ChevronDownIcon } from "../assets/chevron-down.svg";
import Button from "./Button"
import { AnimatePresence } from "framer-motion"
import UsersTableAccordion from "./UsersTableAccordion";

const UsersTable = ({ currentRows }) => {
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

    const handleExpireTime = (isActive, expireTime) => {
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

    const handleUserStatus = ({ dataUsage, totalData, isActive }) => {
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


    const renderedUsers = currentRows.map((user) => {
        const userStatus = handleUserStatus(user)
        const dataUsage = convertData(user.dataUsage)
        const totalData = convertData(user.totalData)
        const expireTime = handleExpireTime(user.isActive, user.expireTime)
        const subscriptionLink = user.subscriptionLink
        const config = user.config
        const key = user.id

        return (
            <>
                <tr key={key}>
                    <td style={{ width: "25vw" }}>{user.username}</td>
                    <td>
                        <span className={userStatus}>{userStatus}</span>
                        <span className="expire-time">{expireTime}</span>
                    </td>
                    <td>
                        <div className="users-table__progress-bar">
                            <ProgressBar dataUsage={dataUsage} totalData={totalData} status={userStatus} />
                            <div className="progress-bar__text">
                                <span className="progress-bar__text__data-usage">{dataUsage} / {totalData}</span>
                                <span className="progress-bar__text__total-data">Total: {totalData}</span>
                            </div>
                        </div>
                    </td>
                    <td style={{ width: "9rem" }}>
                        <div className="users-table__subscription-actions">
                            <div className="subscription-actions">
                                {<SubscriptionActions subscriptionLink={subscriptionLink} config={config} />}
                            </div>
                            <div className={`accordion chevron-icon${expandedId === user.id ? "--up" : ""}`}>
                                <Button className="ghosted" onClick={() => handleClick(user.id)}>
                                    <ChevronDownIcon />
                                </Button>
                            </div>
                        </div>
                    </td>
                </tr>

                <AnimatePresence>
                    {
                        shouldRenderTr && key === expandedId &&
                        <UsersTableAccordion
                            key={key}
                            userStatus={userStatus}
                            expireTime={expireTime}
                            totalData={totalData}
                            dataUsage={dataUsage}
                            config={config}
                            subscriptionLink={subscriptionLink}
                        />
                    }
                </AnimatePresence >
            </>
        )
    })

    return (
        <div className="wrapper">
            <table className="users-table"
            >
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
        </div >
    )
}

export default UsersTable