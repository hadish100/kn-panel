import React, { useState } from 'react'
import axios from 'axios'
import { AnimatePresence } from 'framer-motion'
import { LineChart } from '@mui/x-charts/LineChart'

import Button from "../../components/Button"
import MessageCard from "../../components/MessageCard"
import ErrorCard from '../../components/ErrorCard'
import Modal from '../../components/Modal'
import LeadingIcon from '../../components/LeadingIcon'
import Dropdown from '../../components/Dropdown'

import { ReactComponent as DbIcon } from '../../assets/svg/db.svg'
import { ReactComponent as DbUpIcon } from '../../assets/svg/db-up.svg'
import { ReactComponent as XMarkIcon } from '../../assets/svg/x-mark.svg'
import { ReactComponent as GraphBarIcon } from "../../assets/svg/graph-bar.svg"
import { ReactComponent as UsersIcon } from "../../assets/svg/users.svg"

import '../../components/form/inputs/FileInput.css'
import "../../components/agent/UsageStats.css"
import styles from "./AdminHomePage.module.css"

const valueFormatter = (date) =>
    date.getHours() === 0
        ? date.toLocaleDateString('fr-FR', {
            month: '2-digit',
            day: '2-digit',
        })
        : date.toLocaleTimeString('fr-FR', {
            hour: '2-digit',
        })

const xAxisOptions = [
    { label: '1 week', value: 7 },
    { label: '1 month', value: 30 },
    { label: '3 month', value: 60 },
]

const templateColor1 = ["#1b9e77", "#d95f02", "#7570b3", "#e7298a", "#66a61e", "#e6ab02", "#a6761d", "#666666"]
const templateColor2 = ["#e41a1c", "#377eb8", "#4daf4a", "#984ea3", "#ff7f00", "#ffff33", "#a65628", "#f781bf", "#999999"]

