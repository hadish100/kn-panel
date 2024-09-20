import React, { useState } from 'react'

import { ReactComponent as EditIcon } from '../../assets/svg/edit.svg'
import { ReactComponent as DeleteIcon } from '../../assets/svg/delete.svg'
import { ReactComponent as LoginAsAgentIcon } from '../../assets/svg/LoginAsAgent.svg'
import { ReactComponent as DeathIcon } from '../../assets/svg/death.svg'
import { ReactComponent as ActiveIcon } from '../../assets/svg/active.svg'
import { ReactComponent as DisabledIcon } from '../../assets/svg/disabled.svg'
import { AnimatePresence, motion } from 'framer-motion'
import Modal from '../Modal'
import LeadingIcon from '../LeadingIcon'
import { ReactComponent as XMarkIcon } from '../../assets/svg/x-mark.svg'
import FormField from '../form/FormField'
import Button from '../Button'
import FormControlLabel from '@mui/material/FormControlLabel'
import IOSSwitch from '../form/inputs/IOSSwitch'
import styles from "./EditAgent.module.css"
import { pink } from '@mui/material/colors'
import Checkbox from '@mui/material/Checkbox'
import zarinpalIcon from '../../assets/zarinpal.png'
import cryptoIcon from '../../assets/crypto.png'

