import React from 'react'

import Modal from './Modal'
import { AnimatePresence } from 'framer-motion'
import LeadingIcon from './LeadingIcon'
import { ReactComponent as QRCodeIcon } from '../assets/svg/qrcode.svg'
import { ReactComponent as XMarkIcon } from '../assets/svg/x-mark.svg'
import { QRCodeSVG } from 'qrcode.react';

const QRCode = ({ onClose, showQRCode, QRCodeLink }) => {
    return (
        <AnimatePresence>
            {showQRCode && (
                <Modal /*onClose={onClose}*/>
                    <header className="modal__header">
                        <LeadingIcon>
                            <QRCodeIcon />
                        </LeadingIcon>
                        <h1 className='modal__title'>QR Code</h1>
                        <div className="close-icon" onClick={onClose}>
                            <XMarkIcon />
                        </div>
                    </header>
                    <main style={{ display: "flex", justifyContent: "center" }}>
                        <QRCodeSVG value={QRCodeLink} size={200} />
                    </main>
                </Modal>
            )}
        </AnimatePresence>
    )
}

export default QRCode