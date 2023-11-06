import React, { useState } from 'react'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import dayjs from 'dayjs'

import Button from "../../components/Button"
import MessageCard from "../../components/MessageCard"
import ErrorCard from '../../components/ErrorCard'
import { ReactComponent as DbIcon } from '../../assets/svg/db.svg'
import { ReactComponent as DbUpIcon } from '../../assets/svg/db-up.svg'
import { ReactComponent as XMarkIcon } from '../../assets/svg/x-mark.svg'
import { ReactComponent as GraphBarIcon } from "../../assets/svg/graph-bar.svg"
import { ReactComponent as UsersIcon } from "../../assets/svg/users.svg"

import axios from 'axios'
import Modal from '../../components/Modal'
import LeadingIcon from '../../components/LeadingIcon'
import { AnimatePresence } from 'framer-motion'
import '../../components/form/inputs/FileInput.css'
import "../../components/agent/UsageStats.css"
import { LineChart } from '@mui/x-charts/LineChart'
import styles from "../../pages/admin/AdminHomePage.module.css"
import Dropdown from '../../components/Dropdown'

const AdminHomePage = ({ setLocation }) => {
    const [showManageDatabases, setShowManageDatabases] = useState(false)
    const [showBackupCard, setShowBackupCard] = useState(false)
    const [showRestoreCard, setShowRestoreCard] = useState(false)
    const [error_msg, setError_msg] = useState("")
    const [fileName, setFileName] = useState("Choose File")
    const [hasError, setHasError] = useState(false)
    const [isUploadBtnDisabled, setIsUploadBtnDisabled] = useState(false)
    const [selectedFile, setSelectedFile] = useState(null)
    const [xAxisDays1, setXAxisDays1] = useState({ label: "7 days", value: 7 })

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
        setFileName(e.target.files[0].name)
    }

    const fakeUlBtnClick = () => {
        document.getElementById("uldb").click()
    }

    const handleUploadFile = async () => {

        setIsUploadBtnDisabled(true)
        const access_token = sessionStorage.getItem("access_token")
        const formData = new FormData()
        formData.append("access_token", access_token)
        formData.append("file", selectedFile)
        var res = await axios.post("/uldb", formData)
        if (res.data.status === "ERR") {
            setError_msg(res.data.msg)
            setHasError(true)
            setIsUploadBtnDisabled(false)
            return
        }
        setIsUploadBtnDisabled(false)
        setShowRestoreCard(false)
        await new Promise(r => setTimeout(r, 300))
        setShowManageDatabases(false)
        await new Promise(r => setTimeout(r, 300))
        window.location.href = "/login"
        sessionStorage.clear()
    }

    // rendering data for charts

    function generateDateRange(startDate, numDays) {
        const dateData = []
        let currentDate = new Date(startDate)

        for (let i = 0; i < numDays; i++) {
            dateData.push(new Date(currentDate))
            currentDate.setDate(currentDate.getDate() + 1)
        }

        return dateData
    }

    const y1 = [90, 85, 70, 25, 23, 40, 45]

    const valueFormatter = (date) =>
        date.getHours() === 0
            ? date.toLocaleDateString('fr-FR', {
                month: '2-digit',
                day: '2-digit',
            })
            : date.toLocaleTimeString('fr-FR', {
                hour: '2-digit',
            })

    const today = new Date()
    const daysPastFromToday = new Date(today)
    daysPastFromToday.setHours(0, 0, 0, 0)
    daysPastFromToday.setDate(today.getDate() - (xAxisDays1.value - 1))

    const timeData = generateDateRange(daysPastFromToday, xAxisDays1.value)

    const config = {
        series: [{ data: y1 }],
        height: 300,
    }
    const xAxisCommon = {
        data: [...timeData],
        scaleType: 'time',
        valueFormatter,
    }

    const xAxisOptions = [
        { label: '7 days', value: 7 },
        { label: '14 days', value: 14 },
        { label: '30 days', value: 30 },
    ]

    return (
        <>
            <div className="usage-stats">
                <div className="flex">
                    <div className="usage-stats__item">
                        <LeadingIcon>
                            <UsersIcon />
                        </LeadingIcon>
                        <div className="usage-stats__item__label">Active Agents</div>
                        <div className="usage-stats__item__value"><span>hi</span> / hi</div>
                    </div>
                    <div className="usage-stats__item">
                        <LeadingIcon>
                            <GraphBarIcon />
                        </LeadingIcon>
                        <div className="usage-stats__item__label">Total Agent Data Usage</div>
                        <div className="usage-stats__item__value"><span>hi</span></div>
                    </div>
                </div>
                <div className="flex">
                    <div className="usage-stats__item">
                        <LeadingIcon>
                            <UsersIcon />
                        </LeadingIcon>
                        <div className="usage-stats__item__label">Active Panels</div>
                        <div className="usage-stats__item__value"><span>hi</span> / hi</div>
                    </div>
                    <div className="usage-stats__item">
                        <LeadingIcon>
                            <GraphBarIcon />
                        </LeadingIcon>
                        <div className="usage-stats__item__label">Active Panel Users</div>
                        <div className="usage-stats__item__value"><span>hi</span> / hi</div>
                    </div>
                </div>
                <div className="flex">
                    <div className="usage-stats__item">
                        <LeadingIcon>
                            <UsersIcon />
                        </LeadingIcon>
                        <div className="usage-stats__item__label">Active Agent users</div>
                        <div className="usage-stats__item__value"><span>hi</span> / hi</div>
                    </div>
                    <div className="usage-stats__item">
                        <LeadingIcon>
                            <GraphBarIcon />
                        </LeadingIcon>
                        <div className="usage-stats__item__label">Total Panel Usage</div>
                        <div className="usage-stats__item__value"><span>hi</span> / hi</div>
                    </div>
                </div>
            </div>

            <div className='flex flex-col' style={{ marginTop: "1.25rem" }}>
                <div style={{ alignSelf: "end" }} className='flex'>
                    <Dropdown options={xAxisOptions} value={xAxisDays1} onChange={setXAxisDays1} overlap={true} />
                </div>
                <LineChart
                    xAxis={[
                        {
                            ...xAxisCommon,
                            tickMinStep: 3600 * 1000 * 24, // min step: 24h
                        },
                    ]}
                    {...config}
                />
            </div>

            <Button Button onClick={() => setShowManageDatabases(true)} className="outlined" >
                <DbIcon /> Manage databases
            </Button>

            <AnimatePresence>
                {showManageDatabases && <Modal onClose={() => setShowManageDatabases(false)} width={"35rem"}>
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
                        <Button onClick={() => { setShowRestoreCard(true); setFileName("Choose File") }} className="primary w-full" >Restore</Button>
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
                    <main className='modal__body flex gap-1.5' style={{ alignItems: "center", flexDirection: "column" }}>
                        <Button className='primary w-full' onClick={fakeUlBtnClick} >{fileName}</Button>
                        <input type='file' style={{ display: "none" }} onChange={handleFileChange} name="uldb" id="uldb" className='primary w-full' />
                        <Button className="outlined w-full" disabled={isUploadBtnDisabled} onClick={handleUploadFile}>Upload</Button>
                    </main>
                </Modal>}
            </AnimatePresence>

            <MessageCard
                title="Fetching databases"
                duration={JSON.parse(sessionStorage.getItem("panels")).length * 4}
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