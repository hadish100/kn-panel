import React from 'react'

import ProgressBar from "./ProgressBar";
import SubscriptionActions from "./agent/SubscriptionActions";
import Accordion from "./Accordion"
import convertData from "../utils/file-size-util"

const UsersTableAccordion = ({
    key,
    userStatus,
    expireTime,
    totalData,
    dataUsage,
    subscriptionLink,
    config,
    onEditItem
}) => {
    return (
        <tr key={key} className="accordion-row" style={{ height: 0 }}>
            <td className="accordion-row" style={{ borderTop: "none", height: 0, padding: "0 1.5rem" }} colSpan={4}>
                <Accordion>
                    <span style={{ fontSize: "0.75rem", fontFamily: "InterMedium", fontWeight: "600" }}>Data Usage</span>
                    <ProgressBar dataUsage={dataUsage} totalData={totalData} status={userStatus} />
                    <div className="progress-bar__text">
                        <span className="progress-bar__text__data-usage">{convertData(dataUsage)} / {convertData(totalData)}</span>
                        <span className="progress-bar__text__total-data">Total: {convertData(totalData)}</span>
                    </div>
                    <div style={{ marginTop: "1.25rem", paddingBottom: "1rem", display: "flex", justifyContent: "space-between" }}>
                        <div style={{ display: "flex", alignItems: "center" }}>
                            <span className={`accordion_status ${userStatus}`}>{userStatus}</span>
                            <span className="accordion__expire-time">{expireTime}</span>
                        </div>
                        <div className="accordion__subscription-actions" style={{ display: "flex", justifyContent: "space-around", width: "6rem" }}>
                            {<SubscriptionActions subscriptionLink={subscriptionLink} config={config} onEditItem={onEditItem} shouldRenderTr />}
                        </div>
                    </div>
                </Accordion>
            </td>
        </tr >
    )
}

export default UsersTableAccordion