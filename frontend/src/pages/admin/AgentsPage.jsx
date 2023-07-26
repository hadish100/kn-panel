import React, { useState } from 'react'

import Search from '../../components/Search'
import Button from '../../components/Button'
import AgentsTable from '../../components/admin/AgentsTable'
import AdminUsageStats from '../../components/admin/UsageStats'
import AddPanelForm from '../../components/admin/AgentForm'
import { AnimatePresence } from 'framer-motion'
import { ReactComponent as RefreshIcon } from '../../assets/svg/refresh.svg'
import './AgentsPage.css'
import EditAgentForm from '../../components/admin/EditAgentForm'

const AgentsPage = () => {
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false)

    const agents = JSON.parse(sessionStorage.getItem("agents"));
    


    const handleClick = () => {
        setShowCreateModal(true)
    }

    const handleCloseCreateModal = () => {
        setShowCreateModal(false)
    }

    const handleCloseEditModal = () => {
        setShowEditModal(false)
    }

    return (
        <div className='admin_panels_body'>
            <AdminUsageStats dataUsage="8020 GB" activeUsers={512} totalUsers={1000} />
            <div className="container flex items-center justify-between   column-reverse items-end gap-16">
                <Search />
                <span style={{ display: "flex", gap: "0.5rem" }} className='items-center'>
                    <Button className="outlined refresh"><RefreshIcon /></Button>
                    <Button onClick={handleClick} className="create-user-button primary">Create Agent</Button>
                </span>
            </div>

            <AnimatePresence>
                {showCreateModal && <AddPanelForm
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    handleClose={handleCloseCreateModal}
                />}
            </AnimatePresence>

            <EditAgentForm handleClose={handleCloseEditModal} showModal={showEditModal} />

            <AgentsTable users={agents} rowsPerPage={10} currentRows={agents} setShowEditModal={setShowEditModal} />

        </div>
    )
}

export default AgentsPage