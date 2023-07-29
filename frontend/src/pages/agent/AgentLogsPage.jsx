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

const logs = [
    {
        logText: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
        logDate: "Today at 12:30 PM",
        id: 1
    },
    {
        logText: "lorem;asdlnalsdnlandnkbfiwfjqwefbqebfbqefbjqw c wekl eq eclbdlbqfl qelqbefl qefblqbeflqbefbqlefblq e,efbqljfbejlb",
        logDate: "Today at 2:30 AM",
        id: 2
    },
    {
        logText: "lorem;asdlnalsdnlandnkbfiwfjqwefbqebfbqefbjqw c wekl eq eclbdlbqfl qelqbefl qefblqbeflqbefbqlefblq e,efbqljfbejlb",
        logDate: "Today at 2:30 AM",
        id: 3
    },
]

const AgentLogsPage = () => {
    const [date, setDate] = useState(dayjs());
    const [log_is_ready,set_log_is_ready] = useState(false);

    const access_token = sessionStorage.getItem("access_token")
    axios.post("/get_admin_logs",{access_token}).then(res => 
    {
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