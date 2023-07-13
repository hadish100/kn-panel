import React from 'react'
import axios from 'axios'
import { BrowserRouter, Routes, Route } from "react-router-dom"

import LogsPage from "./pages/LogsPage"
import SettingsPage from "./pages/SettingsPage"
import UsersPage from "./pages/UsersPage"
import Login from "./pages/Login"
import AdminPanels from "./pages/AdminPanels"
import AdminUsers from "./pages/AdminUsers"



const App = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route>
                    <Route path="/login" element={<Login />} />
                    <Route path="/admin/panels" element={<AdminPanels />} />
                    <Route path="/admin/agents" element={<AdminUsers />} />
                    <Route path="/agent/users" element={<UsersPage />} />
                    <Route path="/agent/settings" element={<SettingsPage />} />
                    <Route path="/agent/log" element={<LogsPage />} />
                </Route>
            </Routes>
        </BrowserRouter>
    )
}

export default App