import React, { useEffect } from 'react'
import ReactDOM from 'react-dom'

import { motion, AnimatePresence } from 'framer-motion'
import { ReactComponent as XMarkIcon } from '../assets/svg/x-mark.svg'
import cartIcon from '../assets/svg/cart.svg'
import styels from "./ErrorCard.module.css"

const ShoppingCard = ({ setHasPaymentNotif, hasPaymentNotif, paymentNotifTitle, paymentNotifMessage, isPaymentNotifPositive }) => {
    useEffect(() => {
        const errorTimer = setTimeout(() => {
            handleClose()
        }, 5000)

        return () => clearTimeout(errorTimer)
    },)

    const handleClose = () => {
        setHasPaymentNotif(false)
    }

    return ReactDOM.createPortal(
        <AnimatePresence>
            {hasPaymentNotif && <motion.div
                className={isPaymentNotifPositive?styels.okCard:styels.errorCard}
                initial={{ x: "120%" }}
                animate={{ x: 0 }}
                exit={{ x: "120%" }}
                transition={{ type: "spring", stiffness: 100, damping: 12 }}
            >
                <img src={cartIcon} className={isPaymentNotifPositive?styels.shoppingCardImgPositive:styels.shoppingCardImgNegative} />
                <div className={styels.errorCard__divider}>
                    <header className={styels.errorCard__header}>
                        <h2 className={styels.errorCard__title}>{paymentNotifTitle}</h2>
                        <XMarkIcon onClick={handleClose} />
                    </header>
                    <p className={styels.errorCard__message}>{paymentNotifMessage}</p>
                </div>
            </motion.div >}
        </AnimatePresence>,
        document.querySelector(".error-container")
    )
}

export default ShoppingCard