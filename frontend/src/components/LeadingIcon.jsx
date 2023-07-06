import React from "react";

import "./LeadingIcon.css";

const LeadingIcon = ({ children }) => {
    return (
        <div className={"leading-icon"}>
            {children}
        </div>
    );
}

export default LeadingIcon;