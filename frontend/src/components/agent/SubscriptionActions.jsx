import React, { useState } from "react";

import "./SubscriptionActions.css";
import Tooltip from "../Tooltip";
import useHover from "../../hooks/use-hover";
import { ReactComponent as LinkIcon } from "../../assets/svg/link.svg";
import { ReactComponent as PasteIcon } from "../../assets/svg/paste.svg";
import { ReactComponent as QRCodeIcon } from "../../assets/svg/qr-code.svg";
import { ReactComponent as CheckedIcon } from "../../assets/svg/checked.svg";

const SubscriptionActions = ({ subscriptionLink, config }) => {
    const [clickedButton, setClickedButton] = useState(null);

    const {
        isHovered: isHovered1,
        handleMouseEnter: handleMouseEnter1,
        handleMouseLeave: handleMouseLeave1,
    } = useHover();
    const {
        isHovered: isHovered2,
        handleMouseEnter: handleMouseEnter2,
        handleMouseLeave: handleMouseLeave2,
    } = useHover();
    const {
        isHovered: isHovered3,
        handleMouseEnter: handleMouseEnter3,
        handleMouseLeave: handleMouseLeave3,
    } = useHover();

    const handleCopySubscriptionLink = () => {
        navigator.clipboard.writeText(subscriptionLink);
        setClickedButton("subscriptionLink");
        setTimeout(() => {
            setClickedButton(null);
        }, 1000);
    };

    const handleCopyConfigLink = () => {
        navigator.clipboard.writeText(config);
        setClickedButton("config");
        setTimeout(() => {
            setClickedButton(null);
            console.log(clickedButton);
        }, 1000);
    };

    return (
        <div className="subscription-section">
            <div className="subscription-section__buttons">
                <button
                    className="subscription-section__button"
                    onMouseEnter={handleMouseEnter1}
                    onMouseLeave={handleMouseLeave1}
                    onClick={handleCopySubscriptionLink}
                >
                    {clickedButton === "subscriptionLink"
                        ? <Tooltip isHovered={isHovered1}>Copied</Tooltip>
                        : <Tooltip isHovered={isHovered1}>Copy Subscription Link</Tooltip>
                    }
                    {clickedButton === "subscriptionLink" ? <CheckedIcon /> : <LinkIcon />}
                </button>
                <button
                    className="subscription-section__button"
                    onMouseEnter={handleMouseEnter2}
                    onMouseLeave={handleMouseLeave2}
                    onClick={handleCopyConfigLink}
                >

                    {clickedButton === "config"
                        ? <Tooltip isHovered={isHovered2}>Copied</Tooltip>
                        : <Tooltip isHovered={isHovered2}>Copy Configs</Tooltip>
                    }
                    {clickedButton === "config" ? <CheckedIcon /> : <PasteIcon />}
                </button>
                <button
                    className="subscription-section__button"
                    onMouseEnter={handleMouseEnter3}
                    onMouseLeave={handleMouseLeave3}
                >
                    <Tooltip isHovered={isHovered3}>QR Code</Tooltip>
                    <QRCodeIcon />
                </button>
            </div>
        </div>
    );
};

export default SubscriptionActions;
