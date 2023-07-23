import React from 'react'

import Modal from '../Modal'
import { motion, AnimatePresence } from "framer-motion"
import LeadingIcon from '../LeadingIcon'
import { ReactComponent as EditIcon } from '../../assets/svg/edit.svg'
import { ReactComponent as XMarkIcon } from '../../assets/svg/x-mark.svg'
import Button from '../Button'


const EditUserForm = ({ handleClose, showModal }) => {
    return (
        <AnimatePresence>
            {showModal && <Modal onClose={handleClose}>
                <header className="modal__header">
                    <LeadingIcon>
                        <EditIcon />
                    </LeadingIcon>
                    <h1 className="modal__title">Edit User</h1>
                    <div className="close-icon" onClick={handleClose}>
                        <XMarkIcon />
                    </div>
                </header>
                <main className="modal__body">
                    <form className="modal__form">
                        <motion.div className="modal__form__group" animate={{ x: 0, opacity: 1 }} initial={{ x: -40, opacity: 0 }}>
                            <label className="modal__form__label" htmlFor="name">Username</label>
                            <input className="modal__form__input" type="text" id="name" name="name" disabled />
                        </motion.div>

                        <motion.div className="modal__form__group" animate={{ x: 0, opacity: 1 }} initial={{ x: -40, opacity: 0 }} transition={{ delay: 0.1 }}>
                            <label className="modal__form__label" htmlFor="userName">Data Limit</label>
                            <input className="modal__form__input" type="text" id="userName" name="userName" />
                        </motion.div>

                        <motion.div className="modal__form__group" animate={{ x: 0, opacity: 1 }} initial={{ x: -40, opacity: 0 }} transition={{ delay: 0.2 }}>
                            <label className="modal__form__label" htmlFor="password">Days To Expire</label>
                            <input className="modal__form__input" type="text" id="password" name="password" />
                        </motion.div>
                    </form>
                </main>
                <motion.footer className="modal__footer" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <Button className="outlined" onClick={handleClose}>Cancel</Button>
                    <Button className="primary">Edit user</Button>
                </motion.footer>
            </Modal>}
        </AnimatePresence>
    )
}

export default EditUserForm