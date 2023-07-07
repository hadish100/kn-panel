import React, { useState } from "react";

import "./SubscriptionSection.css";
import Tooltip from "./Tooltip";


const SubscriptionSection = ({ subscriptionLink, config }) => {
    const [isHoveredButton1, setIsHoveredButton1] = useState(false);
    const [isHoveredButton2, setIsHoveredButton2] = useState(false);
    const [isHoveredButton3, setIsHoveredButton3] = useState(false);
    const [delayedIsHoverButton1, setDelayedIsHoverButton1] = useState(false);
    const [delayedIsHoverButton2, setDelayedIsHoverButton2] = useState(false);
    const [delayedIsHoverButton3, setDelayedIsHoverButton3] = useState(false);

    const handleMouseEnterButton1 = () => {
        setIsHoveredButton1(true);
        setDelayedIsHoverButton1(true);
    };

    const handleMouseLeaveButton1 = () => {
        setIsHoveredButton1(false);
        setTimeout(() => {
            setDelayedIsHoverButton1(false);
        }, 300);
    };

    const handleMouseEnterButton2 = () => {
        setIsHoveredButton2(true);
        setDelayedIsHoverButton2(true);
    };

    const handleMouseLeaveButton2 = () => {
        setIsHoveredButton2(false);
        setTimeout(() => {
            setDelayedIsHoverButton2(false);
        }, 300);
    };

    const handleMouseEnterButton3 = () => {
        setIsHoveredButton3(true);
        setDelayedIsHoverButton3(true);
    };

    const handleMouseLeaveButton3 = () => {
        setIsHoveredButton3(false);
        setTimeout(() => {
            setDelayedIsHoverButton3(false);
        }, 300);
    };

    const handleCopySubscriptionLink = () => {
        navigator.clipboard.writeText(subscriptionLink);
    };

    const handleCopyConfigLink = () => {
        navigator.clipboard.writeText(config);
    };

    return (
        <div className="subscription-section">
            <div className="subscription-section__buttons">
                <button class="subscription-section__button subcription-link"
                    onMouseEnter={handleMouseEnterButton1}
                    onMouseLeave={handleMouseLeaveButton1}
                    onClick={handleCopySubscriptionLink}
                >
                    <Tooltip isHovered={isHoveredButton1} delayedIsHover={delayedIsHoverButton1}>Copy Subscription Link</Tooltip>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.75" stroke="currentColor" aria-hidden="true" focusable="false" class="css-1fcggc9"><path stroke-linecap="round" stroke-linejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244"></path></svg>
                </button>
                <button className="subscription-section__button"
                    onMouseEnter={handleMouseEnterButton2}
                    onMouseLeave={handleMouseLeaveButton2}
                    onClick={handleCopyConfigLink}
                >
                    <Tooltip isHovered={isHoveredButton2} delayedIsHover={delayedIsHoverButton2}>Copy Configs</Tooltip>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.75" stroke="currentColor" aria-hidden="true" focusable="false" class="css-1fcggc9"><path stroke-linecap="round" stroke-linejoin="round" d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184"></path></svg>
                </button>
                <button className="subscription-section__button"
                    onMouseEnter={handleMouseEnterButton3}
                    onMouseLeave={handleMouseLeaveButton3}
                >
                    <Tooltip isHovered={isHoveredButton3} delayedIsHover={delayedIsHoverButton3}>QR Code</Tooltip>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.75" stroke="currentColor" aria-hidden="true" focusable="false" class="css-1fcggc9"><path stroke-linecap="round" stroke-linejoin="round" d="M3.75 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 013.75 9.375v-4.5zM3.75 14.625c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5a1.125 1.125 0 01-1.125-1.125v-4.5zM13.5 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0113.5 9.375v-4.5z"></path><path stroke-linecap="round" stroke-linejoin="round" d="M6.75 6.75h.75v.75h-.75v-.75zM6.75 16.5h.75v.75h-.75v-.75zM16.5 6.75h.75v.75h-.75v-.75zM13.5 13.5h.75v.75h-.75v-.75zM13.5 19.5h.75v.75h-.75v-.75zM19.5 13.5h.75v.75h-.75v-.75zM19.5 19.5h.75v.75h-.75v-.75zM16.5 16.5h.75v.75h-.75v-.75z"></path></svg>
                </button>
            </div>
        </div>
    )
}

export default SubscriptionSection