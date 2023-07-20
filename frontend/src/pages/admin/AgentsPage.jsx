import React, { useState } from 'react'
import Search from '../../components/Search'
import Button from '../../components/Button'
import AgentsTable from '../../components/admin/AgentsTable'
import AdminUsageStats from '../../components/admin/UsageStats'
import AddPanelForm from '../../components/admin/AgentForm'
import { AnimatePresence } from 'framer-motion'
import { ReactComponent as RefreshIcon } from '../../assets/svg/refresh.svg'
import './AgentsPage.css'


const AgentsPage = () => {
    const [showModal, setShowModal] = useState(false);

    var agents = JSON.parse(sessionStorage.getItem("agents"));

    const handleClick2 = () => {
        setShowModal(true)
    }

    const handleClose = () => {
        setShowModal(false)
    }

    return (
        <div className='admin_panels_body'>
            <AdminUsageStats dataUsage="8020 GB" activeUsers={512} totalUsers={1000} />
            <div className="container flex items-center justify-between   column-reverse items-end gap-16">
                <Search />
                <span style={{ display: "flex", gap: "0.5rem" }} className='items-center'>
                    <Button className="outlined refresh"><RefreshIcon /></Button>
                    <Button onClick={handleClick2} className="create-user-button primary">Create Agent</Button>
                </span>
            </div>

            <AnimatePresence>
                {showModal && <AddPanelForm
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    handleClose={handleClose}
                />}
            </AnimatePresence>

            <AgentsTable users={agents} rowsPerPage={10} currentRows={agents} />

        </div>
    )
}

export default AgentsPage