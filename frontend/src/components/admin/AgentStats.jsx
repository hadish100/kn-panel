import React from "react";

import "../agent/UsageStats.css";
import LeadingIcon from "../LeadingIcon";
import { ReactComponent as GraphBarIcon } from "../../assets/svg/graph-bar.svg"
import { ReactComponent as UsersIcon } from "../../assets/svg/users.svg"

const UsageStats = ({ activeUsers, totalUsers, dataUsage, remainingData, allocableData }) => {
    return (
        <div className="usage-stats">
            <div className="flex">
                <div className="usage-stats__item">
                    <LeadingIcon>
                        <UsersIcon />
                    </LeadingIcon>
                    <div className="usage-stats__item__label">Active Agents</div>
                    <div className="usage-stats__item__value"><span>{activeUsers}</span> / {totalUsers}</div>
                </div>
                <div className="usage-stats__item">
                    <LeadingIcon>
                        <GraphBarIcon />
                    </LeadingIcon>
                    <div className="usage-stats__item__label">Total Data Usage</div>
                    <div className="usage-stats__item__value"><span>{dataUsage}</span></div>
                </div>
            </div>

        </div>
    )
}

export default UsageStats;