import React from 'react'
import axios from 'axios'

const data = {
    name: "so",
    email: "ssad;nlq2"
}

axios.post("/test", data)
    .then(response => {
        console.log(response.data)
    })
    .catch(err => {
        console.error(err)
    })

const App = () => {
    return (
        <form method='POST' action='/post'>
            <input type='text'></input>
            <input type='submit'></input>
        </form>
    )
}

export default App