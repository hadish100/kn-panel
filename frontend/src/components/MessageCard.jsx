import React from 'react'

import { AnimatePresence } from 'framer-motion'
import { ReactComponent as DeleteIcon } from "../assets/svg/delete2.svg"
import { ReactComponent as XMarkIcon } from '../assets/svg/x-mark.svg'
import LeadingIcon from './LeadingIcon'
import Modal from './Modal'
import TimerBar from './TimerBar'

const MessageCard = ({ title, duration, showCard, onClose }) => {
    return (
        <AnimatePresence>
            {showCard && (
                <Modal onClose={onClose} width={"30rem"} alignItems={"center"}>
                    <header className="modal__header">
                        <LeadingIcon>
                            <DeleteIcon />
                        </LeadingIcon>
                        <h1 className="modal__title">{title}</h1>
                        <div className="close-icon" onClick={onClose}>
                            <XMarkIcon />
                        </div>
                    </header>
                    <main>
                        <TimerBar duration={duration} />
                    </main>
                </Modal>
            )}
        </AnimatePresence>
    )
}

export default MessageCard