import React, { useState } from 'react'

import Modal from './Modal'
import { AnimatePresence } from 'framer-motion'
import LeadingIcon from './LeadingIcon'
import { ReactComponent as QRCodeIcon } from '../assets/svg/qrcode.svg'
import { ReactComponent as XMarkIcon } from '../assets/svg/x-mark.svg'
import { ReactComponent as ArrowLeftIcon } from '../assets/svg/arrow-left.svg'
import { ReactComponent as ArrowRightIcon } from '../assets/svg/arrow-right.svg'
import { ReactComponent as DownloadIcon } from '../assets/svg/download.svg'
import { QRCodeSVG } from 'qrcode.react';
import { motion } from "framer-motion"
import "./QRCode.css"
import Button from './Button'

const QRCode = ({ onClose, showQRCode, QRCodeLinks, subscriptionLink }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    const handleNext = () => {
        const nextIndex = (currentIndex + 1) % QRCodeLinks.length;
        setCurrentIndex(nextIndex);
    };

    const handlePrevious = () => {
        const previousIndex = (currentIndex - 1 + QRCodeLinks.length) % QRCodeLinks.length;
        setCurrentIndex(previousIndex);
    };

    return (
        <div className="qr-code">
            <AnimatePresence>
                {showQRCode && (
                    <Modal onClose={onClose} className={"qr-code__modal"}>
                        <header className="modal__header">
                            <LeadingIcon>
                                <QRCodeIcon />
                            </LeadingIcon>
                            <h1 className='modal__title'>QR Code</h1>
                            <div className="close-icon" onClick={onClose}>
                                <XMarkIcon />
                            </div>
                        </header>
                        <main className='qr-code__main' style={{ display: "flex", justifyContent: "center", gap: "1rem" }}>
                            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1rem" }}>
                                <QRCodeSVG value={subscriptionLink} size={300} />
                                <div className='download_sublink_btn_container' >
                                <Button className="outlined" 
                                
                                onClick={async () => 
                                {
                                    const qrUrl = "https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=" + subscriptionLink;
                                    
                                    try 
                                    {
                                      const response = await fetch(qrUrl);
                                      const blob = await response.blob();
                                      const link = document.createElement("a");
                                      link.href = URL.createObjectURL(blob);
                                      link.download = "qr-code.png";
                                      document.body.appendChild(link);
                                      link.click();
                                      document.body.removeChild(link);
                                      URL.revokeObjectURL(link.href);
                                    } 
                                    
                                    catch (error) 
                                    {
                                      console.error("Download failed", error);
                                    }
                                  }}>
                                <DownloadIcon /></Button>
                                Subscribe Link
                                </div>
                            
                            </div>
                            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1rem" }}>
                                <div className='links__slider'>
                                    <div className='qr-code__links'>
                                        <motion.div
                                            className="inner"
                                            animate={{ transform: `translateX(-${currentIndex * 300 + currentIndex * 16}px)` }}
                                            transition={{ duration: .3 }}
                                        >
                                            {QRCodeLinks.map((QRCodeLink, index) => {
                                                return (
                                                    <QRCodeSVG key={index} value={QRCodeLink} size={300} />
                                                )
                                            })}
                                        </motion.div>
                                    </div>
                                </div>
                                <div class="qrcode_navigation_handler" >
                                <Button className="outlined arrow-left" onClick={handlePrevious}><ArrowLeftIcon /></Button>
                                {currentIndex + 1} / {QRCodeLinks.length}
                                <Button className="outlined arrow-right" onClick={handleNext}><ArrowRightIcon /></Button>
                                </div>
                            </div>
                        </main>
                    </Modal>
                )}
            </AnimatePresence>
        </div>
    )
}

export default QRCode