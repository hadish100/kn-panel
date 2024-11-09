import React, { useState, useEffect, useRef } from 'react'
import axios from 'axios'

import { ReactComponent as EditIcon } from '../../assets/svg/edit.svg'
import { ReactComponent as DeleteIcon } from "../../assets/svg/delete.svg"
import { ReactComponent as PowerIcon } from "../../assets/svg/power.svg"
import { ReactComponent as RefreshIcon } from '../../assets/svg/refresh.svg'
import { ReactComponent as LockIcon } from '../../assets/svg/lock.svg'
import { ReactComponent as XMarkIcon } from '../../assets/svg/x-mark.svg'
import { ReactComponent as ThreeDotsIcon } from '../../assets/svg/three-dots.svg'
import { ReactComponent as SpinnerIcon } from '../../assets/svg/spinner.svg'
import Checkbox from '@mui/material/Checkbox'


import Button from '../Button'
import Modal from '../Modal'
import { motion, AnimatePresence } from 'framer-motion'
import LeadingIcon from '../LeadingIcon'
import styles from "./EditUser.module.css"
import FormField from '../form/FormField'
import Dropdown from '../Dropdown'
import FormControlLabel from '@mui/material/FormControlLabel'
import IOSSwitch from '../form/inputs/IOSSwitch'
import ErrorCard from '../ErrorCard'

const flowOptions = [
    { label: "none", value: "none" },
    { label: "xtls-rprx-vision", value: "xtls-rprx-vision" }
]

