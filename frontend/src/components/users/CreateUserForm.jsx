import React from 'react'

import Modal from "../Modal";
import LeadingIcon from "../LeadingIcon";
import Button from "../Button";
import { ReactComponent as AddUserIcon } from "../../assets/add-user.svg";
import { ReactComponent as XMarkIcon } from "../../assets/x-mark.svg";
import { motion } from "framer-motion"
import "./CreateUserForm.css"


const CreateUserForm = ({ handleClose }) => {
    return (
        <Modal onClose={handleClose} >
            <header className="modal__header">
                <LeadingIcon>
                    <AddUserIcon />
                </LeadingIcon>
                <h1 className="modal__title">Create new user</h1>
                <div className="close-icon" onClick={handleClose}>
                    <XMarkIcon />
                </div>
            </header>
            <main className="modal__body">
                <form className="modal__form">
                    <motion.div className="modal__form__group" animate={{ x: 0, opacity: 1 }} initial={{ x: -40, opacity: 0 }}>
                        <label className="modal__form__label" htmlFor="username">Username</label>
                        <input className="modal__form__input" type="text" id="username" name="username" />
                    </motion.div>
                    <motion.div className="modal__form__group" animate={{ x: 0, opacity: 1 }} initial={{ x: -40, opacity: 0 }} transition={{ delay: 0.1 }}>
                        <label className="modal__form__label" htmlFor="dataLimit">Data Limit</label>
                        <input className="modal__form__input" type="number" id="dataLimit" name="dataLimit" />
                    </motion.div>
                    <motion.div className="modal__form__group" animate={{ x: 0, opacity: 1 }} initial={{ x: -40, opacity: 0 }} transition={{ delay: 0.2 }}>
                        <label className="modal__form__label" htmlFor="daysToExpire">Days To Expire</label>
                        <input className="modal__form__input" type="number" id="daysToExpire" name="daysToExpire" />
                    </motion.div>
                </form>
            </main>
            <motion.footer className="modal__footer" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <Button className={"transparent"} onClick={handleClose}>Cancel</Button>
                <Button className={"primary"} onClick={handleClose}>Create User</Button>
            </motion.footer>
        </Modal>
    )
}

export default CreateUserForm