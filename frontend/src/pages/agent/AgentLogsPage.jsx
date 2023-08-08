import React, { useState, useEffect } from 'react'
import Search from '../../components/Search'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import LogsList from '../../components/admin/LogsList';
import "../admin/AdminLogsPage.css"
import ErrorCard from '../../components/ErrorCard';
import axios from 'axios'
import CircularProgress from '../../components/CircularProgress';
import Ms3 from '../../components/form/inputs/MultiSelect3';
import Ms4 from '../../components/form/inputs/MultiSelect4';
import Pagination from '../../components/Pagination';
import Dropdown from '../../components/Dropdown';
import Button from '../../components/Button';

const AgentLogsPage = () => {
    const [startDate, setStartDate] = useState(dayjs());
    const [endDate, setEndDate] = useState(dayjs());
    const [log_is_ready, set_log_is_ready] = useState(false);
    const [logs, setLogs] = useState([])
    const [error_msg, setError_msg] = useState("")
    const [hasError, setHasError] = useState(false)
    const [currentPage, setCurrentPage] = useState(1)
    const [rowsPerPage, setRowsPerPage] = useState(10)
    const [selection, setSelection] = useState(null)
    const [totalPages, setTotalPages] = useState(0)

    const access_token = sessionStorage.getItem("access_token")
    // if (shouldreq) {
    //     axios.post("/get_agent_logs", { access_token }).then(res => {
    //         if (res.data.status === "ERR") {
    //             setError_msg(res.data.msg)
    //             setHasError(true)
    //             setShouldreq(false)
    //             return;
    //         }

    //         else {
    //             setLogs(res.data);
    //             set_log_is_ready(true);
    //             setShouldreq(false)
    //         }
    //     });
    // }

    useEffect(() => {
        axios.post("/get_agent_logs", { access_token, number_of_rows: rowsPerPage, current_page: currentPage }).then(res => {
            if (res.data.status === "ERR") {
                setError_msg(res.data.msg)
                setHasError(true)
                return;
            }

            else {
                setLogs(res.data.obj)
                setTotalPages(res.data.total_pages)
                set_log_is_ready(true);
            }
        });
        console.log("useEffect");
    }, [rowsPerPage, currentPage])

    const handlePageChange = (page) => {
        setCurrentPage(page)
    }

    const handleSelect = (option) => {
        setSelection(option)
        setRowsPerPage(option.value)
    }

    const itemsPerRowOptions = [
        { label: 10, value: 10 },
        { label: 20, value: 20 },
        { label: 30, value: 30 },
    ]

    return (
        <div className="admin-log-page">
            <div className="admin-log-page__filter">
                <div style={{ display: "flex", gap: "1rem", width: "100%" }}>
                    <Ms3 />
                    <Ms4 />
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
                <Button style={{ alignSelf: "start" }} className='primary'>Filter</Button>
            </div>
            {!log_is_ready && <div className='loading_gif_container'> <CircularProgress /> </div>}
            {log_is_ready && <LogsList logs={logs} />}
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

export default AgentLogsPage