const AdminHomePage = () => {
    const [showManageDatabases, setShowManageDatabases] = useState(false)
    const [showBackupCard, setShowBackupCard] = useState(false)
    const [showRestoreCard, setShowRestoreCard] = useState(false)
    const [error_msg, setError_msg] = useState("")
    const [fileName, setFileName] = useState("Choose File")
    const [hasError, setHasError] = useState(false)
    const [isUploadBtnDisabled, setIsUploadBtnDisabled] = useState(false)
    const [selectedFile, setSelectedFile] = useState(null)
    const [xAxisDays1, setXAxisDays1] = useState(xAxisOptions[0])
    const [xAxisDays2, setXAxisDays2] = useState(xAxisOptions[0])
    const [xAxisDays3, setXAxisDays3] = useState(xAxisOptions[0])

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

    const totalUserCreation = [90, 85, 70, 25, 23, 40, 45]
    const totalUserEdits = [90, 65, 50, 15, 57, 90, 110]
    const totalUserDelete = [90, 65, 50, 15, 57, 9, 128]

    const totalAllocatedDataOfBusinessAgents = [90, 65, 50, 15, 57, 9, 5]
    const totalDataUsageOfBusinessAgents = [9, 6, 5, 15, 57, 9, 45]

    const totalAllocatedDataOfNormalAgents = [90, 65, 5, 15, 5, 9, 5]
    const totalDataUsageOfNormalAgents = [10, 70, 25, 45, 15, 19, 50]

    const today = new Date()

    const daysPastFromToday1 = new Date(today)
    daysPastFromToday1.setHours(0, 0, 0, 0)
    daysPastFromToday1.setDate(today.getDate() - (xAxisDays1.value - 1))
    const daysPastFromToday2 = new Date(today)
    daysPastFromToday2.setHours(0, 0, 0, 0)
    daysPastFromToday2.setDate(today.getDate() - (xAxisDays2.value - 1))
    const daysPastFromToday3 = new Date(today)
    daysPastFromToday3.setHours(0, 0, 0, 0)
    daysPastFromToday3.setDate(today.getDate() - (xAxisDays3.value - 1))

    const timeData1 = generateDateRange(daysPastFromToday1, xAxisDays1.value)
    const timeData2 = generateDateRange(daysPastFromToday2, xAxisDays2.value)
    const timeData3 = generateDateRange(daysPastFromToday3, xAxisDays3.value)

    const config1 = {
        series: [
            { data: totalUserCreation },
            { data: totalUserEdits },
            { data: totalUserDelete },
        ],
        height: 300,
    }
    const config2 = {
        series: [
            { data: totalAllocatedDataOfBusinessAgents },
            { data: totalDataUsageOfBusinessAgents },
        ],
        height: 300,
    }
    const config3 = {
        series: [
            { data: totalAllocatedDataOfNormalAgents },
            { data: totalDataUsageOfNormalAgents },
        ],
        height: 300,
    }

    const xAxisCommon1 = {
        data: [...timeData1],
        scaleType: 'time',
        valueFormatter,
    }
    const xAxisCommon2 = {
        data: [...timeData2],
        scaleType: 'time',
        valueFormatter,
    }
    const xAxisCommon3 = {
        data: [...timeData3],
        scaleType: 'time',
        valueFormatter,
    }

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
                    // colors={templateColor1}
                    xAxis={[
                        {
                            ...xAxisCommon1,
                            tickMinStep: 3600 * 1000 * 24, // min step: 24h
                        },
                    ]}
                    {...config1}
                />
                <div className={`flex gap-2.5 justify-center ${styles['charts-subinfo']}`}>
                    <div className='flex gap-1' style={{ fontSize: ".875rem" }}><div style={{ backgroundColor: "#02B2AF", minWidth: ".875rem", height: ".875rem", borderRadius: ".25rem" }}></div>Total User Creation</div>
                    <div className='flex gap-1' style={{ fontSize: ".875rem" }}><div style={{ backgroundColor: "#2E96FF", minWidth: ".875rem", height: ".875rem", borderRadius: ".25rem" }}></div>Total User Edits</div>
                    <div className='flex gap-1' style={{ fontSize: ".875rem" }}><div style={{ backgroundColor: "#B800D8", minWidth: ".875rem", height: ".875rem", borderRadius: ".25rem" }}></div>Total User Delete</div>
                </div>
            </div>

            <div className='flex flex-col' style={{ marginTop: "1.25rem" }}>
                <div style={{ alignSelf: "end" }} className='flex'>
                    <Dropdown options={xAxisOptions} value={xAxisDays2} onChange={setXAxisDays2} overlap={true} />
                </div>
                <LineChart
                    colors={templateColor1}
                    xAxis={[
                        {
                            ...xAxisCommon2,
                            tickMinStep: 3600 * 1000 * 24, // min step: 24h
                        },
                    ]}
                    {...config2}
                />
                <div className={`flex gap-2.5 justify-center ${styles['charts-subinfo']}`}>
                    <div className='flex gap-1' style={{ fontSize: ".875rem" }}><div style={{ backgroundColor: "#1b9e77", minWidth: ".875rem", height: ".875rem", borderRadius: ".25rem" }}></div>Total Allocated Data Of Business Agents</div>
                    <div className='flex gap-1' style={{ fontSize: ".875rem" }}><div style={{ backgroundColor: "#d95f02", minWidth: ".875rem", height: ".875rem", borderRadius: ".25rem" }}></div>Total Data Usage Of Business Agents</div>
                </div>
            </div>

            <div className='flex flex-col' style={{ marginTop: "1.25rem" }}>
                <div style={{ alignSelf: "end" }} className='flex'>
                    <Dropdown options={xAxisOptions} value={xAxisDays3} onChange={setXAxisDays3} overlap={true} />
                </div>
                <LineChart
                    colors={templateColor2}
                    xAxis={[
                        {
                            ...xAxisCommon3,
                            tickMinStep: 3600 * 1000 * 24, // min step: 24h
                        },
                    ]}
                    {...config3}
                />
                <div className={`flex gap-2.5 justify-center ${styles['charts-subinfo']}`}>
                    <div className='flex gap-1' style={{ fontSize: ".875rem" }}><div style={{ backgroundColor: "#e41a1c", minWidth: ".875rem", height: ".875rem", borderRadius: ".25rem" }}></div>Total Allocated Data Of Normal Agents</div>
                    <div className='flex gap-1' style={{ fontSize: ".875rem" }}><div style={{ backgroundColor: "#377eb8", minWidth: ".875rem", height: ".875rem", borderRadius: ".25rem" }}></div>Total Data Usage Of Normal Agents</div>
                </div>
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