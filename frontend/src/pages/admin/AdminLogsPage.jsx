import React, { useState, useEffect } from 'react'
import Search from '../../components/Search'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import dayjs from 'dayjs'
import LogsList from '../../components/admin/LogsList'
import "./AdminLogsPage.css"
import axios from 'axios'
import ErrorCard from '../../components/ErrorCard'
import CircularProgress from '../../components/CircularProgress'
import Ms3 from '../../components/form/inputs/MultiSelect3'
import Pagination from '../../components/Pagination'
import Dropdown from '../../components/Dropdown'
import Button from '../../components/Button'
import { ReactComponent as Syslog } from '../../assets/svg/document.svg';



const AdminLogsPage = () => {
    const [startDate, setStartDate] = useState(dayjs())
    const [endDate, setEndDate] = useState(dayjs())
    const [IsLogReady, setIsLogReady] = useState(false)
    const [logs, setLogs] = useState([])
    const [error_msg, setError_msg] = useState("")
    const [hasError, setHasError] = useState(false)
    const [currentPage, setCurrentPage] = useState(1)
    const [rowsPerPage, setRowsPerPage] = useState(10)
    const [selection, setSelection] = useState(null)
    const [totalPages, setTotalPages] = useState(0)
    const [actions, setActions] = useState([])
    const [accounts, setAccounts] = useState([])
    const [filterMode, setFilterMode] = useState(false)

    const access_token = sessionStorage.getItem("access_token")
    const fetchLogs = async (resetCurrentPage) => {
        setFilterMode(true)
        const res = await axios.post("/get_admin_logs", {
            access_token,
            number_of_rows: rowsPerPage,
            current_page: currentPage,
            actions,
            accounts,
            start_date: Math.floor(new Date(Date.parse(startDate.$d)).setHours(0, 0, 0, 0) / 1000),
            end_date: Math.floor(new Date(Date.parse(endDate.$d)).setHours(23, 59, 59, 999) / 1000)
        })
        if (res.data.status === "ERR") {
            setError_msg(res.data.msg)
            setHasError(true)
            setFilterMode(false)
            return
        }

        else {
            setLogs(res.data.obj)
            setTotalPages(res.data.total_pages)
            setIsLogReady(true)
            if (resetCurrentPage) setCurrentPage(1)
            setFilterMode(false)
        }
        setFilterMode(false)
    }

    useEffect(() => {
        setIsLogReady(false)
        fetchLogs()
    }, [rowsPerPage, currentPage])

    const handlePageChange = (page) => {
        setCurrentPage(page)
    }

    const handleSelect = (option) => {
        setSelection(option)
        setRowsPerPage(option.value)
    }

    const dl_system_log = async () => {
        const downloadUrl = window.location.protocol + "//" + window.location.host + "/syslog/syslog.txt"; 
        console.log(downloadUrl)
        const link = document.createElement("a");
        link.href = downloadUrl;
        link.download = "syslog.txt";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    const itemsPerRowOptions = [
        { label: 10, value: 10 },
        { label: 20, value: 20 },
        { label: 30, value: 30 },
    ]

    const actions_array = ["LOGIN", "CREATE_USER", "EDIT_USER", "DELETE_USER", "CREATE_PANEL", "EDIT_PANEL", "DELETE_PANEL", "EDIT_SELF", "RESET_USER", "CREATE_AGENT", "EDIT_AGENT", "DELETE_AGENT", "ENABLE_USER", "ENABLE_AGENT", "ENABLE_PANEL", "DISABLE_USER", "DISABLE_PANEL", "DISABLE_AGENT", "RECEIVE_DATA","SWITCH_COUNTRY"]
    const filter_accounts = (JSON.parse(sessionStorage.getItem("agents")).map(agent => agent.username)).concat(["admin"]).reverse()

    return (
        <div className="admin-log-page">
            <div className="admin-log-page__filter">
                <div style={{ display: "flex", gap: "1rem", width: "100%" }}>
                    <Ms3 actions={actions_array} onChange={setActions} value={actions} lable="Actions" />
                    <Ms3 actions={filter_accounts} onChange={setAccounts} value={accounts} lable="Accounts" />
                </div>
                <div style={{ display: "flex", gap: "1rem", width: "100%" }}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                            value={startDate}
                            label="from"
                            onChange={newDate => setStartDate(newDate)}
                            slotProps={{ textField: { size: 'small' } }}
                            style={{ flexGrow: 1, width: '100%' }}
                        />
                    </LocalizationProvider>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                            value={endDate}
                            label="to"
                            onChange={newDate => setEndDate(newDate)}
                            slotProps={{ textField: { size: 'small' } }}
                            style={{ flexGrow: 1, width: '100%' }}
                        />
                    </LocalizationProvider>
                </div>
                <div className='log_buttons_div' >
                <Button onClick={() => dl_system_log()} style={{ alignSelf: "end" }} className='outlined' > <Syslog /> System log</Button>
                <Button onClick={() => fetchLogs(true)} style={{ alignSelf: "start" }} className='primary' disabled={filterMode}>{filterMode ? "Filtering..." : "Filter"}</Button>
                </div>
            </div>
            {!IsLogReady && <div className='loading_gif_container'> <CircularProgress /> </div>}
            {IsLogReady && <LogsList logs={logs} />}
            <ErrorCard
                hasError={hasError}
                setHasError={setHasError}
                errorTitle="ERROR"
                errorMessage={error_msg}
            />
            <div className='users-page__footer'>
                <span style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <Dropdown options={itemsPerRowOptions} value={selection} onChange={handleSelect}>Items per page</Dropdown>
                    <span style={{ fontSize: "0.75rem", color: "var(--dark-clr-200)", alignSelf: "start", marginTop: "0.7rem" }}>Items per page</span>
                </span>
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    handlePageChange={handlePageChange}
                />
            </div>
        </div>

    )
}

export default AdminLogsPage