import React from 'react';
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
    const location = window.location.pathname;
    const isAuth = !location.includes("/login"); // If path is /login, isAuth will be false

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
            {isAuth && (isAdminPath || isAgentPath) && <Navbar />}
            <Routes>
                <Route path='/login' element={<Login />} />
                {/* Agent Routes */}
                {isAgentPath && isAuth ? <Route path='/agent/users' element={<UsersPage />} /> : null}
                {isAgentPath && isAuth ? <Route path='/agent/settings' element={<SettingsPage />} /> : null}
                {isAgentPath && isAuth ? <Route path='/agent/log' element={<LogsPage />} /> : null}
                {/* Admin Routes */}
                {isAdminPath && isAuth ? <Route path='/admin/panels' element={<PanelsPage />} /> : null}
                {isAdminPath && isAuth ? <Route path='/admin/agents' element={<AgentsPage />} /> : null}

                {/* 404 - Not Found */}
                <Route path='*' element={<NotFoundPage />} />
            </Routes>
        </BrowserRouter>
    );
};

export default App;
