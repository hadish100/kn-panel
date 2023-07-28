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
// import handleUserStatus from "../../utils/status-util";

const UsersTable = ({ currentRows, setShowEditModal }) => {
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

    const handleShowEditModal = () => {
        setShowEditModal(true);
    }


    const renderedUsers = currentRows.map((user) => {
        console.log(user);
        const userStatus = user.status
        const dataUsage = convertData(user.used_traffic)
        const totalData = convertData(user.data_limit)
        const expireTime = handleExpireTime(user.expire)
        const subscriptionLink = user.subscription_url
        const config = user.links.join("\n");
        const key = user.id

        return (
            <>
                <tr key={key} onClick={!shouldRenderTr ? handleShowEditModal : undefined}>
                    <td style={{ maxWidth: "10rem" }}>{user.username}</td>
                    <td>
                        <span className={`status ${userStatus}`}>{userStatus}</span>
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
                            totalData={user.data_limit}
                            dataUsage={user.used_traffic}
                            config={config}
                            subscriptionLink={subscriptionLink}
                            setShowEditModal={setShowEditModal}
                            shouldRenderTr={shouldRenderTr}
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