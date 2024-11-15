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
import FormControlLabel from '@mui/material/FormControlLabel'
import Checkbox from '@mui/material/Checkbox'

const flowOptions = [
    { label: "none", value: "none" },
    { label: "xtls-rprx-vision", value: "xtls-rprx-vision" }
]

const CreateUser = ({ onClose, showForm }) => {
    const [hasError, setHasError] = useState(false)
    const [safu, setSafu] = useState(false)
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
    const [isMoreOptionClicked, setIsMoreOptionClicked] = useState([false, false, false, false])
    const [flowValue, setFlowValue] = useState({ label: "none", value: "none" })
    const [country, setCountry] = useState("")
    const [amneziaDays, setAmneziaDays] = useState(null)
    const [isLoadingProtocols, setIsLoadingProtocols] = useState(false)
    const [availableInbounds, setAvailableInbounds] = useState({})
    const [selectedInbounds, setSelectedInbounds] = useState({})
    const [isIpLimitDisabled, setIsIpLimitDisabled] = useState(false)
    const [isDataLimitDisabled, setIsDataLimitDisabled] = useState(false)
    const [ipLimitValue, setIpLimitValue] = useState("")
    const [dataLimitValue, setDataLimitValue] = useState("")
    const [expireInputType, setExpireInputType] = useState("number")

    const createUserOnServer = async (
        username, data_limit, expire, country,desc,ip_limit
    ) => {
        setCreateMode(true)
        var protocols = selectedProtocols.filter(x => typeof x === "string")
        var flow_status = flowValue.value;
        ip_limit = parseInt(ip_limit)

        const res = await axios.post("/create_user", { username, expire, data_limit, country, access_token, protocols, flow_status,desc,safu,inbounds:selectedInbounds,ip_limit })

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
        setIsMoreOptionClicked([false, false, false, false]);

        const getProtocols = async () => {
            setFlowValue({ label: "none", value: "none" })
            setIsLoadingProtocols(true)
            // setIpLimitValue("")
            // setDataLimitValue("")
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
                setIsIpLimitDisabled(false)
                setIsDataLimitDisabled(false)
                setIpLimitValue("")
                setDataLimitValue("")

                return;
            }


            if(!panelInboundsObj.panel_type || panelInboundsObj.panel_type === "MZ")
            {
                setIsIpLimitDisabled(true)
                setIsDataLimitDisabled(false)
                setIpLimitValue(2)
                setDataLimitValue("")
                setExpireInputType("number")
            }

            else if(panelInboundsObj.panel_type === "AMN")
            {
                setIsDataLimitDisabled(true)
                setIsIpLimitDisabled(true)
                setDataLimitValue(10000)
                setIpLimitValue(1)
                setExpireInputType("expire_selection")
            }

            delete panelInboundsObj.panel_type;

            const availableProtocolsName = Object.keys(panelInboundsObj);
            console.log(availableProtocolsName)
            setSelectedProtocols(availableProtocolsName)
            const updatedProtocols = protocols.map((protocol) => ({
                name: protocol.name,
                disabled: !availableProtocolsName.includes(protocol.name),
            }))
            setProtocols(updatedProtocols)
            setAvailableInbounds(panelInboundsObj)
            setSelectedInbounds
            ({
                vmess: panelInboundsObj.vmess && panelInboundsObj.vmess.map((inbound) => inbound.tag),
                vless: panelInboundsObj.vless &&  panelInboundsObj.vless.map((inbound) => inbound.tag),
                trojan: panelInboundsObj.trojan && panelInboundsObj.trojan.map((inbound) => inbound.tag),
                shadowsocks: panelInboundsObj.shadowsocks && panelInboundsObj.shadowsocks.map((inbound) => inbound.tag)
            })
            setIsLoadingProtocols(false)

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
        setAmneziaDays(null)
        setExpireInputType("number")
        setSafu(false)
        setIsIpLimitDisabled(false)
        setIsDataLimitDisabled(false)
        setIpLimitValue("")
        setDataLimitValue("")
        
    }, [showForm])

    const handleSubmitForm = () => {
        const username = document.getElementById("username").value
        const data_limit = document.getElementById("dataLimit").value
        const expire = expireInputType == "number" ? document.getElementById("daysToExpire").value : amneziaDays
        const country = document.querySelectorAll(".MuiSelect-nativeInput")[0].value
        const desc = document.getElementById("desc").value
        const ip_limit = document.getElementById("ipLimit").value
        createUserOnServer(username, data_limit, expire, country,desc,ip_limit)
    }


    const handle_safu_change = (e) => {
        setSafu(e.target.checked)
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


    const handleClickMoreOption = (e,index) => {
        e.stopPropagation()
        setIsMoreOptionClicked((prev) => {
            const updated = prev.map((item, i) => {
                if (i === index) {
                    return !item
                }
                return false
            })
            return updated
        })

    }

    const handleSelectFlow = (flow) => {
        setFlowValue(flow)
    }

    const handleSelectInbound = (event,protocol,tag) => {

        event.stopPropagation()
        setSelectedInbounds((prev) => {
            const updated = { ...prev }
            if (updated[protocol.name].includes(tag)) {
                updated[protocol.name] = updated[protocol.name].filter((item) => item !== tag)
            } else {
                updated[protocol.name].push(tag)
            }
            console.log(updated)
            return updated
        })

    }

    const formFields = [
        { label: "Username", type: "text", id: "username", name: "username" },
        { label: "Data Limit", type: "create_user_number", id: "dataLimit", name: "dataLimit", disabled: isDataLimitDisabled, value:dataLimitValue, onChange: (e) => setDataLimitValue(e.target.value) },
        { label: "Ip Limit", type: "create_user_number", id: "ipLimit", name: "ipLimit", disabled: isIpLimitDisabled, value:ipLimitValue, onChange: (e) => setIpLimitValue(e.target.value) },
        { label: "Days To Expire", type: expireInputType, id: "daysToExpire", name: "daysToExpire" , onChange: setAmneziaDays, value: amneziaDays},
        { label: "Country", type: "multi-select2", id: "country", name: "country", onChange: setCountry },
        { label: "Description", type: "text", id: "desc", name: "desc" },
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
                                                defaultValue={field.defaultValue}
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
                                                defaultValue={group.defaultValue}
                                                onChange={group.onChange}
                                                placeholder={group.placeholder}
                                            />
                                        )}
                                    </div>
                                ))}

                            <FormControlLabel
                                control={<Checkbox id="safu" name="safu"
                                    defaultChecked={false} onChange={handle_safu_change}
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
                                                                        protocol.name === "shadowsocks" ? "Fast, but not efficient as others" : ""

                                                        }</p>
                                                    </div>
                                                    {selectedProtocols.includes(protocol.name) && <Button className="gray-100" onClick={(e) => handleClickMoreOption(e,index)}>
                                                        <ThreeDotsIcon /></Button>}
                                                </div>
                                                <AnimatePresence>
                                                    {selectedProtocols.includes(protocol.name) && isMoreOptionClicked[index] && (
                                                        <motion.div
                                                            className={styles['more-options']}
                                                            initial={{ height: 0 }}
                                                            animate={{ height: "auto" }}
                                                            exit={{ height: 0 }}
                                                        >


                                                        {
                                                            availableInbounds[protocol.name] && availableInbounds[protocol.name].length > 0 && (
                                                                availableInbounds[protocol.name].map((inbound, index) => (
                                                                    <div key={index} className='flex items-center gap-1' onClick={(e) => handleSelectInbound(e,protocol,inbound.tag)}  style={{height:'10px',marginTop:"10px"}} >
                                                                    <FormControlLabel
                                                                        control={<Checkbox id={inbound.tag.replaceAll(" ", "-")}
                                                                             name={inbound.tag}
                                                                            sx={{
                                                                                marginLeft: "-9px",
                                                                                marginRight: "-9px",
                                                                                '& .MuiSvgIcon-root': { fontSize: 17 }
                                                                            }}
                                                                            checked={selectedInbounds[protocol.name].includes(inbound.tag)}
                                                                            
                                                                            
                                                                            />}
                                                                         /> <div className={`${selectedInbounds[protocol.name].includes(inbound.tag)?"":"striked_text"} inbound_tag`}>{inbound.tag}</div>
                                                                    </div>
                                                                ))
                                                            )
                                                        }
                                                            {
                                                            protocol.name === "vless" && (
                                                            <div className='flex flex-col gap-1.5' style={{ paddingTop: "1rem" }}>
                                                                <h6 style={{ fontWeight: 400 }}>Flow</h6>
                                                                <Dropdown options={flowOptions} onChange={handleSelectFlow} value={flowValue} />
                                                            </div>
                                                            )}
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