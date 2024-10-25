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
import EmptyTable from "../EmptyTable";

const show_url = (str) => {
    str = str.replace(/^https?:\/\//, '');
    str = str.replace(/:\d+$/, '');
    return "(" + str + ")";
}

const UsersTable = ({ items, currentItems, onEditItem, onCreateItem }) => {
    const [screenWidth, setScreenWidth] = useState(window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth);
    const [expandedId, setExpandedId] = useState(null);

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

    const handleShowAccordion = (id) => {
        if (id === expandedId) {
            setExpandedId(null);
        } else {
            setExpandedId(id)
        }
    }

    const renderedUsers =
        items.length === 0
            ? <EmptyTable tableType={"user"} colSpan={4} onCreateButton={onCreateItem} />
            : currentItems.map((item) => {
                const userStatus = item.status
                const dataUsage = convertData(item.used_traffic)
                const totalData = convertData(item.data_limit)
                const lifetime_used_traffic = convertData(item.lifetime_used_traffic)
                const expireTime = handleExpireTime(item.expire)
                // const subscriptionLink = item.real_subscription_url.startsWith("http") ? item.subscription_url : item.real_subscription_url
                const subscriptionLink = item.subscription_url
                const config = item.links.join("\n");
                const QRCodeLinks = item.links
                const key = item.id

                return (
                    <>
                        <tr key={key} onClick={shouldRenderTr ? undefined : () => onEditItem(item)}>
                            <td style={{ maxWidth: "10rem" }}>{item.username} <br></br> <span className='panelUrl' >{show_url(item.corresponding_panel)} </span> </td>
                            <td>
                                <span className={`status ${userStatus}`}>{userStatus}</span>
                                <span className="expire-time">{expireTime}</span>
                            </td>
                            <td>
                                <div className="users-table__progress-bar">
                                    <ProgressBar dataUsage={item.used_traffic} totalData={item.data_limit} status={userStatus} />
                                    <div className="progress-bar__text">
                                        <span className="progress-bar__text__data-usage">{dataUsage} / {totalData}</span>
                                        <span className="progress-bar__text__total-data">Total: {lifetime_used_traffic}</span>
                                    </div>
                                </div>
                            </td>
                            <td>
                                <div className="users-table__subscription-actions">
                                    <div className="table-actions">
                                        {<SubscriptionActions subscriptionLink={subscriptionLink} config={config} QRCodeLinks={QRCodeLinks} />}
                                    </div>
                                    <div className={`accordion chevron-icon${expandedId === item.id ? "--up" : ""}`}>
                                        <Button className="ghosted" onClick={() => handleShowAccordion(item.id)}>
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
                                    item={item}
                                    itemKey={key}
                                    userStatus={userStatus}
                                    expireTime={expireTime}
                                    totalData={item.data_limit}
                                    dataUsage={item.used_traffic}
                                    config={config}
                                    subscriptionLink={subscriptionLink}
                                    QRCodeLinks={QRCodeLinks}
                                    onEditItem={onEditItem}
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