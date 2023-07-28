import React from 'react'

import Modal from '../Modal'
import { motion, AnimatePresence } from "framer-motion"
import LeadingIcon from '../LeadingIcon'
import { ReactComponent as EditIcon } from '../../assets/svg/edit.svg'
import { ReactComponent as XMarkIcon } from '../../assets/svg/x-mark.svg'
import Button from '../Button'


const EditAgentForm = ({ item, onClose, showForm, onDeleteItem }) => {
    return (
        <AnimatePresence>
            {showForm && <Modal onClose={onClose}>
                <header className="modal__header">
                    <LeadingIcon>
                        <EditIcon />
                    </LeadingIcon>
                    <h1 className="modal__title">Edit agent</h1>
                    <div className="close-icon" onClick={onClose}>
                        <XMarkIcon />
                    </div>
                </header>
                <main className="modal__body">
                    <form className="modal__form">
                        <motion.div className="modal__form__group" animate={{ x: 0, opacity: 1 }} initial={{ x: -40, opacity: 0 }}>
                            <label className="modal__form__label" htmlFor="name">Name</label>
                            <input className="modal__form__input" value="test" type="text" id="name" name="name" />
                        </motion.div>

                        <motion.div className="modal__form__group" animate={{ x: 0, opacity: 1 }} initial={{ x: -40, opacity: 0 }} transition={{ delay: 0.1 }}>
                            <label className="modal__form__label" htmlFor="userName">UserName</label>
                            <input className="modal__form__input" type="text" id="userName" name="userName" />
                        </motion.div>

                        <motion.div className="modal__form__group" animate={{ x: 0, opacity: 1 }} initial={{ x: -40, opacity: 0 }} transition={{ delay: 0.2 }}>
                            <label className="modal__form__label" htmlFor="password">New Password</label>
                            <input className="modal__form__input" type="text" id="password" name="password" />
                        </motion.div>


                        <motion.div className="flex gap-16" animate={{ x: 0, opacity: 1 }} initial={{ x: -40, opacity: 0 }} transition={{ delay: 0.3 }}>
                            <div className="modal__form__group" >
                                <label className="modal__form__label" htmlFor="volume">Volume</label>
                                <input className="modal__form__input" type="number" id="volume" name="volume" />
                            </div>

                            <div className="modal__form__group">
                                <label className="modal__form__label" htmlFor="min_vol">Minimum Volume</label>
                                <input className="modal__form__input" type="number" id="min_vol" name="min_vol" />
                            </div>
                        </motion.div>

                        <motion.div className="flex gap-16" animate={{ x: 0, opacity: 1 }} initial={{ x: -40, opacity: 0 }} transition={{ delay: 0.4 }}>
                            <div className="modal__form__group" >
                                <label className="modal__form__label" htmlFor="max_users">Maximum Users</label>
                                <input className="modal__form__input" type="number" id="max_users" name="max_users" />
                            </div>

                            <div className="modal__form__group">
                                <label className="modal__form__label" htmlFor="maxDays">MaxDays</label>
                                <input className="modal__form__input" type="number" id="maxDays" name="maxDays" />
                            </div>
                        </motion.div>

                        <motion.div className="flex gap-16" animate={{ x: 0, opacity: 1 }} initial={{ x: -40, opacity: 0 }} transition={{ delay: 0.5 }}>
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
                    <Button className="outlined" onClick={onClose}>Cancel</Button>
                    <Button className="primary">Edit agent</Button>
                </motion.footer>
            </Modal>}
        </AnimatePresence>
    )
}

export default EditAgentForm