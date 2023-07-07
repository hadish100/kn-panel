import React from "react";

import "./Tooltip.css"

const Tooltip = ({ children, delayedIsHover, isHovered }) => {
    return (
        delayedIsHover && <span className={`tooltip ${isHovered ? "tooltip-fade-in" : "tooltip-fade-out"}`}>{children}</span>
    )
}

export default Tooltip