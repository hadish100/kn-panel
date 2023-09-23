import React, { useState } from "react";

import "./SubscriptionActions.css";
import Tooltip from "../Tooltip";
import useHover from "../../hooks/use-hover";
import { ReactComponent as LinkIcon } from "../../assets/svg/link.svg";
import { ReactComponent as PasteIcon } from "../../assets/svg/paste.svg";
import { ReactComponent as QRCodeIcon } from "../../assets/svg/qr-code.svg";
import { ReactComponent as CheckedIcon } from "../../assets/svg/checked.svg";
import { ReactComponent as EditIcon } from "../../assets/svg/edit.svg";
import QRCode from "../QRCode";

const SubscriptionActions = ({ item, subscriptionLink, config, onEditItem, shouldRenderTr, QRCodeLinks }) => {
    const [clickedButton, setClickedButton] = useState(null);
    const [showQRCode, setShowQRCode] = useState(false);

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
    const {
        isHovered: isHovered4,
        handleMouseEnter: handleMouseEnter4,
        handleMouseLeave: handleMouseLeave4,
    } = useHover();

    const handleCopySubscriptionLink = (e) => {
        //navigator.clipboard.writeText(subscriptionLink);

        const tempInput = document.createElement('input');
        tempInput.setAttribute('type', 'text');
        tempInput.setAttribute('value', subscriptionLink);
        document.body.appendChild(tempInput);
        tempInput.select();
        document.execCommand('copy');
        document.body.removeChild(tempInput);

        setClickedButton("subscriptionLink");
        e.stopPropagation();

        // Remove the tooltip when the button is clicked
        if ('ontouchstart' in window || navigator.maxTouchPoints) {
            setTimeout(() => {
                handleMouseLeave1();
                setClickedButton(null);
            }, 1000);
        } else {
            // For non-touch devices (e.g., desktop), remove tooltip after 1 second
            setTimeout(() => {
                setClickedButton(null);
            }, 1000);
        }
    };

    const handleCopyConfigLink = (e) => {
        //navigator.clipboard.writeText(config);

        const tempInput = document.createElement('textarea');
        // tempInput.setAttribute('type', 'text');
        // tempInput.setAttribute('value', config);
        tempInput.innerHTML = config;
        document.body.appendChild(tempInput);
        tempInput.select();
        document.execCommand('copy');
        document.body.removeChild(tempInput);

        setClickedButton("config");
        e.stopPropagation();

        // Remove the tooltip when the button is clicked
        if ('ontouchstart' in window || navigator.maxTouchPoints) {
            setTimeout(() => {
                handleMouseLeave2();
                setClickedButton(null);
            }, 1000);
        } else {
            // For non-touch devices (e.g., desktop), remove tooltip after 1 second
            setTimeout(() => {
                setClickedButton(null);
            }, 1000);
        }
    };

    const handleShowQRCode = (e) => {
        e.stopPropagation()
        setShowQRCode(true)
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
                    onClick={handleShowQRCode}
                >
                    <Tooltip isHovered={isHovered3}>QR Code</Tooltip>
                    <QRCodeIcon />
                </button>
                {shouldRenderTr && <button
                    className="subscription-section__button"
                    onMouseEnter={handleMouseEnter4}
                    onMouseLeave={handleMouseLeave4}
                    onClick={() => onEditItem(item)}
                >
                    <Tooltip isHovered={isHovered4}>Edit</Tooltip>
                    <EditIcon />
                </button>}
            </div>

            <QRCode
                showQRCode={showQRCode}
                onClose={() => setShowQRCode(false)}
                QRCodeLinks={QRCodeLinks}
                subscriptionLink={subscriptionLink}
            />
        </div>
    );
};

export default SubscriptionActions;
