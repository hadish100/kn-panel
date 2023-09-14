import React from 'react'

import Modal from '../../components/Modal'
import LeadingIcon from '../../components/LeadingIcon'
import { ReactComponent as XMarkIcon } from '../../assets/svg/x-mark.svg'
import { ReactComponent as SwitchIcon } from '../../assets/svg/switch.svg'
import { AnimatePresence } from 'framer-motion'

const SwitchCountries = ({ onClose, showModal }) => {
    return (
        <AnimatePresence>
            {showModal && (<Modal width={"30rem"} onClose={onClose}>
                <header className="modal__header">
                    <LeadingIcon>
                        <SwitchIcon />
                    </LeadingIcon>
                    <h1 className="modal__title">Switch countries for all users</h1>
                    <div className="close-icon" onClick={onClose}>
                        <XMarkIcon />
                    </div>
                </header>
            </Modal>)}
        </AnimatePresence>
    )
}

export default SwitchCountries