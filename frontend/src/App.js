import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import AgentLogsPage from './pages/agent/AgentLogsPage';
import AgentSettingsPage from './pages/agent/AgentSettingsPage';
import AdminLogsPage from './pages/admin/AdminLogsPage';
import AdminSettingsPage from './pages/admin/AdminSettingsPage';
import UsersPage from './pages/agent/UsersPage';
import Login from './pages/Login';
import Navbar from './components/Navbar';
import PanelsPage from './pages/admin/PanelsPage';
import AgentsPage from './pages/admin/AgentsPage';
import NotFoundPage from './pages/NotFoundPage';
import AdminHomePage from './pages/admin/AdminHomePage';
import AgentHomePage from './pages/agent/AgentHomePage';

const App = () => {
    const [location, setLocation] = useState(window.location.pathname);
    const [isLoggedIn, setIsLoggedIn] = useState(
        sessionStorage.getItem("isLoggedIn") === "true"
    );

    // Check if the current path belongs to Agent or Admin routes
    const isAgentPath =
        location.startsWith("/agent/users") ||
        location.startsWith("/agent/settings") ||
        location.startsWith("/agent/home") ||
        location.startsWith("/agent/log");

    const isAdminPath =
        location.startsWith("/admin/panels") ||
        location.startsWith("/admin/agents") ||
        location.startsWith("/admin/settings") ||
        location.startsWith("/admin/home") ||
        location.startsWith("/admin/log");

    return (
        <BrowserRouter>
            {isLoggedIn && (isAdminPath || isAgentPath) && <Navbar />}
            <Routes>
                <Route path='/login' element={<Login isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} setLocation={setLocation} />} />
                {/* Agent Routes */}
                {isAgentPath && isLoggedIn && <Route path='/agent/home' element={<AgentHomePage setLocation={setLocation} />} />}
                {isAgentPath && isLoggedIn && <Route path='/agent/users' element={<UsersPage />} />}
                {isAgentPath && isLoggedIn && <Route path='/agent/settings' element={<AgentSettingsPage />} />}
                {isAgentPath && isLoggedIn && <Route path='/agent/log' element={<AgentLogsPage />} />}
                {/* Admin Routes */}
                {isAdminPath && isLoggedIn && <Route path='/admin/home' element={<AdminHomePage setLocation={setLocation} />} />}
                {isAdminPath && isLoggedIn && <Route path='/admin/panels' element={<PanelsPage />} />}
                {isAdminPath && isLoggedIn && <Route path='/admin/agents' element={<AgentsPage />} />}
                {isAdminPath && isLoggedIn && <Route path='/admin/settings' element={<AdminSettingsPage />} />}
                {isAdminPath && isLoggedIn && <Route path='/admin/log' element={<AdminLogsPage />} />}

                {/* 404 - Not Found */}
                <Route path='*' element={<NotFoundPage />} />
            </Routes>
        </BrowserRouter>
    );
};

export default App;