import React, { useState } from 'react'
import Search from '../../components/Search'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import LogsList from '../../components/admin/LogsList';
import "./AdminLogsPage.css"
import loadingGif from '../../assets/loading.gif'
import axios from 'axios'
import ErrorCard from '../../components/ErrorCard';



const AdminLogsPage = () => {
    const [date, setDate] = useState(dayjs());
    const [log_is_ready,set_log_is_ready] = useState(false);
    const [logs,setLogs] = useState([])
    const [shouldreq,setShouldreq] = useState(true)
    const [error_msg, setError_msg] = useState("")
    const [hasError, setHasError] = useState(false)

    const access_token = sessionStorage.getItem("access_token")
    if(shouldreq)
    {
        axios.post("/get_admin_logs",{access_token}).then(res => 
        {
            if (res.data.status === "ERR") {
                setError_msg(res.data.msg)
                setHasError(true)
                setShouldreq(false)
                return;
            }

            else
            {
                setLogs(res.data);
                set_log_is_ready(true);
                setShouldreq(false)
            }
        });
    }


    return (
        <div className="admin-log-page">
            <div className="admin-log-page__filter">
                <Search />
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                        value={date}
                        onChange={newDate => setDate(newDate)}
                        slotProps={{ textField: { size: 'small' } }}
                    />
                </LocalizationProvider>
            </div>
            { !log_is_ready && <div className='loading_gif_container'> <img src={loadingGif} className='loading_gif' /> </div> }
            { log_is_ready && <LogsList logs={logs} /> }
            <ErrorCard
                hasError={hasError}
                setHasError={setHasError}
                errorTitle="ERROR"
                errorMessage={error_msg}
            />
        </div>

    )
}

export default AdminLogsPage