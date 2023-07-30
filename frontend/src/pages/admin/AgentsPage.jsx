import React, { useState, useEffect } from 'react'
import axios from 'axios'

import Search from '../../components/Search'
import Button from '../../components/Button'
import AgentsTable from '../../components/admin/AgentsTable'
import AdminUsageStats from '../../components/admin/UsageStats'
import CreateAgent from '../../components/admin/CreateAgent'
import { AnimatePresence } from 'framer-motion'
import { ReactComponent as RefreshIcon } from '../../assets/svg/refresh.svg'
import EditAgent from '../../components/admin/EditAgent'
import VerifyDelete from '../../components/admin/VerifyDelete'
import './AgentsPage.css'

const AgentsPage = () => {
    const [showCreateAgent, setShowCreateAgent] = useState(false);
    const [showEditAgent, setShowEditAgent] = useState(false)
    const [showVerifyDelete, setShowVerifyDelete] = useState(false)
    const [agents, setAgents] = useState([])
    const [selectedAgent, setSelectedAgent] = useState(null)

    useEffect(() => {
        setAgents(JSON.parse(sessionStorage.getItem("agents")))
    }, [])

    const handleDeleteAgent = async (e, agent_id) => {
        setShowVerifyDelete(true)
    }

    const handleVerifyDelete = async (e, agent_id) => {
        e.stopPropagation();
        agent_id = selectedAgent.id;
        const access_token = sessionStorage.getItem("access_token");
        await axios.post("/delete_agent", { access_token, agent_id });
        let agents = (await axios.post("/get_agents", { access_token })).data;
        console.log(agents);
        sessionStorage.setItem("agents", JSON.stringify(agents))
        setAgents(agents)
        setShowVerifyDelete(false)
        setShowEditAgent(false)
    }

    const handlePowerAgent = async (agent_id,disabled) => {
        const access_token = sessionStorage.getItem("access_token");
        console.log(disabled) 
        if(disabled) await axios.post("/enable_agent", { access_token, agent_id });
        else await axios.post("/disable_agent", { access_token, agent_id });
        var agents = (await axios.post("/get_agents", { access_token })).data;
        sessionStorage.setItem("agents", JSON.stringify(agents));
        setAgents(agents)
        setShowEditAgent(false)
        console.log(agents);

    }


    const handleEditAgent = async (agent_id,agent_name,username,password,volume,minimum_volume,maximum_user,maximum_day,prefix,country) => {

        const access_token = sessionStorage.getItem("access_token");
        await axios.post("/edit_agent", { agent_id,agent_name,username,password,volume,minimum_volume,maximum_user,maximum_day,prefix,country,access_token });
        var agents = (await axios.post("/get_agents", { access_token })).data;
        sessionStorage.setItem("agents", JSON.stringify(agents));
        setAgents(agents)
        setShowEditAgent(false)
        console.log(agents);

    }



    const handleShowCreatePanel = () => {
        setShowCreateAgent(true)
    }

    const handleCloseCreateAgent = () => {
        setShowCreateAgent(false)
        setAgents(JSON.parse(sessionStorage.getItem("agents")))
    }

    const handleCloseEditAgent = () => {
        setShowEditAgent(false)
    }

    const handleCloseVerifyDelete = () => {
        setShowVerifyDelete(false)
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

            <EditAgent
                item={selectedAgent}
                onClose={handleCloseEditAgent}
                showForm={showEditAgent}
                onDeleteItem={handleDeleteAgent}
                onPowerItem={handlePowerAgent}
                onEditItem={handleEditAgent}
            />


            <VerifyDelete
                onClose={handleCloseVerifyDelete}
                showForm={showVerifyDelete}
                onDeleteItem={handleVerifyDelete}
            />

            <AgentsTable
                items={agents}
                itemsPerPage={10}
                currentItems={agents}
                onEditItem={handleShowEditAgent}
                onDeleteItem={handleDeleteAgent}
                onCreateItem={handleShowCreatePanel}
            />

        </div>
    )
}

export default AgentsPage