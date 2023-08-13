import React, { useRef } from 'react'

import { ReactComponent as EditIcon } from '../../assets/svg/edit.svg'
import { ReactComponent as DeleteIcon } from '../../assets/svg/delete.svg'
import { ReactComponent as LoginAsAgentIcon } from '../../assets/svg/LoginAsAgent.svg'
import { AnimatePresence, motion } from 'framer-motion'
import Modal from '../Modal';
import LeadingIcon from '../LeadingIcon';
import { ReactComponent as XMarkIcon } from '../../assets/svg/x-mark.svg';
import FormField from '../form/FormField';
import Button from '../Button';
import FormControlLabel from '@mui/material/FormControlLabel';
import IOSSwitch from '../form/inputs/IOSSwitch';
import styles from "./EditAgent.module.css"

const EditAgent = ({ item, onClose, showForm, onDeleteItem, onPowerItem, onEditItem, onLoginItem, editMode }) => {
    const businessModeRef = useRef(null)


    const formFields = [
        { label: "Name", type: "text", id: "name", name: "name" },
        { label: "Username", type: "text", id: "username", name: "username" },
        { label: "Password", type: "text", id: "password", name: "password" },
        [
            { label: "Volume", type: "value-adjuster", id: "volume", name: "volume" },
            { label: "Minimum Volume", type: "number", id: "min_vol", name: "min_vol" },
        ],
        [
            { label: "Maximum Users", type: "number", id: "max_users", name: "max_users" },
            { label: "Max Days", type: "number", id: "max_days", name: "maxDays" },
        ],
        [
            { label: "Max Non-Active Days", type: "number", id: "max_non_active_days", name: "max_non_active_days" },
            { label: "Prefix", type: "text", id: "prefix", name: "prefix" },
        ],
        { label: "Country", type: "multi-select", id: "country", name: "country" },
    ]


    const primaryButtons = [
        { label: "Cancel", className: "outlined", onClick: onClose },
        {
            label: "Edit Agent", className: "primary", onClick: () => onEditItem(
                item.id,
                document.getElementById("name").value,
                document.getElementById("username").value,
                document.getElementById("password").value,
                document.getElementById("volume").value,
                document.getElementById("min_vol").value,
                document.getElementById("max_users").value,
                document.getElementById("max_days").value,
                document.getElementById("prefix").value,
                document.querySelectorAll(".MuiSelect-nativeInput")[0].value,
                document.getElementById("max_non_active_days").value,
                businessModeRef.current.checked,
            ),
            disabled: editMode,
            pendingText: "Editing...",
        },
    ]


    const secondaryButtons = [
        { icon: <DeleteIcon />, type: "button", label: "Delete", className: "ghosted", onClick: (e) => onDeleteItem(e, item.id) },
        { icon: <LoginAsAgentIcon />, type: "button", label: "Login", className: "ghosted", onClick: (e) => onLoginItem(e, item.username, item.password) },
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

    const formHeader = (
        <header className="modal__header">
            <LeadingIcon><EditIcon /></LeadingIcon>
            <h1 className="modal__title">Edit agent</h1>
            <div className="close-icon" onClick={onClose}>
                <XMarkIcon />
            </div>
        </header>
    )


    const formFooter = (
        <motion.footer className={`modal__footer ${styles.footer}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: ".5rem" }}>
                {secondaryButtons?.map((button, index) => (
                    button.type === "button" ? (
                        <Button
                            key={index}
                            className={button.className}
                            onClick={button.onClick}
                        >
                            {button.icon}
                        </Button>
                    ) : button.type === "switch" ? (
                        <FormControlLabel
                            key={index}
                            onClick={button.onClick}
                            control={<IOSSwitch sx={{ my: 1, mx: 2 }} checked={item ? Boolean(!item.disable) : false} />}
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
                        disabled={button.disabled}
                    >
                        {button.disabled ? button.pendingText : button.label}
                    </Button>
                ))}
            </div>
        </motion.footer>
    )

    return (
        <AnimatePresence>
            {showForm && (
                <Modal onClose={onClose} width={"40rem"}>
                    {formHeader}
                    <main className="modal__body" style={{ marginBottom: ".5rem" }}>
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
                    <div className='flex gap-1.5 flex-row' style={{ marginTop: "1rem" }}>
                        <input ref={businessModeRef} type="checkbox" id="business-mode" name="business-mode" defaultChecked={Boolean(item.business_mode)} value={Boolean(item.business_mode)} />
                        <label htmlFor="business-mode">Business Mode</label>
                    </div>
                    {formFooter}
                </Modal>
            )}
        </AnimatePresence>
    )
}

export default EditAgent