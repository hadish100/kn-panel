import React, { useState } from 'react'
import Button from "../../components/Button"
import MessageCard from "../../components/MessageCard"
import ErrorCard from '../../components/ErrorCard'
import { ReactComponent as DbIcon } from '../../assets/svg/db.svg'
import { ReactComponent as DbUpIcon } from '../../assets/svg/db-up.svg'
import { ReactComponent as XMarkIcon } from '../../assets/svg/x-mark.svg'
import axios from 'axios'
import Modal from '../../components/Modal'
import LeadingIcon from '../../components/LeadingIcon'
import { AnimatePresence } from 'framer-motion'
import '../../components/form/inputs/FileInput.css'

const AdminHomePage = ({ setLocation }) => {
    const [showManageDatabases, setShowManageDatabases] = useState(false)
    const [showBackupCard, setShowBackupCard] = useState(false)
    const [showRestoreCard, setShowRestoreCard] = useState(false)
    const [error_msg, setError_msg] = useState("")
    const [hasError, setHasError] = useState(false)
    const [selectedFile, setSelectedFile] = useState(null)

    const handleBC = async () => {
        setShowBackupCard(true)
        const access_token = sessionStorage.getItem("access_token")
        var res = await axios.post("/dldb", { access_token })
        if (res.data.status === "ERR") {
            setError_msg(res.data.msg)
            setHasError(true)
            setShowBackupCard(false)
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
        setShowBackupCard(false)
    }

    const handleFileChange = (e) => {
        setSelectedFile(e.target.files[0])
    }

    const handleUploadFile = async () => {
        // const access_token = sessionStorage.getItem("access_token")
        // const formData = new FormData()
        // formData.append("access_token", access_token)
        // formData.append("file", selectedFile)
        // axios.post("restore_db", formData,
        // ).then(res => {
        //     if (res.data.status === "ERR") {
        //         setError_msg(res.data.msg)
        //         setHasError(true)
        //         return
        //     }
        //     setShowRestoreCard(false)
        // })
        setShowRestoreCard(false)
        await new Promise(r => setTimeout(r, 300));
        setShowManageDatabases(false)
    }

    return (
        <>
            <Button onClick={() => setShowManageDatabases(true)} className="outlined" >
                <DbIcon /> Manage databases
            </Button>

            <AnimatePresence>
                {showManageDatabases && <Modal onClose={() => setShowManageDatabases(false)} width={"30rem"}>
                    <header className="modal__header">
                        <LeadingIcon>
                            <DbIcon />
                        </LeadingIcon>
                        <h1 className="modal__title">Manage databases</h1>
                        <div className="close-icon" onClick={() => setShowManageDatabases(false)}>
                            <XMarkIcon />
                        </div>
                    </header>
                    <main className='modal__body flex gap-1.5'>
                        <Button onClick={handleBC} className="primary w-full" >Backup</Button>
                        <Button onClick={() => setShowRestoreCard(true)} className="primary w-full" >Restore</Button>
                    </main>
                </Modal>}
            </AnimatePresence>

            <AnimatePresence>
                {showRestoreCard && <Modal onClose={() => setShowRestoreCard(false)} width={"30rem"}>
                    <header className="modal__header">
                        <LeadingIcon>
                            <DbUpIcon />
                        </LeadingIcon>
                        <h1 className="modal__title">Restore databases</h1>
                        <div className="close-icon" onClick={() => setShowRestoreCard(false)}>
                            <XMarkIcon />
                        </div>
                    </header>
                    <main className='modal__body flex gap-1.5' style={{ alignItems: "center" }}>
                        <input type='file' onChange={handleFileChange} className='primary w-full' />
                        <Button className="outlined w-full" onClick={handleUploadFile}>Upload</Button>
                    </main>
                </Modal>}
            </AnimatePresence>

            <MessageCard
                title="fetching databases"
                duration={JSON.parse(sessionStorage.getItem("panels")).length*4}
                showCard={showBackupCard}
                onClose={() => setShowBackupCard(false)}
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