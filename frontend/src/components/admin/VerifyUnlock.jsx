import React from 'react'

import { ReactComponent as DeleteIcon } from "../../assets/svg/lockWhite.svg"
import { ReactComponent as XMarkIcon } from '../../assets/svg/x-mark.svg'
import { motion, AnimatePresence } from 'framer-motion'
import LeadingIcon from '../LeadingIcon'
import Modal from '../Modal'
import Button from '../Button'

const VerifyDelete = ({ onClose, showForm, onDeleteItem, unlockMode }) => {
    const formHeader = (
        <header className="modal__header">
            <LeadingIcon>
                <DeleteIcon />
            </LeadingIcon>
            <h1 className="modal__title">Confirm Unlock user</h1>
            <div className="close-icon" onClick={onClose}>
                <XMarkIcon />
            </div>
        </header>
    )

    const formFooter = (
        <motion.footer className="modal__footer" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <Button className="outlined wide_btn" onClick={onClose} > Cancel </Button>
            <Button className="primary wide_btn" onClick={onDeleteItem} disabled={unlockMode}>{unlockMode ? "Unlocking..." : "Unlock"}</Button>
        </motion.footer>
    )

    return (
        <AnimatePresence>
            {showForm && (
                <Modal v2="true" width={"30rem"} onClose={onClose}>
                    {formHeader}
                    {formFooter}
                </Modal>
            )}
        </AnimatePresence>
    )
}

export default VerifyDelete