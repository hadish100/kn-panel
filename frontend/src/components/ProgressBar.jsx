import React from "react";

import "./ProgressBar.css";

const ProgressBar = ({ dataUsage, totalData, status }) => {
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


    return (
        <div className="container">
            <div className="progress-bar">
                <div className={`progress-bar__filler--${status}`} style={{ width: `${dataUsage / totalData * 100}%` }}></div>
            </div>
            <div className="progress-bar__text">
                <span className="progress-bar__text__data-usage">{convertData(dataUsage)} / {convertData(totalData)}</span>
                <span className="progress-bar__text__total-data">Total: {convertData(totalData)}</span>
            </div>
        </div>
    );
}

export default ProgressBar