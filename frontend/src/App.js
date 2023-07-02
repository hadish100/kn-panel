import React from 'react'
import axios from 'axios'

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
        <div>
            <h1>App</h1>
        </div>
    )
}

export default App