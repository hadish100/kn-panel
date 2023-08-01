import React, { useState } from 'react'
import Search from '../../components/Search'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import LogsList from '../../components/admin/LogsList';
import "../admin/AdminLogsPage.css"
import loadingGif from '../../assets/loading.gif'
import axios from 'axios'

var logs = []

const AgentLogsPage = () => {
    const [date, setDate] = useState(dayjs());
    const [log_is_ready,set_log_is_ready] = useState(false);

    const access_token = sessionStorage.getItem("access_token")
    axios.post("/get_agent_logs",{access_token}).then(res => 
    {
        logs = res.data;
        set_log_is_ready(true);
    });

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
        </div>

    )
}

export default AgentLogsPage