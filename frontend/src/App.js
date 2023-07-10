import React from 'react'
import axios from 'axios'
import { BrowserRouter, Routes, Route } from "react-router-dom"

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

const App = () => {
    return (
        <BrowserRouter>
            <Navbar />
            <Routes>
                <Route>
                    <Route path="/users" element={<UsersPage />} />
                    <Route path="/settings" element={<SettingsPage />} />
                    <Route path="/log" element={<LogsPage />} />
                </Route>
            </Routes>
        </BrowserRouter>
    )
}

export default App