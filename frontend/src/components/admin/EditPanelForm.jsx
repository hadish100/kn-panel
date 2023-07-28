import React from 'react'

import Modal from '../Modal'
import { motion, AnimatePresence } from "framer-motion"
import LeadingIcon from '../LeadingIcon'
import { ReactComponent as EditIcon } from '../../assets/svg/edit.svg'
import { ReactComponent as XMarkIcon } from '../../assets/svg/x-mark.svg'
import { ReactComponent as DeleteIcon } from "../../assets/svg/delete.svg"
import { ReactComponent as PowerIcon } from "../../assets/svg/power.svg"
import FormField from '../form/FormField'
import Button from '../Button'


const EditPanelForm = ({ onClose, showForm, onDeleteItem, item }) => {
    function power_panel(e) {
        e.stopPropagation();
    }

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
                        <FormField label="Name" type="text" id="name" name="name" animateDelay={0} defaultValue={item.panel_name} />
                        <FormField label="Username" type="text" id="username" name="username" animateDelay={0.1} defaultValue={item.panel_username} />
                        <FormField label="Password" type="text" id="password" name="password" animateDelay={0.2} defaultValue={item.panel_password} />
                        <FormField label="Panel Url" type="text" id="panel_url" name="panel_url" animateDelay={0.3} defaultValue={item.panel_url} />
                        <FormField label="Capacity" type="number" id="capacity" name="capacity" animateDelay={0.4} defaultValue={item.panel_user_max_count} />
                        <FormField label="Traffic" type="number" id="traffic" name="traffic" animateDelay={0.5} defaultValue={item.panel_traffic} />
                        <FormField label="Country" type="text" id="country" name="country" animateDelay={0.6} defaultValue={item.panel_country} />
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