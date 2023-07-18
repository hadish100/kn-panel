import React from 'react'

import Modal from "../Modal";
import LeadingIcon from "../LeadingIcon";
import Button from "../Button";
import { ReactComponent as AddUserIcon } from "../../assets/svg/add-user.svg";
import { ReactComponent as XMarkIcon } from "../../assets/svg/x-mark.svg";
import { motion } from "framer-motion"
import "../agent/CreateUserForm.css"


const CreateUserForm = ({ handleClose }) => {
    return (
        <Modal onClose={handleClose} >
            <header className="modal__header">
                <LeadingIcon>
                    <AddUserIcon />
                </LeadingIcon>
                <h1 className="modal__title">Create new agent</h1>
                <div className="close-icon" onClick={handleClose}>
                    <XMarkIcon />
                </div>
            </header>
            <main className="modal__body">
                <form className="modal__form">
                    <motion.div className="modal__form__group" animate={{ x: 0, opacity: 1 }} initial={{ x: -40, opacity: 0 }}>
                        <label className="modal__form__label" htmlFor="name">Name</label>
                        <input className="modal__form__input" type="text" id="name" name="name" />
                    </motion.div>

                    <motion.div className="modal__form__group" animate={{ x: 0, opacity: 1 }} initial={{ x: -40, opacity: 0 }} transition={{ delay: 0.1 }}>
                        <label className="modal__form__label" htmlFor="userName">UserName</label>
                        <input className="modal__form__input" type="text" id="userName" name="userName" />
                    </motion.div>

                    <motion.div className="modal__form__group" animate={{ x: 0, opacity: 1 }} initial={{ x: -40, opacity: 0 }} transition={{ delay: 0.2 }}>
                        <label className="modal__form__label" htmlFor="password">Password</label>
                        <input className="modal__form__input" type="text" id="password" name="password" />
                    </motion.div>

                    <motion.div className="modal__form__group" animate={{ x: 0, opacity: 1 }} initial={{ x: -40, opacity: 0 }} transition={{ delay: 0.3 }}>
                        <label className="modal__form__label" htmlFor="volume">Volume</label>
                        <input className="modal__form__input" type="number" id="volume" name="volume" />
                    </motion.div>

                    <motion.div className="modal__form__group" animate={{ x: 0, opacity: 1 }} initial={{ x: -40, opacity: 0 }} transition={{ delay: 0.4 }}>
                        <label className="modal__form__label" htmlFor="min_vol">Minimum Volume</label>
                        <input className="modal__form__input" type="number" id="min_vol" name="min_vol" />
                    </motion.div>

                    <motion.div className="flex gap-16" animate={{ x: 0, opacity: 1 }} initial={{ x: -40, opacity: 0 }} transition={{ delay: 0.5 }}>
                        <div className="modal__form__group" >
                            <label className="modal__form__label" htmlFor="max_users">Maximum Users</label>
                            <input className="modal__form__input" type="number" id="max_users" name="max_users" />
                        </div>

                        <div className="modal__form__group">
                            <label className="modal__form__label" htmlFor="maxDays">MaxDays</label>
                            <input className="modal__form__input" type="number" id="maxDays" name="maxDays" />
                        </div>
                    </motion.div>

                    <motion.div className="flex gap-16" animate={{ x: 0, opacity: 1 }} initial={{ x: -40, opacity: 0 }} transition={{ delay: 0.6 }}>
                        <div className="modal__form__group">
                            <label className="modal__form__label" htmlFor="prefix">Prefix</label>
                            <input className="modal__form__input" type="text" id="prefix" name="prefix" />
                        </div>

                        <div className="modal__form__group">
                            <label className="modal__form__label" htmlFor="country">Country</label>
                            <input className="modal__form__input" type="text" id="country" name="country" />
                        </div>
                    </motion.div>
                </form>
            </main>
            <motion.footer className="modal__footer" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <Button className="outlined" onClick={handleClose}>Cancel</Button>
                <Button className="primary" onClick={handleClose}>Add Agent</Button>
            </motion.footer>
        </Modal>
    )
}

export default CreateUserForm