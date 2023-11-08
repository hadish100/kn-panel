import React, { useState } from 'react'
import { LineChart } from '@mui/x-charts/LineChart'

import ErrorCard from '../../components/ErrorCard'
import LeadingIcon from '../../components/LeadingIcon'
import Dropdown from '../../components/Dropdown'

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
    const [error_msg, setError_msg] = useState("")
    const [hasError, setHasError] = useState(false)
    const [xAxisDays1, setXAxisDays1] = useState(xAxisOptions[0])
    const [xAxisDays2, setXAxisDays2] = useState(xAxisOptions[0])
    const [xAxisDays3, setXAxisDays3] = useState(xAxisOptions[0])

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