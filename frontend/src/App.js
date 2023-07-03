import React from 'react'
import axios from 'axios'

import UsageStats from './components/UsageStats'

const data = {
    name: "so",
    email: "ssad;nlq2"
}


const test = async () => {
    const response = await axios.post("/test", data)
    console.log(response.data)
}

test()


const App = () => {
    return (
        <UsageStats activeUsers={10} totalUsers={549} dataUsage="1 GB" memoryUsage="256 MB" totalMemory="3.8 GB" />
    )
}

export default App