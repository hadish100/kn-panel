import React, { useState } from 'react'
import Button from "../../components/Button"
import MessageCard from "../../components/MessageCard"
import ErrorCard from '../../components/ErrorCard'
import { ReactComponent as Dldb } from '../../assets/svg/dldb.svg'
import { ReactComponent as XMarkIcon } from '../../assets/svg/x-mark.svg'
import axios from 'axios'
import Modal from '../../components/Modal'
import LeadingIcon from '../../components/LeadingIcon'
import { AnimatePresence } from 'framer-motion'

const AdminHomePage = ({ setLocation }) => {
    const [showManageDatabases, setShowManageDatabases] = useState(false)
    const [showCard, setShowCard] = useState(false)
    const [error_msg, setError_msg] = useState("")
    const [hasError, setHasError] = useState(false)

    const handleBC = async () => {
        setShowCard(true)
        const access_token = sessionStorage.getItem("access_token")
        var res = await axios.post("/dldb", { access_token })
        if (res.data.status === "ERR") {
            setError_msg(res.data.msg)
            setHasError(true)
            setShowCard(false)
            return
        }
        const downloadUrl = window.location.protocol + "//" + window.location.host + res.data.split(">")[1]
        console.log(downloadUrl)
        const link = document.createElement("a")
        link.href = downloadUrl
        link.download = "db.zip"
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        setShowCard(false)
    }

    return (
        <>
            <Button onClick={() => setShowManageDatabases(true)} className="outlined" >
                <Dldb /> Manage databases
            </Button>

            <AnimatePresence>
                {showManageDatabases && <Modal onClose={() => setShowManageDatabases(false)} width={"30rem"}>
                    <header className="modal__header">
                        <LeadingIcon>
                            <Dldb />
                        </LeadingIcon>
                        <h1 className="modal__title">Manage databases</h1>
                        <div className="close-icon" onClick={() => setShowManageDatabases(false)}>
                            <XMarkIcon />
                        </div>
                    </header>
                    <main className='modal__body flex gap-1.5'>
                        <Button onClick={handleBC} className="primary w-full" >Backup</Button>
                        <Button className="primary w-full" >Restore</Button>
                    </main>
                </Modal>}
            </AnimatePresence>

            <MessageCard
                title="fetching databases"
                duration={JSON.parse(sessionStorage.getItem("panels")).length}
                showCard={showCard}
                onClose={() => setShowCard(false)}
            />

            <ErrorCard
                hasError={hasError}
                setHasError={setHasError}
                errorTitle="ERROR"
                errorMessage={error_msg}
            />
        </>

    )
}

export default AdminHomePage