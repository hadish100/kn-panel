import React from 'react'
import axios from 'axios'
import { BrowserRouter, Routes, Route } from "react-router-dom"

import LogsPage from "./pages/LogsPage"
import SettingsPage from "./pages/SettingsPage"
import UsersPage from "./pages/UsersPage"
import Login from "./pages/Login"



const App = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route>
                    <Route path="/login" element={<Login />} />
                    <Route path="/panel/users" element={<UsersPage />} />
                    <Route path="/panel/settings" element={<SettingsPage />} />
                    <Route path="/panel/log" element={<LogsPage />} />
                </Route>
            </Routes>
        </BrowserRouter>
    )
}

export default App