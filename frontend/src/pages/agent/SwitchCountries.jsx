import React, { useState, useEffect } from 'react'

import Modal from '../../components/Modal'
import LeadingIcon from '../../components/LeadingIcon'
import { ReactComponent as XMarkIcon } from '../../assets/svg/x-mark.svg'
import { ReactComponent as SwitchIcon } from '../../assets/svg/switch.svg'
import { ReactComponent as ArrowRightIcon } from '../../assets/svg/arrow-right.svg'
import { AnimatePresence } from 'framer-motion'
import Button from '../../components/Button'
import FormField from '../../components/form/FormField'

const SwitchCountries = ({ onClose, showModal }) => {
    const [originCountry, setOriginCountry] = useState("")
    const [destinationCountry, setDestinationCountry] = useState("")

    useEffect(() => {
        if (!showModal) {
            setDestinationCountry("")
            setOriginCountry("")
        }
    }, [showModal])

    return (
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
                    <Button className="primary w-full" disabled={(originCountry === destinationCountry) || (!originCountry) || (!destinationCountry)}>Switch</Button>
                </footer>
            </Modal>)}
        </AnimatePresence>
    )
}

export default SwitchCountries