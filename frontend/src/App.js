import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import LogsPage from './pages/agent/LogsPage';
import SettingsPage from './pages/agent/SettingsPage';
import UsersPage from './pages/agent/UsersPage';
import Login from './pages/Login';
import Navbar from './components/Navbar';
import PanelsPage from './pages/admin/PanelsPage';
import AgentsPage from './pages/admin/AgentsPage';
import NotFoundPage from './pages/NotFoundPage';

const App = () => {
    const [location, setLocation] = useState(window.location.pathname);
    const [isLoggedIn, setIsLoggedIn] = useState(
        sessionStorage.getItem("isLoggedIn") === "true"
    );

    // Check if the current path belongs to Agent or Admin routes
    const isAgentPath =
        location.startsWith("/agent/users") ||
        location.startsWith("/agent/settings") ||
        location.startsWith("/agent/log");

    const isAdminPath =
        location.startsWith("/admin/panels") ||
        location.startsWith("/admin/agents");

    return (
        <BrowserRouter>
            {isLoggedIn && (isAdminPath || isAgentPath) && <Navbar />}
            <Routes>
                <Route path='/login' element={<Login isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} setLocation={setLocation} />} />
                {/* Agent Routes */}
                {isAgentPath && isLoggedIn && <Route path='/agent/users' element={<UsersPage />} />}
                {isAgentPath && isLoggedIn && <Route path='/agent/settings' element={<SettingsPage />} />}
                {isAgentPath && isLoggedIn && <Route path='/agent/log' element={<LogsPage />} />}
                {/* Admin Routes */}
                {isAdminPath && isLoggedIn && <Route path='/admin/panels' element={<PanelsPage />} />}
                {isAdminPath && isLoggedIn && <Route path='/admin/agents' element={<AgentsPage />} />}

                {/* 404 - Not Found */}
                <Route path='*' element={<NotFoundPage />} />
            </Routes>
        </BrowserRouter>
    );
};

export default App;