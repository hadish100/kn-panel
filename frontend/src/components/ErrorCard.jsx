import React, { useEffect } from 'react'
import ReactDOM from 'react-dom'

import { motion, AnimatePresence } from 'framer-motion'
import { ReactComponent as XMarkIcon } from '../assets/svg/x-mark.svg'
import { ReactComponent as ExclamationIcon } from '../assets/svg/exclamation-mark.svg'
import styels from "./ErrorCard.module.css"

const ErrorCard = ({ setHasError, hasError, errorTitle, errorMessage }) => {
    useEffect(() => {
        const errorTimer = setTimeout(() => {
            handleClose()
        }, 5000)

        return () => clearTimeout(errorTimer)
    },)

    const handleClose = () => {
        setHasError(false)
    }

    return ReactDOM.createPortal(
        <AnimatePresence>
            {hasError && <motion.div
                className={styels.errorCard}
                initial={{ x: "120%" }}
                animate={{ x: 0 }}
                exit={{ x: "120%" }}
                transition={{ type: "spring", stiffness: 100, damping: 12 }}
            >
                <ExclamationIcon />
                <div className={styels.errorCard__divider}>
                    <header className={styels.errorCard__header}>
                        <h2 className={styels.errorCard__title}>{errorTitle}</h2>
                        <XMarkIcon onClick={handleClose} />
                    </header>
                    <p className={styels.errorCard__message}>{errorMessage}</p>
                </div>
            </motion.div >}
        </AnimatePresence>,
        document.querySelector(".error-container")
    )
}

export default ErrorCard