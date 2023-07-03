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
        username: "soheil17",
        status: "active",
        dataUsage: "1 GB",
    },
    {
        username: "soheil18",
        status: "active",
        dataUsage: "1 GB",
    },
    {
        username: "soheil19",
        status: "active",
        dataUsage: "1 GB",
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