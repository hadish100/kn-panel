import React from 'react'

import { ReactComponent as EditIcon } from '../../assets/svg/edit.svg'
import { ReactComponent as DeleteIcon } from "../../assets/svg/delete.svg"
import { motion, AnimatePresence } from 'framer-motion'
import Modal from '../Modal'
import LeadingIcon from '../LeadingIcon'
import { ReactComponent as XMarkIcon } from '../../assets/svg/x-mark.svg';
import FormField from '../form/FormField';
import Button from '../Button';
import FormControlLabel from '@mui/material/FormControlLabel';
import IOSSwitch from '../../components/form/inputs/IOSSwitch';
import styles from './EditPanel.module.css'

const EditPanel = ({ onClose, showForm, onDeleteItem, item, onPowerItem, onEditItem, editMode }) => {

    const formFields = [
        { label: "Name", type: "text", id: "panel_name", name: "name" },
        { label: "Username", type: "text", id: "panel_username", name: "username" },
        { label: "Password", type: "text", id: "panel_password", name: "password" },
        { label: "Panel Url", type: "text", id: "panel_url", name: "panel_url", disabled: true },
        { label: "Capacity", type: "number", id: "panel_user_max_count", name: "capacity" },
        { label: "Traffic", type: "number", id: "panel_traffic", name: "traffic" },
        { label: "Country", type: "text", id: "panel_country", name: "country", disabled: true }
    ]

    const primaryButtons = [
        { label: "Cancel", className: "outlined", onClick: onClose },
        {
            label: "Edit Panel", className: "primary", onClick: () => onEditItem(
                item.id,
                document.getElementById("panel_name").value,
                document.getElementById("panel_username").value,
                document.getElementById("panel_password").value,
                document.getElementById("panel_url").value,
                document.getElementById("panel_user_max_count").value,
                document.getElementById("panel_traffic").value,
                document.getElementById("panel_country").value
            ),
            disabled: editMode
        },
    ]

    const secondaryButtons = [
        { icon: <DeleteIcon />, type: "button", label: "Delete", className: "ghosted", onClick: (e) => onDeleteItem(e, item.id) },
        { type: "switch", label: "Power", className: "ghosted", onClick: () => onPowerItem(item.id, item.disable) },
    ]

    const b2gb = (bytes) => {
        return (bytes / (2 ** 10) ** 3).toFixed(2);
    }

    const timeStampToDay = (timeStamp) => {
        const time = timeStamp - Math.floor(Date.now() / 1000)
        return Math.floor(time / 86400) + 1
    }

    const getDefaultValue = (item, field) => {
        if (!item) {
            return "";
        }


        if (field.id === "expire") {
            return timeStampToDay(item[field.id]);
        }

        if (field.id === "data_limit") {
            return b2gb(item[field.id]);
        }

        if (field.id === "volume") {
            return b2gb(item[field.id]);
        }



        return item[field.id];
    };

    const formFooter = (
        <motion.footer className={`modal__footer ${styles.footer}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: ".5rem" }}>
                {secondaryButtons?.map((button, index) => (
                    button.type === "button" ? (
                        <Button
                            key={index}
                            className={button.className}
                            onClick={button.onClick}
                            disabled={button.disabled}
                        >
                            {button.icon}
                        </Button>
                    ) : button.type === "switch" ? (
                        <FormControlLabel
                            key={index}
                            onClick={button.onClick}
                            control={<IOSSwitch sx={{ my: 1, mx: 2 }} checked={item ? Boolean(!item.disable) : false} />}
                        //Boolean(!item.disable)
                        />
                    ) : null
                ))}
            </div>
            <div className={styles.primaryButtons} style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                {primaryButtons.map((button, index) => (
                    <Button
                        key={index}
                        className={button.className}
                        onClick={button.onClick}
                    >
                        {button.label}
                    </Button>
                ))}
            </div>
        </motion.footer>
    )

    const formHeader = (
        <header className="modal__header">
            <LeadingIcon>
                <EditIcon />
            </LeadingIcon>
            <h1 className="modal__title">Edit panel</h1>
            <div className="close-icon" onClick={onClose}>
                <XMarkIcon />
            </div>
        </header>
    )


    return (
        <AnimatePresence>
            {showForm && (
                <Modal onClose={onClose} width={"40rem"}>
                    {formHeader}
                    <main className="modal__body">
                        <form className="modal__form">
                            {formFields.map((group, rowIndex) => (
                                <div key={rowIndex} className="flex gap-16">
                                    {Array.isArray(group) ? group.map((field, index) => {
                                        const defaultValue = getDefaultValue(item, field)

                                        return (<FormField
                                            key={index}
                                            label={field.label}
                                            type={field.type}
                                            id={field.id}
                                            name={field.name}
                                            animateDelay={rowIndex * 0.1}
                                            defaultValue={defaultValue}
                                            disabled={field.disabled}
                                            options={field.options}
                                            value={field.value}
                                            onChange={field.onChange}
                                            placeholder={field.placeholder}
                                            editValue={item ? item.country ? item.country.split(",") : "" : ""}
                                        />);
                                    }) : (
                                        <FormField
                                            key={rowIndex}
                                            label={group.label}
                                            type={group.type}
                                            id={group.id}
                                            name={group.name}
                                            animateDelay={rowIndex * 0.1}
                                            defaultValue={getDefaultValue(item, group)}
                                            disabled={group.disabled}
                                            options={group.options}
                                            value={group.value}
                                            onChange={group.onChange}
                                            placeholder={group.placeholder}
                                            editValue={item ? item.country ? item.country.split(",") : "" : ""}
                                        />
                                    )}
                                </div>
                            ))}
                        </form>
                    </main>
                    {formFooter}
                </Modal>
            )}
        </AnimatePresence>
    )
}

export default EditPanel