import React from 'react'
import axios from 'axios'
import { BrowserRouter, Routes, Route } from "react-router-dom"


import UsageStats from './components/UsageStats'
import UsersTable from './components/UsersTable'
import Navbar from './components/Navbar'
import LogsPage from "./pages/LogsPage"
import SettingsPage from "./pages/SettingsPage"
import UsersPage from "./pages/UsersPage"

// const data = 
// {
//     name: "so",
//     email: "ssad;nlq2"
// };
// const test = async () => {
//     const response = await axios.post("/test", data)
//     console.log(response.data)
// }



let users = [
    {
        id: 1,
        username: "soheil17",
        isActive: true,
        expireTime: {
            days: 24,
            hours: 24,
            minutes: 32
        },
        dataUsage: 350766210,
        totalData: 2008976720,
        subscriptionLink: "https://www.google.com",
        config: "loreamasndlasdobobllb32o39232o2b39g9gib21neo1hn//a/sd/454/"
    },
    {
        id: 2,
        username: "soheil18",
        isActive: false,
        expireTime: {
            days: 15,
            hours: 12,
            minutes: 42
        },
        dataUsage: 1024785,
        totalData: 2006753,
        subscriptionLink: "https://www.google.com",
        config: "loreamasndlasdobobllb32o39232o2b39g9gib21neo1hn//a/sd/454/"
    },
    {
        id: 3,
        username: "soheil19",
        isActive: true,
        expireTime: {
            days: 0,
            hours: 12,
            minutes: 19
        },
        dataUsage: 2056431,
        totalData: 2056431,
        subscriptionLink: "https://www.google.com",
        config: "loreamasndlasdobobllb32o39232o2b39g9gib21neo1hn//a/sd/454/"
    },
]

const App = () => {
    return (
        <>
            <BrowserRouter>
                <Routes>
                    <Route path='/' element={<Navbar />}>
                        <Route index path="/users" element={<UsersPage />} />
                        <Route path="/settings" element={<SettingsPage />} />
                        <Route path="/log" element={<LogsPage />} />
                    </Route>
                </Routes>
            </BrowserRouter>
            <UsageStats activeUsers={10} totalUsers={549} dataUsage="1 GB" remainingData="198 GB" allocableData="1 TB" />
            <UsersTable users={users} />
        </>
    )
}

export default App