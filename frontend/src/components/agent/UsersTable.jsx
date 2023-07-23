import React, { useEffect, useState } from "react"

import "./UsersTable.css"
import ProgressBar from "../ProgressBar";
import SubscriptionActions from "./SubscriptionActions";
import { ReactComponent as ChevronDownIcon } from "../../assets/svg/chevron-down.svg";
import Button from "../Button"
import { AnimatePresence } from "framer-motion"
import UsersTableAccordion from "../UsersTableAccordion";
import convertData from "../../utils/file-size-util";
import handleExpireTime from "../../utils/expire-time-util";
import handleUserStatus from "../../utils/status-util";

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
                    <td style={{ maxWidth: "10rem" }}>{user.username}</td>
                    <td>
                        <span className={`status ${userStatus}`}>{userStatus}</span>
                        <span className="expire-time">{expireTime}</span>
                    </td>
                    <td>
                        <div className="users-table__progress-bar">
                            <ProgressBar dataUsage={user.dataUsage} totalData={user.totalData} status={userStatus} />
                            <div className="progress-bar__text">
                                <span className="progress-bar__text__data-usage">{dataUsage} / {totalData}</span>
                                <span className="progress-bar__text__total-data">Total: {totalData}</span>
                            </div>
                        </div>
                    </td>
                    <td>
                        <div className="users-table__subscription-actions">
                            <div className="table-actions">
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
                            totalData={user.totalData}
                            dataUsage={user.dataUsage}
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
                        <th>Username</th>
                        <th>Status</th>
                        <th>Data Usage</th>
                        <th></th>
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