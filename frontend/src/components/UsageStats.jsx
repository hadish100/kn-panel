import React from "react";

import "./UsageStats.css";
import DataCenterIcon from "../assets/data-center.svg"

const UsageStats = ({ activeUsers, totalUsers, dataUsage, memoryUsage, totalMemory, allocatableData }) => {
    return (
        <div className="usage-stats">
            <div className="usage-stats__item">
                <div className="usage-stats__item__svg">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        width="24"
                        height="24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <path d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z"></path>
                    </svg>
                </div>
                <div className="usage-stats__item__label">Active Users</div>
                <div className="usage-stats__item__value"><span>{activeUsers}</span> / {totalUsers}</div>
            </div>
            <div className="usage-stats__item">
                <div className="usage-stats__item__svg">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        width="24"
                        height="24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <path d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z"></path>
                    </svg>
                </div>
                <div className="usage-stats__item__label">Data Usage</div>
                <div className="usage-stats__item__value"><span>{dataUsage}</span></div>
            </div>
            <div className="usage-stats__item">
                <div className="usage-stats__item__svg">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        width="24"
                        height="24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <path d="M13.5 10.5H21A7.5 7.5 0 0013.5 3v7.5z"></path>
                        <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 6a7.5 7.5 0 107.5 7.5h-7.5V6z"></path>
                    </svg>
                </div>
                <div className="usage-stats__item__label">Memory Usage</div>
                <div className="usage-stats__item__value"><span>{memoryUsage}</span> / {totalMemory}</div>
            </div>
            <div className="usage-stats__item">
                <div className="usage-stats__item__svg">
                    <img src={DataCenterIcon} alt="bar chart" />
                </div>
                <div className="usage-stats__item__label">Allocatable Data</div>
                <div className="usage-stats__item__value"><span>{allocatableData}</span></div>
            </div>
        </div>
    )
}

export default UsageStats;