import React, { useState, useEffect } from 'react'
import axios from 'axios'

import Search from '../../components/Search'
import Button from '../../components/Button'
import AgentsTable from '../../components/admin/AgentsTable'
import AdminUsageStats from '../../components/admin/UsageStats'
import CreateAgent from '../../components/admin/CreateAgent'
import { AnimatePresence } from 'framer-motion'
import { ReactComponent as RefreshIcon } from '../../assets/svg/refresh.svg'
import EditAgentForm from '../../components/admin/EditAgentForm'
import './AgentsPage.css'

const AgentsPage = () => {
    const [showCreateAgent, setShowCreateAgent] = useState(false);
    const [showEditAgent, setShowEditAgent] = useState(false)
    const [agents, setAgents] = useState([])
    const [selectedAgent, setSelectedAgent] = useState(null)

    useEffect(() => {
        setAgents(JSON.parse(sessionStorage.getItem("agents")))
    }, [])

    const handleDeleteAgent = (e, agent_id) => {
        e.stopPropagation();
        const access_token = sessionStorage.getItem("access_token");
        axios.post("/delete_agent", { access_token, agent_id }).then((res) => {
            let agents = JSON.parse(sessionStorage.getItem("agents"))
            agents = agents.filter((agent) => agent.id !== agent_id)
            sessionStorage.setItem("agents", JSON.stringify(agents))
            setAgents(agents)
        })
        setShowEditAgent(false)
    }

    const handleShowCreatePanel = () => {
        setShowCreateAgent(true)
    }

    const handleCloseCreateAgent = () => {
        setShowCreateAgent(false)
    }

    const handleCloseEditAgent = () => {
        setShowEditAgent(false)
    }

    const handleShowEditAgent = (item) => {
        setSelectedAgent(item)
        setShowEditAgent(true)
    }

    return (
        <div className='admin_panels_body'>
            <AdminUsageStats dataUsage="8020 GB" activeUsers={512} totalUsers={1000} />
            <div className="container flex items-center justify-between   column-reverse items-end gap-16">
                <Search />
                <span style={{ display: "flex", gap: "0.5rem" }} className='items-center'>
                    <Button className="outlined refresh"><RefreshIcon /></Button>
                    <Button onClick={handleShowCreatePanel} className="create-user-button primary">Create Agent</Button>
                </span>
            </div>

            <AnimatePresence>
                {showCreateAgent && <CreateAgent
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClose={handleCloseCreateAgent}
                />}
            </AnimatePresence>

            <EditAgentForm
                item={selectedAgent}
                onClose={handleCloseEditAgent}
                showForm={showEditAgent}
                onDeleteItem={handleDeleteAgent}
            />

            <AgentsTable
                items={agents}
                itemsPerPage={10}
                currentItems={agents}
                onEditItem={handleShowEditAgent}
                onDeleteItem={handleDeleteAgent}
            />

        </div>
    )
}

export default AgentsPage