import React, { useState } from 'react'
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


const AgentLogsPage = () => {
    const [startDate, setStartDate] = useState(dayjs());
    const [endDate, setEndDate] = useState(dayjs());
    const [log_is_ready, set_log_is_ready] = useState(false);
    const [logs, setLogs] = useState([])
    const [shouldreq, setShouldreq] = useState(true)
    const [error_msg, setError_msg] = useState("")
    const [hasError, setHasError] = useState(false)

    const access_token = sessionStorage.getItem("access_token")
    if (shouldreq) {
        axios.post("/get_agent_logs", { access_token }).then(res => {
            if (res.data.status === "ERR") {
                setError_msg(res.data.msg)
                setHasError(true)
                setShouldreq(false)
                return;
            }

            else {
                setLogs(res.data);
                set_log_is_ready(true);
                setShouldreq(false)
            }
        });
    }


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
            </div>
            {!log_is_ready && <div className='loading_gif_container'> <CircularProgress /> </div>}
            {log_is_ready && <LogsList logs={logs} />}
            <ErrorCard
                hasError={hasError}
                setHasError={setHasError}
                errorTitle="ERROR"
                errorMessage={error_msg}
            />
        </div>

    )
}

export default AgentLogsPage