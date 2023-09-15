import React, { useState, useEffect } from 'react'
import axios from 'axios'

import Modal from '../../components/Modal'
import LeadingIcon from '../../components/LeadingIcon'
import { ReactComponent as XMarkIcon } from '../../assets/svg/x-mark.svg'
import { ReactComponent as SwitchIcon } from '../../assets/svg/switch.svg'
import { ReactComponent as ArrowRightIcon } from '../../assets/svg/arrow-right.svg'
import { AnimatePresence } from 'framer-motion'
import Button from '../../components/Button'
import FormField from '../../components/form/FormField'
import ErrorCard from '../../components/ErrorCard'

const SwitchCountries = ({ onClose, showModal }) => {
    const [originCountry, setOriginCountry] = useState("")
    const [destinationCountry, setDestinationCountry] = useState("")
    const [isSwitching, setIsSwitching] = useState(false)
    const [hasError, setHasError] = useState(false)
    const [error_msg, setError_msg] = useState("failed to switch countries")

    const access_token = sessionStorage.getItem("access_token")

    useEffect(() => {
        if (!showModal) {
            setDestinationCountry("")
            setOriginCountry("")
        }
    }, [showModal])

    const handleClickSwitch = async () => {
        setIsSwitching(true)
        const switchReq = (await axios.post("/switch_countries", { access_token, country_from: originCountry, country_to: destinationCountry })).data
        if (switchReq.status === "ERR") {
            setError_msg(switchReq.msg)
            setHasError(true)
            setIsSwitching(false)
            return
        }
        setIsSwitching(false)
        onClose()
    }


    return (
        <>
            <AnimatePresence>
                {showModal && (<Modal width={"30rem"} onClose={onClose}>
                    <header className="modal__header">
                        <LeadingIcon>
                            <SwitchIcon />
                        </LeadingIcon>
                        <h1 className="modal__title">Switch countries for all users</h1>
                        <div className="close-icon" onClick={onClose}>
                            <XMarkIcon />
                        </div>
                    </header>
                    <main className='modal__body flex items-start gap-1'>
                        <FormField
                            label='from'
                            type='multi-select2'
                            id="from"
                            onChange={setOriginCountry}
                        />
                        <div className='flex items-end align-self-end' style={{ width: "100px", marginBottom: "-5.5px" }}>
                            <ArrowRightIcon style={{ display: "flex", strokeWidth: "1px" }} />
                        </div>
                        <FormField
                            label='to'
                            type='multi-select2'
                            id="from"
                            onChange={setDestinationCountry}
                        />
                    </main>
                    <footer className='modal__footer'>
                        <Button className="primary w-full"
                            disabled={(originCountry === destinationCountry) || (!originCountry) || (!destinationCountry) || isSwitching}
                            onClick={handleClickSwitch}
                        >
                            {isSwitching ? "Switching..." : "Switch"}</Button>
                    </footer>
                </Modal>)}
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

export default SwitchCountries