const EditUser = ({ onClose, showForm, onDeleteItem, item, onEditItem, onPowerItem, onResetItem, editMode, onUnlockItem }) => {
    const [selectedProtocols, setSelectedProtocols] = useState([])
    const [safu, setSafu] = useState((item && Boolean(item.safu)) || null)
    const [protocols, setProtocols] = useState([
        { name: "vmess", disabled: true },
        { name: "vless", disabled: true },
        { name: "trojan", disabled: true },
        { name: "shadowsocks", disabled: true }
    ])
    const [isMoreOptionClicked, setIsMoreOptionClicked] = useState(false)
    const [flowValue, setFlowValue] = useState({ label: "none", value: "none" })
    const [country, setCountry] = useState("")
    const [isLoadingProtocols, setIsLoadingProtocols] = useState(false)
    const [hasError, setHasError] = useState(false)
    const [error_msg, setError_msg] = useState("failed to switch countries")
    const [flag, setFlag] = useState(false)
    const [isDataLimitDisabled, setIsDataLimitDisabled] = useState(false)

    const access_token = sessionStorage.getItem("access_token")

    useEffect(() => {
        if (!showForm) {
            setIsMoreOptionClicked(false)
        }

       setSafu((item && Boolean(item.safu)) || null)

    }, [showForm])

    useEffect(() => {
        if (item) {
            const userProtocols = Object.keys(item.inbounds)
            setSelectedProtocols(userProtocols)
            setIsDataLimitDisabled(b2gb(item.data_limit) == 10000)
            setCountry(item.country)
            if (item.inbounds.vless) {
                setFlowValue({ label: item.inbounds.vless.flow, value: item.inbounds.vless.flow })
            }

        }
    }, [item])


    useEffect(() => {
        setIsMoreOptionClicked(false)

        const getProtocols = async () => {
            setFlowValue({ label: "none", value: "none" })
            setIsLoadingProtocols(true)
            const panelInboundsObj = (await axios.post("/get_panel_inbounds", { access_token, country })).data

            if (panelInboundsObj.status === "ERR") {
                setError_msg(panelInboundsObj.msg)
                setHasError(true)
                setIsLoadingProtocols(false)
                setProtocols([
                    { name: "vmess", disabled: true },
                    { name: "vless", disabled: true },
                    { name: "trojan", disabled: true },
                    { name: "shadowsocks", disabled: true }
                ])
                setSelectedProtocols([])
                return
            }
            const availableProtocolsName = Object.keys(panelInboundsObj);
            if ((item.country !== country) && !flag) {
                setSelectedProtocols(availableProtocolsName)
                setFlag(true)
            }
            setSelectedProtocols(selectedProtocols.filter((protocol) => availableProtocolsName.includes(protocol)))
            setProtocols(availableProtocolsName)
            const updatedProtocols = protocols.map((protocol) => ({
                name: protocol.name,
                disabled: !availableProtocolsName.includes(protocol.name),
            }))
            setProtocols(updatedProtocols)
            setIsLoadingProtocols(false)
        }

        if (item) {
            getProtocols()
        }
    }, [country])


    const formFields = [
        { label: "Username", type: "text", id: "username", name: "username", disabled: true },
        { label: "Data Limit", type: "number", id: "data_limit", name: "data_limit", disabled: isDataLimitDisabled },
        { label: "Ip Limit", type: "number", id: "ipLimit", name: "ipLimit", disabled: true },
        { label: "Days To Expire", type: "number", id: "expire", name: "expire" },
        { label: "Country", type: "multi-select2", id: "country", name: "country", onChange: setCountry, disabled: true },
        { label: "Description", type: "text", id: "desc", name: "desc" },
    ]

    const primaryButtons = [
        { label: "Cancel", className: "outlined", onClick: onClose },
        {
            label: "Edit User", className: "primary", onClick: () => onEditItem(
                item.id,
                document.getElementById("data_limit").value,
                document.getElementById("expire").value,
                document.getElementById("country").textContent,
                selectedProtocols,
                flowValue.value,
                document.getElementById("desc").value,
                safu
            ),
            disabled: editMode,
            pendingText: "Editing..."
        },
    ]

    const panel_type = (item && item.corresponding_panel_id == 948263502) ? "AMN" : "MZ"
    
    console.log(panel_type)

    const secondaryButtons = [
        { icon: <DeleteIcon />, type: "button", label: "Delete", className: "ghosted", onClick: (e) => onDeleteItem(e, item.username) },
        panel_type == "AMN"? { icon: <LockIcon />, type: "button", label: "Unlock Account", className: "ghosted", onClick: () => onUnlockItem(item.id) } :
        { icon: <RefreshIcon />, type: "button", label: "Reset Usage", className: "ghosted", onClick: () => onResetItem(item.id) },
        { icon: <PowerIcon />, type: "switch", label: "Power", className: "ghosted", onClick: (e) => onPowerItem(e, item.id, item.status) },
    ]

    const b2gb = (bytes) => {
        return (bytes / (2 ** 10) ** 3).toFixed(2)
    }

    const timeStampToDay = (timeStamp) => {
        const time = timeStamp - Math.floor(Date.now() / 1000)
        return Math.floor(time / 86400) + 1
    }

    const handle_safu_change = (e) => {
        setSafu(e.target.checked)
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

        if (field.id === "ipLimit") {
            return item["ip_limit"]
        }

        return item[field.id]
    }


    const handleSelectProtocol = (protocol) => {
        if (protocol.disabled) return
        const isProtocolSelected = selectedProtocols.includes(protocol.name)
        if (isProtocolSelected) {
            setSelectedProtocols(selectedProtocols.filter((item) => item !== protocol.name))
        } else {
            setSelectedProtocols([...selectedProtocols, protocol.name])
        }
    }


    const handleClickMoreOption = (e) => {
        e.stopPropagation()
        setIsMoreOptionClicked(!isMoreOptionClicked)
    }

    const handleSelectFlow = (flow) => {
        setFlowValue(flow)
    }

    const formHeader = (
        <header className="modal__header">
            <LeadingIcon>
                <EditIcon />
            </LeadingIcon>
            <h1 className="modal__title">Edit user</h1>
            <div className="close-icon" onClick={onClose}>
                <XMarkIcon />
            </div>
        </header>
    )

    const formFooter = (
        <motion.footer className={`modal__footer ${styles?.footer}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
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
                        //Boolean(!item.disable)
                        />
                    ) : null
                ))}
            </div>
            <div className={styles?.primaryButtons} style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
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
                    <Modal onClose={onClose} width="42rem">
                        {formHeader}
                        <main className={styles['modal__body']}>
                            <form className={styles['modal__form']}>
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
                                            />
                                        )}
                                    </div>
                                ))}

                            <FormControlLabel
                                control={<Checkbox id="safu" name="safu"
                                    defaultChecked={item.safu} onChange={handle_safu_change}
                                    sx={{marginLeft: "-9px",}}
                                    />}
                                label="Start after first use" />

                            </form>
                            <div className={`${styles['protocols-section']}`}>
                                <h4 className='flex items-center gap-1'>Porotocols {isLoadingProtocols && <span className="flex items-center spinner"><SpinnerIcon /></span>}</h4>
                                <div className={`${styles.protocols}`}>
                                    {protocols.map((protocol, index) => (
                                        <motion.div key={index}
                                            className={`${styles.protocol} ${selectedProtocols.includes(protocol.name) ? styles.selected : protocol.disabled ? styles.disabled : ''}`}
                                            onClick={() => handleSelectProtocol(protocol)}
                                        >
                                            <div className="flex justify-between flex-col w-full">
                                                <div className="flex justify-between">
                                                    <div className="flex flex-col gap-1.5">
                                                        <h5 className={styles['protocol__name']}>{protocol.name}</h5>
                                                        <p className={styles['protocol__description']}>{
                                                            protocol.name === "vmess" ? "Fast And Secure" :
                                                                protocol.name === "vless" ? "Lightweight, fast and secure" :
                                                                    protocol.name === "trojan" ? "Lightweight, secure and lightening fast" :
                                                                        protocol.name === "shadowsocks" ? "Fast and secure, but not efficient as others" : ""

                                                        }</p>
                                                    </div>
                                                    {/* {selectedProtocols.includes(protocol.name) && protocol.name === 'vless' && <Button className="gray-100" onClick={(e) => handleClickMoreOption(e)}><ThreeDotsIcon /></Button>} */}
                                                </div>
                                                {/* <AnimatePresence>
                                                    {selectedProtocols.includes(protocol.name) && protocol.name === 'vless' && isMoreOptionClicked && (
                                                        <motion.div
                                                            className={styles['more-options']}
                                                            initial={{ height: 0 }}
                                                            animate={{ height: "auto" }}
                                                            exit={{ height: 0 }}
                                                        >
                                                            <div className='flex flex-col gap-1.5' style={{ paddingTop: "1rem" }}>
                                                                <h6 style={{ fontWeight: 400 }}>Flow</h6>
                                                                <Dropdown options={flowOptions} onChange={handleSelectFlow} value={flowValue} />
                                                            </div>
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence> */}
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        </main>
                        {formFooter}
                    </Modal>
                )}
            </AnimatePresence>
            <ErrorCard
                hasError={hasError}
                setHasError={setHasError}
                errorTitle="ERROR"
                errorMessage={error_msg}
            />
        </>
    )
}

export default EditUser