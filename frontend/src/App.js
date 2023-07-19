// App.js
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import LogsPage from './pages/agent/LogsPage';
import SettingsPage from './pages/agent/SettingsPage';
import UsersPage from './pages/agent/UsersPage';
import Login from './pages/Login';
import Navbar from './components/Navbar';
import PanelsPage from './pages/admin/PanelsPage';
import AgentsPage from './pages/admin/AgentsPage';

const App = () => {
    const location = window.location.pathname
    const isAuth = location.includes("/login") ? false : true

    return (
        <BrowserRouter>
            {isAuth && <Navbar />}
            <Routes>
                <Route path='/login' element={<Login />} />
                {/* Agent Routes */}
                <Route path='/agent/users' element={<UsersPage />} />
                <Route path='/agent/settings' element={<SettingsPage />} />
                <Route path='/agent/log' element={<LogsPage />} />
                {/* Admin Routes */}
                <Route path='/admin/panels' element={<PanelsPage />} />
                <Route path='/admin/agents' element={<AgentsPage />} />
            </Routes>
        </BrowserRouter>
    );
};

export default App;
