import React from "react";

import "./SubscriptionSection.css";
import Tooltip from "./Tooltip";
import useHover from "../hooks/use-hover";
import { ReactComponent as LinkIcon } from "../assets/link.svg";
import { ReactComponent as PasteIcon } from "../assets/paste.svg";
import { ReactComponent as QRCodeIcon } from "../assets/qr-code.svg";

const SubscriptionSection = ({ subscriptionLink, config }) => {
    const {
        isHovered: isHovered1,
        handleMouseEnter: handleMouseEnter1,
        handleMouseLeave: handleMouseLeave1
    } = useHover()
    const {
        isHovered: isHovered2,
        handleMouseEnter: handleMouseEnter2,
        handleMouseLeave: handleMouseLeave2
    } = useHover()
    const {
        isHovered: isHovered3,
        handleMouseEnter: handleMouseEnter3,
        handleMouseLeave: handleMouseLeave3
    } = useHover()

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
                    onMouseEnter={handleMouseEnter1}
                    onMouseLeave={handleMouseLeave1}
                    onClick={handleCopySubscriptionLink}
                >
                    <Tooltip isHovered={isHovered1}>Copy Subscription Link</Tooltip>
                    <LinkIcon />
                </button>
                <button className="subscription-section__button"
                    onMouseEnter={handleMouseEnter2}
                    onMouseLeave={handleMouseLeave2}
                    onClick={handleCopyConfigLink}
                >
                    <Tooltip isHovered={isHovered2}>Copy Configs</Tooltip>
                    <PasteIcon />
                </button>
                <button className="subscription-section__button"
                    onMouseEnter={handleMouseEnter3}
                    onMouseLeave={handleMouseLeave3}
                >
                    <Tooltip isHovered={isHovered3}>QR Code</Tooltip>
                    <QRCodeIcon />
                </button>
            </div>
        </div >
    )
}

export default SubscriptionSection