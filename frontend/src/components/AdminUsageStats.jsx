import React from "react";

import "./UsageStats.css";
import LeadingIcon from "./LeadingIcon";
import { ReactComponent as PieChartIcon } from "../assets/pie-chart.svg";
import { ReactComponent as DataCenterIcon } from "../assets/data-center.svg"
import { ReactComponent as GraphBarIcon } from "../assets/graph-bar.svg"
import { ReactComponent as UsersIcon } from "../assets/users.svg"

const UsageStats = ({ activeUsers, totalUsers, dataUsage, remainingData, allocableData }) => {
    return (
        <div className="usage-stats">
            <div className="flex">
                <div className="usage-stats__item">
                    <LeadingIcon>
                        <UsersIcon />
                    </LeadingIcon>
                    <div className="usage-stats__item__label">Total Active Users</div>
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