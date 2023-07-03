import React from 'react'
import axios from 'axios'

import UsageStats from './components/UsageStats'
import UsersTable from './components/UsersTabel'

const data = {
    name: "so",
    email: "ssad;nlq2"
}


const test = async () => {
    const response = await axios.post("/test", data)
    console.log(response.data)
}

test()


let users = [
    {
        id: 1,
        username: "soheil17",
        status: "active",
        dataUsage: "1 GB",
        subscriptionLink: "https://www.google.com",
        config: "loreamasndlasdobobllb32o39232o2b39g9gib21neo1hn//a/sd/454/"
    },
    {
        id: 2,
        username: "soheil18",
        status: "active",
        dataUsage: "1 GB",
        subscriptionLink: "https://www.google.com",
        config: "loreamasndlasdobobllb32o39232o2b39g9gib21neo1hn//a/sd/454/"
    },
    {
        id: 3,
        username: "soheil19",
        status: "active",
        dataUsage: "1 GB",
        subscriptionLink: "https://www.google.com",
        config: "loreamasndlasdobobllb32o39232o2b39g9gib21neo1hn//a/sd/454/"
    },
]

const App = () => {
    return (
        <>
            <UsageStats activeUsers={10} totalUsers={549} dataUsage="1 GB" memoryUsage="256 MB" totalMemory="3.8 GB" />
            <UsersTable users={users} />
        </>
    )
}

export default App