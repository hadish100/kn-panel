import React, { useState } from 'react'

import Search from '../../components/Search'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import "./AdminLogsPage.css"

const AdminLogsPage = () => {
    const [date, setDate] = useState(dayjs());

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
            <ul>

            </ul>
        </div>

    )
}

export default AdminLogsPage