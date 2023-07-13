import React from "react";

import "./ProgressBar.css";

const ProgressBar = ({ dataUsage, totalData, status }) => {
    return (
        <div className="progress-bar-container">
            <div className="progress-bar">
                <div className={`progress-bar__filler--${status}`} style={{ width: `${dataUsage / totalData * 100}%` }}></div>
            </div>
        </div>
    );
}

export default ProgressBar