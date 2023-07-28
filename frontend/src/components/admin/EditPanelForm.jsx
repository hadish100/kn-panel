import React, { useEffect } from 'react'

import Modal from '../Modal'
import { motion, AnimatePresence } from "framer-motion"
import LeadingIcon from '../LeadingIcon'
import { ReactComponent as EditIcon } from '../../assets/svg/edit.svg'
import { ReactComponent as XMarkIcon } from '../../assets/svg/x-mark.svg'
import { ReactComponent as DeleteIcon } from "../../assets/svg/delete.svg"
import { ReactComponent as PowerIcon } from "../../assets/svg/power.svg"
import Button from '../Button'


const EditPanelForm = ({ onClose, showForm, onDeleteItem, item }) => {
    function power_panel(e) {
        e.stopPropagation();
    }

    useEffect(() => {
        if (item) {
            document.getElementById("name").value = item.panel_name;
            document.getElementById("userName").value = item.panel_username;
            document.getElementById("password").value = item.panel_password;
            document.getElementById("panel_url").value = item.panel_url;
            document.getElementById("capacity").value = item.panel_user_max_count;
            document.getElementById("traffic").value = item.panel_traffic;
            document.getElementById("country").value = item.panel_country;
        }
    },);

    return (
        <AnimatePresence>
            {showForm && <Modal onClose={onClose}>
                <header className="modal__header">
                    <LeadingIcon>
                        <EditIcon />
                    </LeadingIcon>
                    <h1 className="modal__title">Edit panel</h1>
                    <div className="close-icon" onClick={onClose}>
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
                            <label className="modal__form__label" htmlFor="panel_url">Panel Url</label>
                            <input className="modal__form__input" type="text" id="panel_url" name="panel_url" />
                        </motion.div>

                        <motion.div className="modal__form__group" animate={{ x: 0, opacity: 1 }} initial={{ x: -40, opacity: 0 }} transition={{ delay: 0.4 }}>
                            <label className="modal__form__label" htmlFor="capacity">Capacity</label>
                            <input className="modal__form__input" type="number" id="capacity" name="capacity" />
                        </motion.div>

                        <motion.div className="modal__form__group" animate={{ x: 0, opacity: 1 }} initial={{ x: -40, opacity: 0 }} transition={{ delay: 0.5 }}>
                            <label className="modal__form__label" htmlFor="traffic">Traffic</label>
                            <input className="modal__form__input" type="number" id="traffic" name="traffic" />
                        </motion.div>

                        <motion.div className="modal__form__group" animate={{ x: 0, opacity: 1 }} initial={{ x: -40, opacity: 0 }} transition={{ delay: 0.6 }}>
                            <label className="modal__form__label" htmlFor="country">Country</label>
                            <input className="modal__form__input" type="text" id="country" name="country" />
                        </motion.div>
                    </form>
                </main>
                <motion.footer className="modal__footer" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <div style={{ marginRight: "auto", display: "flex" }}>
                        <Button onClick={(e) => onDeleteItem(e, item.id)} className="ghosted">
                            <DeleteIcon />
                        </Button>
                        <Button onClick={(e) => power_panel(e, item.id)} className="ghosted">
                            <PowerIcon />
                        </Button>
                    </div>
                    <Button className="outlined" onClick={onClose}>Cancel</Button>
                    <Button className="primary">Edit Panel</Button>
                </motion.footer>
            </Modal>}
        </AnimatePresence>
    )
}

export default EditPanelForm