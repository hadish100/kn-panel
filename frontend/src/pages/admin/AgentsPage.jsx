import React, { useState, useEffect } from 'react'
import axios from 'axios'

import Search from '../../components/Search'
import Button from '../../components/Button'
import AgentsTable from '../../components/admin/AgentsTable'
import { useNavigate } from 'react-router-dom'
import AgentStats from '../../components/admin/AgentStats'
import CreateAgent from '../../components/admin/CreateAgent'
import { ReactComponent as RefreshIcon } from '../../assets/svg/refresh.svg'
import EditAgent from '../../components/admin/EditAgent'
import VerifyDelete from '../../components/admin/VerifyDelete'
import './AgentsPage.css'
import "../../components/LoadingGif.css"
import ErrorCard from '../../components/ErrorCard'
import CircularProgress from '../../components/CircularProgress'
import gbOrTb from "../../utils/gbOrTb"


const AgentsPage = () => {
    const [showCreateAgent, setShowCreateAgent] = useState(false)
    const [showEditAgent, setShowEditAgent] = useState(false)
    const [error_msg, setError_msg] = useState("")
    const [hasError, setHasError] = useState(false)
    const [refresh, setRefresh] = useState(false)
    const [showVerifyDelete, setShowVerifyDelete] = useState(false)
    const [agents, setAgents] = useState([])
    const [selectedAgent, setSelectedAgent] = useState(null)
    const [searchedAgents, setSearchedAgents] = useState("")
    const [editMode, setEditMode] = useState(false)
    const [deleteMode, setDeleteMode] = useState(false)
    const [isEnablingAllUsers, setIsEnablingAllUsers] = useState(false)
    const [isDisablingAllUsers, setIsDisablingAllUsers] = useState(false)
    const [isDeletingAllUsers, setIsDeletingAllUsers] = useState(false)
    const [showDeleteAllUsers, setShowDeleteAllUsers] = useState(false)
    const [showDisableAllUsers, setShowDisableAllUsers] = useState(false)
    const [showEnableAllUsers, setShowEnableAllUsers] = useState(false)
    const navigate = useNavigate()

    useEffect(() => {
        setAgents((JSON.parse(sessionStorage.getItem("agents"))).filter((item) => {
            return item["name"].toLowerCase().includes(searchedAgents.toLowerCase())
        }))
    }, [searchedAgents])

    const handleDeleteAgent = async (e, agent_id) => {
        setShowVerifyDelete(true)
    }

    const refreshItems = async () => {
        setRefresh(true)
        const access_token = sessionStorage.getItem("access_token")
        axios.post("/get_agents", { access_token }).then(res => {

            if (res.data.status === "ERR") {
                setError_msg(res.data.msg)
                setHasError(true)
                return
            }


            sessionStorage.setItem("agents", JSON.stringify(res.data))
            setAgents(JSON.parse(sessionStorage.getItem("agents")))
            setRefresh(false)
        })
    }

    const handleAdminAsAgent = async (e, username, password) => {
        var res

        try { res = await axios.post("/login", { username, password }, { timeout: 20000 }) }

        catch (err) {
            if (err.response.status == 401) setError_msg("Please check your username and password")
            else setError_msg("server is not responding")
            res = {}
            res.data = "ERR"
        }


        if (res.data === "ERR") {
            setHasError(true)
        }


        else {
            var access_token = res.data.access_token
            sessionStorage.setItem("isLoggedIn", "true")
            sessionStorage.setItem("access_token", res.data.access_token)

            try {
                //var users = (await axios.post("/get_users", { access_token }, { timeout: 20000 })).data;
                var agent = (await axios.post("/get_agent", { access_token }, { timeout: 20000 })).data
                //sessionStorage.setItem("users", JSON.stringify(users.data_obj));
                sessionStorage.setItem("agent", JSON.stringify(agent))
                window.location.href = "/agent/users"
            }

            catch (err) {
                setError_msg("server is not responding")
                setHasError(true)
            }

        }

    }

    const handleVerifyDelete = async (e, agent_id) => {
        e.stopPropagation()
        setDeleteMode(true)
        agent_id = selectedAgent.id
        const access_token = sessionStorage.getItem("access_token")
        var req_res = await axios.post("/delete_agent", { access_token, agent_id })
        if (req_res.data.status === "ERR") {
            setError_msg(req_res.data.msg)
            setHasError(true)
            setDeleteMode(false)
            return
        }
        let agents = (await axios.post("/get_agents", { access_token })).data
        if (agents.status === "ERR") {
            setError_msg(agents.msg)
            setHasError(true)
            setDeleteMode(false)
            return
        }
        sessionStorage.setItem("agents", JSON.stringify(agents))
        setAgents(agents)
        setShowVerifyDelete(false)
        setShowEditAgent(false)
        setDeleteMode(false)
    }

    const handlePowerAgent = async (agent_id, disabled) => {
        const access_token = sessionStorage.getItem("access_token")
        var req_res
        if (disabled) req_res = await axios.post("/enable_agent", { access_token, agent_id })
        else req_res = await axios.post("/disable_agent", { access_token, agent_id })
        if (req_res.data.status === "ERR") {
            setError_msg(req_res.data.msg)
            setHasError(true)
            return
        }
        var agents = (await axios.post("/get_agents", { access_token })).data
        if (agents.status === "ERR") {
            setError_msg(agents.msg)
            setHasError(true)
            return
        }
        sessionStorage.setItem("agents", JSON.stringify(agents))
        setAgents(agents)
        var slctd = agents.find(agent => agent.id === agent_id)
        setSelectedAgent(slctd)
    }

    const handlePowerAgent2 = async (agent_id, disabled) => {
        const access_token = sessionStorage.getItem("access_token")
        var req_res
        if (disabled) req_res = await axios.post("/enable_agent_create_access", { access_token, agent_id })
        else req_res = await axios.post("/disable_agent_create_access", { access_token, agent_id })
        if (req_res.data.status === "ERR") {
            setError_msg(req_res.data.msg)
            setHasError(true)
            return
        }
        var agents = (await axios.post("/get_agents", { access_token })).data
        if (agents.status === "ERR") {
            setError_msg(agents.msg)
            setHasError(true)
            return
        }
        sessionStorage.setItem("agents", JSON.stringify(agents))
        setAgents(agents)
        var slctd = agents.find(agent => agent.id === agent_id)
        setSelectedAgent(slctd)
    }

    const handlePowerAgent3 = async (agent_id, disabled) => {
        const access_token = sessionStorage.getItem("access_token")
        var req_res
        if (disabled) req_res = await axios.post("/enable_agent_edit_access", { access_token, agent_id })
        else req_res = await axios.post("/disable_agent_edit_access", { access_token, agent_id })
        if (req_res.data.status === "ERR") {
            setError_msg(req_res.data.msg)
            setHasError(true)
            return
        }
        var agents = (await axios.post("/get_agents", { access_token })).data
        if (agents.status === "ERR") {
            setError_msg(agents.msg)
            setHasError(true)
            return
        }
        sessionStorage.setItem("agents", JSON.stringify(agents))
        setAgents(agents)
        var slctd = agents.find(agent => agent.id === agent_id)
        setSelectedAgent(slctd)
    }

    const handlePowerAgent4 = async (agent_id, disabled) => {
        const access_token = sessionStorage.getItem("access_token")
        var req_res
        if (disabled) req_res = await axios.post("/enable_agent_delete_access", { access_token, agent_id })
        else req_res = await axios.post("/disable_agent_delete_access", { access_token, agent_id })
        if (req_res.data.status === "ERR") {
            setError_msg(req_res.data.msg)
            setHasError(true)
            return
        }
        var agents = (await axios.post("/get_agents", { access_token })).data
        if (agents.status === "ERR") {
            setError_msg(agents.msg)
            setHasError(true)
            return
        }
        sessionStorage.setItem("agents", JSON.stringify(agents))
        setAgents(agents)
        var slctd = agents.find(agent => agent.id === agent_id)
        setSelectedAgent(slctd)
    }


    const DeleteAllUsers = async (agent_id) =>
    {
        setIsDeletingAllUsers(true)
        const access_token = sessionStorage.getItem("access_token")
        var req_res = await axios.post("/delete_all_agent_users", { access_token, agent_id })
        if (req_res.data.status === "ERR") {
            setError_msg(req_res.data.msg)
            setHasError(true)
            setIsDeletingAllUsers(false)
            return
        }
        setIsDeletingAllUsers(false)
        setShowDeleteAllUsers(false)
    }

    const EnableAllUsers = async (agent_id) =>
    {
        setIsEnablingAllUsers(true)
        const access_token = sessionStorage.getItem("access_token")
        var req_res = await axios.post("/enable_all_agent_users", { access_token, agent_id })
        if (req_res.data.status === "ERR") {
            setError_msg(req_res.data.msg)
            setHasError(true)
            setIsEnablingAllUsers(false)
            return
        }
        setIsEnablingAllUsers(false)
        setShowEnableAllUsers(false)
    }

    const DisableAllUsers = async (agent_id) =>
    {
        setIsDisablingAllUsers(true)
        const access_token = sessionStorage.getItem("access_token")
        var req_res = await axios.post("/disable_all_agent_users", { access_token, agent_id })
        if (req_res.data.status === "ERR") {
            setError_msg(req_res.data.msg)
            setHasError(true)
            setIsDisablingAllUsers(false)
            return
        }
        setIsDisablingAllUsers(false)
        setShowDisableAllUsers(false)
    }


    const handleEditAgent = async (agent_id, name, username, password, volume, min_vol, max_users, max_days, prefix, country, max_non_active_days, business_mode) => {
        setEditMode(true)
        const access_token = sessionStorage.getItem("access_token")
        var req_res = await axios.post("/edit_agent", { agent_id, name, username, password, volume, min_vol, max_users, max_days, prefix, country, access_token, max_non_active_days, business_mode })
        if (req_res.data.status === "ERR") {
            setError_msg(req_res.data.msg)
            setHasError(true)
            setEditMode(false)
            return
        }
        var agents = (await axios.post("/get_agents", { access_token })).data
        if (agents.status === "ERR") {
            setError_msg(agents.msg)
            setHasError(true)
            setEditMode(false)
            return
        }
        sessionStorage.setItem("agents", JSON.stringify(agents))
        setAgents(agents)
        setShowEditAgent(false)
        setEditMode(false)
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


    var total_agent_count = agents.length
    var total_active_agent_count = agents.filter(agent => agent.disable === 0).length
    var total_data_usage = parseFloat(agents.reduce((acc, agent) => acc + agent.used_traffic, 0)).toFixed(2)




    return (
        <div className='admin_panels_body'>
            <AgentStats dataUsage={gbOrTb(total_data_usage)} activeUsers={total_active_agent_count} totalUsers={total_agent_count} />
            <div className="container flex items-center justify-between   column-reverse items-end gap-16">
                <Search value={searchedAgents} onChange={setSearchedAgents} />
                <span style={{ display: "flex", gap: "0.5rem" }} className='items-center'>
                    <Button onClick={refreshItems} className="outlined refresh"><RefreshIcon /></Button>
                    <Button onClick={handleShowCreatePanel} className="create-user-button primary">Create Agent</Button>
                </span>
            </div>

            <CreateAgent
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClose={handleCloseCreateAgent}
                showForm={showCreateAgent}
            />

            <EditAgent
                item={selectedAgent}
                onClose={handleCloseEditAgent}
                showForm={showEditAgent}
                onDeleteItem={handleDeleteAgent}
                onPowerItem={handlePowerAgent}
                onPowerItem2={handlePowerAgent2}
                onPowerItem3={handlePowerAgent3}
                onPowerItem4={handlePowerAgent4}
                DeleteAllUsers={DeleteAllUsers}
                DisableAllUsers={DisableAllUsers}
                EnableAllUsers={EnableAllUsers}
                onEditItem={handleEditAgent}
                onLoginItem={handleAdminAsAgent}
                isEnablingAllUsers={isEnablingAllUsers}
                isDisablingAllUsers={isDisablingAllUsers}
                isDeletingAllUsers={isDeletingAllUsers}
                showDeleteAllUsers={showDeleteAllUsers}
                showEnableAllUsers={showEnableAllUsers}
                showDisableAllUsers={showDisableAllUsers}
                setShowDeleteAllUsers={setShowDeleteAllUsers}
                setShowEnableAllUsers={setShowEnableAllUsers}
                setShowDisableAllUsers={setShowDisableAllUsers}
                editMode={editMode}
            />

            <ErrorCard
                hasError={hasError}
                setHasError={setHasError}
                errorTitle="ERROR"
                errorMessage={error_msg}
            />

            <VerifyDelete
                onClose={handleCloseVerifyDelete}
                showForm={showVerifyDelete}
                onDeleteItem={handleVerifyDelete}
                deleteMode={deleteMode}
            />


            {refresh && <div className='loading_gif_container'> <CircularProgress /> </div>}

            {!refresh && <AgentsTable
                items={agents}
                itemsPerPage={10}
                currentItems={agents}
                onEditItem={handleShowEditAgent}
                onDeleteItem={handleDeleteAgent}
                onCreateItem={handleShowCreatePanel} />}

        </div>
    )
}

export default AgentsPage