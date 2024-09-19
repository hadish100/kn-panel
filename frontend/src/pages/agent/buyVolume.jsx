import React, { useState, useEffect } from 'react'
import axios from 'axios'

import Modal from '../../components/Modal'
import LeadingIcon from '../../components/LeadingIcon'
import { ReactComponent as XMarkIcon } from '../../assets/svg/x-mark.svg'
import { ReactComponent as CartIcon } from '../../assets/svg/cart.svg'
import { ReactComponent as ArrowRightIcon } from '../../assets/svg/arrow-right.svg'
import { AnimatePresence } from 'framer-motion'
import Button from '../../components/Button'
import FormField from '../../components/form/FormField'
import ErrorCard from '../../components/ErrorCard'
import zarinpalIcon from '../../assets/zarinpal.png'
import cryptoIcon from '../../assets/crypto.png'

const BuyVolume = ({ onClose, showModal }) => {
    const [volumeAmount, setVolumeAmount] = useState("")
    const [volumePrice, setVolumePrice] = useState("")
    const [isCheckingOut, setIsCheckingOut] = useState(false)
    const [hasError, setHasError] = useState(false)
    const [error_msg, setError_msg] = useState("failed to checkout")
    const [zarinpalChecked, setZarinpalChecked] = useState(false)
    const [nowpaymentsChecked, setNowpaymentsChecked] = useState(false)


    
    const access_token = sessionStorage.getItem("access_token")

    useEffect(() => {
        if (!showModal) {
            setVolumePrice("")
            setVolumeAmount("")
        }
    }, [showModal])

    const handleClickSwitch = async () => {
        setIsCheckingOut(true)
        const checkoutReq = (await axios.post("/checkout", { access_token, country_from: volumeAmount, country_to: volumePrice })).data
        if (checkoutReq.status === "ERR") {
            setError_msg(checkoutReq.msg)
            setHasError(true)
            setIsCheckingOut(false)
            return
        }
        setIsCheckingOut(false)
        onClose()
    }

    const handleZarinpalClick = () => {
        setZarinpalChecked(true)
        setNowpaymentsChecked(false)
    }

    const handleNowpaymentsClick = () => {
        setNowpaymentsChecked(true)
        setZarinpalChecked(false)
    }

    const handleVolumeAmountChange = (e) => {
        setVolumeAmount(e.target.value)
        setVolumePrice(e.target.value * 100)

    }



    return (
        <>
            <AnimatePresence>
                {showModal && (<Modal width={"30rem"} onClose={onClose}>
                    <header className="modal__header">
                        <LeadingIcon>
                            <CartIcon />
                        </LeadingIcon>
                        <h1 className="modal__title">Buy Volume</h1>
                        <div className="close-icon" onClick={onClose}>
                            <XMarkIcon />
                        </div>
                    </header>
                    <main className='modal__body flex items-start gap-1'>
                        <FormField
                            label='GB'
                            type='buy_volume'
                            id="volume_amount"
                            onChange={handleVolumeAmountChange}
                        />
                        <div className='flex items-end align-self-end' style={{ width: "50px", marginBottom: "-5.5px" }}>
                            <ArrowRightIcon style={{ display: "flex", strokeWidth: "1px" }} />
                        </div>
                        <FormField
                            label='IRR'
                            type='buy_volume'
                            id="volume_price"
                            disabled={true}
                            value={volumePrice}
                        />
                    </main>

                    <div className='flex flex-col' style={{ marginTop: "1rem" }}>

                        <label className="modal__form__label" >Payment Methods</label>
                        <div className='flex justify-around flex-row gap-1' style={{ justifyContent:"space-around",flexWrap:"wrap" }}>
                            <div onClick={()=>handleZarinpalClick()} className={`${zarinpalChecked?'payment_cards_selected':''} payment_cards flex justify-center items-center flex-row`} >
                            <img src={zarinpalIcon} alt="zarinpal" style={{ width: "50px", height: "50px", background:"white", opacity:"1", marginRight:"10px", padding: "0", marginBottom: '7px', marginTop: '7px', borderRadius: '100%'  }} />
                            <span>Zarinpal</span>
                            </div>

                            <div onClick={()=>handleNowpaymentsClick()} className={`${nowpaymentsChecked?'payment_cards_selected':''} payment_cards flex justify-center items-center flex-row`} >
                            <img src={cryptoIcon} alt="NOWPayments" style={{ width: "50px", height: "50px", background:"white", opacity:"1", marginRight:"10px", padding: "0", marginBottom: '7px', marginTop: '7px', borderRadius: '100%'  }} />
                            <span>NOWPayments</span>
                            </div>
                        
                        </div>
                    </div>


                    <footer className='modal__footer'>
                        <Button className="primary w-full"
                            disabled={!zarinpalChecked && !nowpaymentsChecked || isCheckingOut}
                            onClick={handleClickSwitch}
                        >
                            {isCheckingOut ? "Redirecting..." : "Checkout"}</Button>
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

export default BuyVolume