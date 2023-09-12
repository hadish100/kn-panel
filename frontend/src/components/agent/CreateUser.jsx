import React, { useEffect, useState } from 'react'
import axios from "axios"

import { ReactComponent as AddUserIcon } from "../../assets/svg/add-user.svg"
import ErrorCard from '../ErrorCard'
import styles from "./CreateUser.module.css"
import Modal from '../Modal'
import { motion, AnimatePresence } from 'framer-motion'
import LeadingIcon from '../LeadingIcon'
import { ReactComponent as XMarkIcon } from '../../assets/svg/x-mark.svg'
import { ReactComponent as ThreeDotsIcon } from '../../assets/svg/three-dots.svg'
import { ReactComponent as SpinnerIcon } from '../../assets/svg/spinner.svg'
import FormField from '../form/FormField'
import Button from '../Button'
import Dropdown from '../Dropdown'

const flowOptions = [
    { label: "none", value: "none" },
    { label: "xtls-rprx-vision", value: "xtls-rprx-vision" }
]

const CreateUser = ({ onClose, showForm }) => {
    const [hasError, setHasError] = useState(false)
    const [error_msg, setError_msg] = useState("failed to create user")
    const access_token = sessionStorage.getItem("access_token")
    const [createMode, setCreateMode] = useState(false)
    const [selectedProtocols, setSelectedProtocols] = useState([])
    const [protocols, setProtocols] = useState([
        { name: "vmess", disabled: true },
        { name: "vless", disabled: true },
        { name: "trojan", disabled: true },
        { name: "shadowsocks", disabled: true }
    ])
    const [isMoreOptionClicked, setIsMoreOptionClicked] = useState(false)
    const [flowValue, setFlowValue] = useState({ label: "none", value: "none" })

    const createUserOnServer = async (
        username, data_limit, expire, country
    ) => {
        setCreateMode(true)
        var protocols = selectedProtocols.filter(x=> typeof x === "string")
        var flow_status = flowValue.value;
        const res = await axios.post("/create_user", { username, expire, data_limit, country, access_token , protocols , flow_status })

        if (res.data.status === "ERR") {
            setError_msg(res.data.msg || "Failed to create user (BAD REQUEST)")
            setHasError(true)
        } else {
            const users = (await axios.post("/get_users", { access_token })).data
            if (users.status === "ERR") {
                setError_msg(users.msg)
                setHasError(true)
                setCreateMode(false)
                return
            }
            const agent = (await axios.post("/get_agent", { access_token })).data
            if (agent.status === "ERR") {
                setError_msg(agent.msg)
                setHasError(true)
                setCreateMode(false)
                return
            }
            sessionStorage.setItem("users", JSON.stringify(users.obj_arr))
            sessionStorage.setItem("agent", JSON.stringify(agent))
            onClose()
        }
        setCreateMode(false)
    }

    useEffect(() => {
        const getProtocols = async () => {
            setIsLoadingProtocols(true)
            const availableProtocolsName = (await axios.post("/get_panel_inbounds", { access_token, country })).data
            setSelectedProtocols(availableProtocolsName)
            const updatedProtocols = protocols.map((protocol) => ({
                name: protocol.name,
                disabled: !availableProtocolsName.includes(protocol.name),
            }))
            setProtocols(updatedProtocols)
            setIsLoadingProtocols(false)
            if (availableProtocolsName.status === "ERR") {
                setError_msg(availableProtocolsName.msg)
                setHasError(true)
                return
            }
        }

        if (country) {
            getProtocols()
        }
    }, [country])

    useEffect(() => {
        setSelectedProtocols([])
        setProtocols([
            { name: "vmess", disabled: true },
            { name: "vless", disabled: true },
            { name: "trojan", disabled: true },
            { name: "shadowsocks", disabled: true }
        ])
        setCountry("")
    }, [showForm])

    const handleSubmitForm = () => {
        // Gather form data
        const username = document.getElementById("username").value
        const data_limit = document.getElementById("dataLimit").value
        const expire = document.getElementById("daysToExpire").value
        const country = document.querySelectorAll(".MuiSelect-nativeInput")[0].value
        // Send form data to backend
        createUserOnServer(username, data_limit, expire, country)
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

    const formFields = [
        { label: "Username", type: "text", id: "username", name: "username" },
        { label: "Data Limit", type: "number", id: "dataLimit", name: "dataLimit" },
        { label: "Days To Expire", type: "number", id: "daysToExpire", name: "daysToExpire" },
        { label: "Country", type: "multi-select2", id: "country", name: "country", onChange: setCountry }
    ]

    const primaryButtons = [
        { label: "Cancel", className: "outlined", onClick: onClose },
        { label: "Create User", className: "primary", onClick: handleSubmitForm, disabled: createMode, pendingText: "Creating..." }
    ]

    const formHeader = (
        <header className="modal__header">
            <LeadingIcon>
                <AddUserIcon />
            </LeadingIcon>
            <h1 className="modal__title">Create new user</h1>
            <div className="close-icon" onClick={onClose}>
                <XMarkIcon />
            </div>
        </header>
    )

    const formFooter = (
        <motion.footer className={`modal__footer`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ justifyContent: "flex-end" }}>
            <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
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
                                            return (<FormField
                                                key={index}
                                                label={field.label}
                                                type={field.type}
                                                id={field.id}
                                                name={field.name}
                                                animateDelay={rowIndex * 0.1}
                                                disabled={field.disabled}
                                                options={field.options}
                                                value={field.value}
                                                onChange={field.onChange}
                                                placeholder={field.placeholder}
                                            />)
                                        }) : (
                                            <FormField
                                                key={rowIndex}
                                                label={group.label}
                                                type={group.type}
                                                id={group.id}
                                                name={group.name}
                                                animateDelay={rowIndex * 0.1}
                                                disabled={group.disabled}
                                                options={group.options}
                                                value={group.value}
                                                onChange={group.onChange}
                                                placeholder={group.placeholder}
                                            />
                                        )}
                                    </div>
                                ))}
                            </form>
                            <div className={`${styles['protocols-section']} ${country ? "" : "blur-1"}`}>
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
                                                    {selectedProtocols.includes(protocol.name) && protocol.name === 'vless' && <Button className="gray-100" onClick={(e) => handleClickMoreOption(e)}><ThreeDotsIcon /></Button>}
                                                </div>
                                                <AnimatePresence>
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
                                                </AnimatePresence>
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

export default CreateUser