const EditAgent = ({ item, onClose, showForm, onDeleteItem, onPowerItem,onPowerItem2,onPowerItem3,onPowerItem4, onEditItem, onLoginItem, editMode,DeleteAllUsers,EnableAllUsers,DisableAllUsers,isEnablingAllUsers,isDeletingAllUsers,isDisablingAllUsers,showDeleteAllUsers,showEnableAllUsers,showDisableAllUsers,setShowDeleteAllUsers,setShowEnableAllUsers,setShowDisableAllUsers }) => {
    const [bmchecked, setBmChecked] = useState((item && Boolean(item.business_mode)) || null)
    const [zarinpalChecked, setZarinpalChecked] = useState((item && Boolean(item.gateway_status.zarinpal)) || null)
    const [nowpaymentsChecked, setNowpaymentsChecked] = useState((item && Boolean(item.gateway_status.nowpayments)) || null)

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
            { label: "GB to IRR Rate", type: "text", id: "vrate", name: "vrate" },
        ],
        { label: "Prefix", type: "text", id: "prefix", name: "prefix" },
        { label: "Country", type: "multi-select", id: "country", name: "country" },
    ]


    const primaryButtons = [
        { label: "Cancel", className: "outlined", onClick: () => { onClose(); reset_payment_checks() } },
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
                Number(bmchecked == null ? item.business_mode : bmchecked),
                document.getElementById("vrate").value,
                {zarinpal:zarinpalChecked==null?Number(item.gateway_status.zarinpal):Number(zarinpalChecked),nowpayments:nowpaymentsChecked==null?Number(item.gateway_status.nowpayments):Number(nowpaymentsChecked)}
            ),
            disabled: editMode,
            pendingText: "Editing...",
        },
    ]


    const secondaryButtons = [
        { icon: <DeleteIcon />, type: "button", label: "Delete", className: "ghosted", onClick: (e) => onDeleteItem(e, item.id) },
        { icon: <LoginAsAgentIcon />, type: "button", label: "Login", className: "ghosted", onClick: (e) => onLoginItem(e, item.username, item.password) },
    ]


    const reset_payment_checks = () => {
        setZarinpalChecked(null)
        setNowpaymentsChecked(null)
    }

    const b2gb = (bytes) => {
        return (bytes / (2 ** 10) ** 3).toFixed(2)
    }

    const timeStampToDay = (timeStamp) => {
        const time = timeStamp - Math.floor(Date.now() / 1000)
        return Math.floor(time / 86400) + 1
    }

    const handleBmChange = (event) => {
        setBmChecked(event.target.checked)
    }

    const handleZarinpalClick = () => {
        if(zarinpalChecked == null) 
        {
            setZarinpalChecked(!item.gateway_status.zarinpal)
            return
        }
        setZarinpalChecked(!zarinpalChecked)
    }

    const handleNowpaymentsClick = () => {
        if(nowpaymentsChecked == null) 
        {
            setNowpaymentsChecked(!item.gateway_status.nowpayments)
            return
        }
        setNowpaymentsChecked(!nowpaymentsChecked)
    }

    const check_zarinpal_gateway_status = () => {
        if(zarinpalChecked != null) return Boolean(zarinpalChecked)
        return Boolean(item.gateway_status.zarinpal)
    }

    const check_nowpayments_gateway_status = () => {
        if(nowpaymentsChecked != null) return Boolean(nowpaymentsChecked)
        return Boolean(item.gateway_status.nowpayments)
    }

    const getDefaultValue = (item, field) => {
        if (!item) {
            return ""
        }


        if (field.id === "expire") {
            return timeStampToDay(item[field.id])
        }

        if (field.id === "data_limit") {
            return b2gb(item[field.id])
        }

        if (field.id === "volume") {
            return b2gb(item[field.id])
        }



        return item[field.id]
    }

    const formHeader = (
        <header className="modal__header">
            <LeadingIcon><EditIcon /></LeadingIcon>
            <h1 className="modal__title">Edit agent</h1>
            <div className="close-icon" onClick={() => { onClose(); reset_payment_checks() }}>
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
        <>
            <AnimatePresence>
                {showForm && (
                    <Modal onClose={() => { onClose(); reset_payment_checks() }} width={"40rem"}>
                        {formHeader}
                        <main className="modal__body" style={{ marginBottom: ".5rem" }}>
                            <form className="modal__form">
                                {formFields.map((group, rowIndex) => (
                                    <div key={rowIndex} className={`flex gap-16 ${styles['modal__form__row']}`}>
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
                                                styles={styles}
                                            />)
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
                                                styles={styles}
                                            />
                                        )}
                                    </div>
                                ))}
                            </form>
                        </main>

                        <div className='flex flex-col' style={{ marginTop: "1rem" }}>

                        <label className="modal__form__label" >Payment Methods</label>
                        <div className='flex justify-around flex-row gap-1' style={{ justifyContent:"space-around",flexWrap:"wrap",marginBottom: "1rem" }}>
                            <div onClick={()=>handleZarinpalClick()} className={`${check_zarinpal_gateway_status()?'payment_cards_selected':''} payment_cards flex justify-center items-center flex-row`} >
                            <img src={zarinpalIcon} alt="zarinpal" style={{ width: "50px", height: "50px", background:"white", opacity:"1", marginRight:"10px", padding: "0", marginBottom: '7px', marginTop: '7px', borderRadius: '100%'  }} />
                            <span>Zarinpal</span>
                            </div>

                            <div onClick={()=>handleNowpaymentsClick()} className={`${check_nowpayments_gateway_status()?'payment_cards_selected':''} payment_cards flex justify-center items-center flex-row`} >
                            <img src={cryptoIcon} alt="NOWPayments" style={{ width: "50px", height: "50px", background:"white", opacity:"1", marginRight:"10px", padding: "0", marginBottom: '7px', marginTop: '7px', borderRadius: '100%'  }} />
                            <span>NOWPayments</span>
                            </div>
                           
                        </div>

                            <div className='flex justify-between flex-col gap-1' style={{ marginBottom: "1rem" }}>
                                <span className='w-full' style={{ border: "1px solid var(--border-clr)", borderRadius: "6px", padding: ".5rem" }}>
                                    Agent status :
                                    <FormControlLabel
                                        onClick={() => onPowerItem(item.id, item.disable)}
                                        control={<IOSSwitch sx={{ my: 1, mx: 2 }} checked={item ? Boolean(!item.disable) : false} />}
                                    />
                                </span>
                                <span className='w-full' style={{ border: "1px solid var(--border-clr)", borderRadius: "6px", padding: ".5rem" }}>
                                    <div>Create access : 
                                        <FormControlLabel
                                        onClick={() => onPowerItem2(item.id, !item.create_access)}
                                        control={<IOSSwitch sx={{ my: 1, mx: 2 }} checked={item ? Boolean(item.create_access) : false} />}
                                    />
                                    </div>
                                </span>
                                <span className='w-full' style={{ border: "1px solid var(--border-clr)", borderRadius: "6px", padding: ".5rem" }}>
                                    <div>Edit access : 
                                        <FormControlLabel
                                        onClick={() => onPowerItem3(item.id, !item.edit_access)}
                                        control={<IOSSwitch sx={{ my: 1, mx: 2 }} checked={item ? Boolean(item.edit_access) : false} />}
                                    />
                                    </div>
                                </span>
                                <span className='w-full' style={{ border: "1px solid var(--border-clr)", borderRadius: "6px", padding: ".5rem" }}>
                                    <div>Delete access : 
                                        <FormControlLabel
                                        onClick={() => onPowerItem4(item.id, !item.delete_access)}
                                        control={<IOSSwitch sx={{ my: 1, mx: 2 }} checked={item ? Boolean(item.delete_access) : false} />}
                                    />
                                    </div>
                                </span>
                            </div>

                            <div className={`flex ${styles['buttons-row']} agent_group_action_btns`}>
                                <Button className='outlined w-full' onClick={() => setShowDisableAllUsers(true)}><DisabledIcon />Disable all users</Button>
                                <Button className='outlined w-full' onClick={() => setShowEnableAllUsers(true)}><ActiveIcon />Enable all users</Button>
                            </div>
                            <div className="flex agent_group_action_btns">
                                <Button className="outlined w-full" onClick={() => setShowDeleteAllUsers(true)}><DeathIcon />Delete all users</Button>
                            </div>
                        </div>

                        <div className='flex gap-1.5 flex-row'>
                            <FormControlLabel
                                control={<Checkbox id="business-mode" name="business-mode"
                                    sx={{
                                        color: pink[800],
                                        marginLeft: "-9px",
                                        '&.Mui-checked': {
                                            color: pink[600],
                                        },
                                    }}
                                    defaultChecked={Boolean(item.business_mode)} onChange={handleBmChange} />}
                                label="Business Mode" />

                        </div>
                        {formFooter}
                    </Modal>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {showDeleteAllUsers && <Modal onClose={() => setShowDeleteAllUsers(false)} width={"35rem"}>
                    <header className="modal__header">
                        <LeadingIcon>
                            <DeathIcon />
                        </LeadingIcon>
                        <h1 className="modal__title">Delete all users</h1>
                        <div className="close-icon" onClick={() => setShowDeleteAllUsers(false)}>
                            <XMarkIcon />
                        </div>
                    </header>
                    <main className='modal__body flex gap-1.5'>
                        <Button onClick={() => setShowDeleteAllUsers(false)} className="outlined w-full" >Cancel</Button>
                        <Button onClick={() => DeleteAllUsers(item.id)} className="primary w-full" disabled={isDeletingAllUsers}>{isDeletingAllUsers ? "Deleting..." : "Delete"}</Button>
                    </main>
                </Modal>}
            </AnimatePresence>

            <AnimatePresence>
                {showDisableAllUsers && <Modal onClose={() => setShowDisableAllUsers(false)} width={"35rem"}>
                    <header className="modal__header">
                        <LeadingIcon>
                            <DisabledIcon />
                        </LeadingIcon>
                        <h1 className="modal__title">Disable all users</h1>
                        <div className="close-icon" onClick={() => setShowDisableAllUsers(false)}>
                            <XMarkIcon />
                        </div>
                    </header>
                    <main className='modal__body flex gap-1.5'>
                        <Button onClick={() => setShowDisableAllUsers(false)} className="outlined w-full" >Cancel</Button>
                        <Button onClick={() => DisableAllUsers(item.id)} className="primary w-full" disabled={isDisablingAllUsers}>{isDisablingAllUsers ? "Disabling..." : "Disable"}</Button>
                    </main>
                </Modal>}
            </AnimatePresence>

            <AnimatePresence>
                {showEnableAllUsers && <Modal onClose={() => setShowEnableAllUsers(false)} width={"35rem"}>
                    <header className="modal__header">
                        <LeadingIcon>
                            <ActiveIcon />
                        </LeadingIcon>
                        <h1 className="modal__title">Enable all users</h1>
                        <div className="close-icon" onClick={() => setShowEnableAllUsers(false)}>
                            <XMarkIcon />
                        </div>
                    </header>
                    <main className='modal__body flex gap-1.5'>
                        <Button onClick={() => setShowEnableAllUsers(false)} className="outlined w-full" >Cancel</Button>
                        <Button onClick={() => EnableAllUsers(item.id)} className="primary w-full" disabled={isEnablingAllUsers}>{isEnablingAllUsers ? "Enabling..." : "Enable"}</Button>
                    </main>
                </Modal>}
            </AnimatePresence>
        </>
    )
}

export default EditAgent