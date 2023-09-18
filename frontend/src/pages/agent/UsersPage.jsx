import React, { useState, useEffect } from 'react'
import axios from 'axios'

import UsageStats from '../../components/agent/UsageStats'
import UsersTable from '../../components/agent/UsersTable'
import Button from '../../components/Button'
import CreateUser from '../../components/agent/CreateUser'
import Search from '../../components/Search'
import { ReactComponent as RefreshIcon } from '../../assets/svg/refresh.svg'
import './UsersPage.css'
import Pagination from '../../components/Pagination'
import Dropdown from '../../components/Dropdown'
import EditUser from '../../components/agent/EditUser'
import VerifyDelete from '../../components/admin/VerifyDelete'
import VerifyReset from '../../components/admin/VerifyReset'
import "../../components/LoadingGif.css"
import ErrorCard from '../../components/ErrorCard'
import CircularProgress from '../../components/CircularProgress'
import gbOrTb from "../../utils/gbOrTb"
import SwitchCountries from './SwitchCountries'


const UsersPage = () => {
    const [showCreateUser, setShowCreateUser] = useState(false)
    const [showEditUser, setShowEditUser] = useState(false)
    const [hasError, setHasError] = useState(false)
    const [error_msg, setError_msg] = useState("")
    const [rowsPerPage, setRowsPerPage] = useState(10)
    const [selection, setSelection] = useState(null)
    const [currentPage, setCurrentPage] = useState(1)
    const [selectedUser, setSelectedUser] = useState(null)
    const [showVerifyDelete, setShowVerifyDelete] = useState(false)
    const [showVerifyReset, setShowVerifyReset] = useState(false)
    const [users, setUsers] = useState([])
    const [refresh, setRefresh] = useState(true)
    const [searchedUsers, setSearchedUsers] = useState("")
    const [totalPages, setTotalPages] = useState(1)
    const [editMode, setEditMode] = useState(false)
    const [deleteMode, setDeleteMode] = useState(false)
    const [resetMode, setResetMode] = useState(false)
    const [showSwitchCountries, setShowSwitchCountries] = useState(false)

    const agentInfo = JSON.parse(sessionStorage.getItem("agent"))

    const fetchUsers = async (resetCurrentPage) => {
        const access_token = sessionStorage.getItem("access_token")
        const res = await axios.post("/get_users", {
            access_token,
            number_of_rows: rowsPerPage,
            current_page: currentPage,
            search_filter: searchedUsers
        })
        if (res.data.status === "ERR") {
            setError_msg(res.data.msg)
            setHasError(true)
            return
        }

        else {
            sessionStorage.setItem("users", JSON.stringify(res.data.obj_arr))
            setUsers(res.data.obj_arr)
            setTotalPages(res.data.total_pages)
            setRefresh(false)
            if (resetCurrentPage) setCurrentPage(1)
        }
    }



    useEffect(() => {
        setRefresh(true)
        fetchUsers()
    }, [rowsPerPage, currentPage, searchedUsers])

    const [agent, setAgent] = useState(JSON.parse(sessionStorage.getItem("agent")))

    const b2gb = (bytes) => {
        return (bytes / (2 ** 10) ** 3).toFixed(2)
    }

    const handleDeleteUser = async (e, username) => {
        setShowVerifyDelete(true)
    }

    const handleResetUser = async (e, username) => {
        setShowVerifyReset(true)
    }


    const handleVerifyReset = async (e, username) => {
        e.stopPropagation()
        setResetMode(true)
        username = selectedUser.username
        const access_token = sessionStorage.getItem("access_token")
        var req_res = await axios.post("/reset_user", { access_token, username })
        if (req_res.data.status === "ERR") {
            setError_msg(req_res.data.msg)
            setHasError(true)
            setResetMode(false)
            return
        }
        let users = (await axios.post("/get_users", { access_token, number_of_rows: rowsPerPage, current_page: currentPage })).data
        if (users.status === "ERR") {
            setError_msg(users.msg)
            setHasError(true)
            setResetMode(false)
            return
        }
        var agent = (await axios.post("/get_agent", { access_token })).data
        if (agent.status === "ERR") {
            setError_msg(agent.msg)
            setHasError(true)
            setResetMode(false)
            return
        }
        sessionStorage.setItem("agent", JSON.stringify(agent))
        setAgent(agent)
        sessionStorage.setItem("users", JSON.stringify(users.obj_arr))
        setUsers(users.obj_arr)
        setShowVerifyReset(false)
        // setShowEditUser(false)
        setResetMode(false)
    }


    const refreshItems = async () => {
        setRefresh(true)
        const access_token = sessionStorage.getItem("access_token")

        var agent = (await axios.post("/get_agent", { access_token })).data
        if (agent.status === "ERR") {
            setError_msg(agent.msg)
            setHasError(true)
            return
        }
        sessionStorage.setItem("agent", JSON.stringify(agent))
        setAgent(agent)
        if (currentPage == 1) fetchUsers(true)
        else setCurrentPage(1)
    }

    const handleVerifyDelete = async (e, username) => {
        e.stopPropagation()
        setDeleteMode(true)
        username = selectedUser.username
        const access_token = sessionStorage.getItem("access_token")
        var req_res = await axios.post("/delete_user", { access_token, username })
        if (req_res.data.status === "ERR") {
            setError_msg(req_res.data.msg)
            setHasError(true)
            setDeleteMode(false)
            return
        }
        let users = (await axios.post("/get_users", { access_token, number_of_rows: rowsPerPage, current_page: currentPage })).data
        if (users.status === "ERR") {
            setError_msg(users.msg)
            setHasError(true)
            setDeleteMode(false)
            return
        }
        var agent = (await axios.post("/get_agent", { access_token })).data
        if (agent.status === "ERR") {
            setError_msg(agent.msg)
            setHasError(true)
            setDeleteMode(false)
            return
        }
        sessionStorage.setItem("agent", JSON.stringify(agent))
        setAgent(agent)
        sessionStorage.setItem("users", JSON.stringify(users.obj_arr))
        setUsers(users.obj_arr)
        setShowVerifyDelete(false)
        setShowEditUser(false)
        setDeleteMode(false)
    }

    async function handlePowerUser(e, user_id, status) {
        e.stopPropagation()
        const access_token = sessionStorage.getItem("access_token")
        var req_res
        if (status === "active") req_res = await axios.post("/disable_user", { access_token, user_id })
        else req_res = await axios.post("/enable_user", { access_token, user_id })
        if (req_res.data.status === "ERR") {
            setError_msg(req_res.data.msg)
            setHasError(true)
            return
        }
        var users = (await axios.post("/get_users", { access_token, number_of_rows: rowsPerPage, current_page: currentPage })).data
        console.log(users)
        if (users.status === "ERR") {
            setError_msg(users.msg)
            setHasError(true)
            return
        }
        var agent = (await axios.post("/get_agent", { access_token })).data
        if (agent.status === "ERR") {
            setError_msg(agent.msg)
            setHasError(true)
            return
        }
        sessionStorage.setItem("agent", JSON.stringify(agent))
        setAgent(agent)
        var slctd = users.obj_arr.find(user => user.id === user_id)
        setSelectedUser(slctd)
        sessionStorage.setItem("users", JSON.stringify(users.obj_arr))
        setUsers(users.obj_arr)
    }

    const handleEditUser = async (user_id, data_limit, expire, country,protocols,flow_status,desc) => {
        setEditMode(true)
        console.log(desc)
        const access_token = sessionStorage.getItem("access_token")
        var req_res = await axios.post("/edit_user", { access_token, user_id, data_limit, expire, country,protocols,flow_status,desc })
        if (req_res.data.status === "ERR") {
            setError_msg(req_res.data.msg)
            setHasError(true)
            setEditMode(false)
            return
        }

        let users = (await axios.post("/get_users", { access_token, number_of_rows: rowsPerPage, current_page: currentPage })).data
        if (users.status === "ERR") {
            setError_msg(users.msg)
            setHasError(true)
            setEditMode(false)
            return
        }
        let agent = (await axios.post("/get_agent", { access_token })).data
        if (agent.status === "ERR") {
            setError_msg(agent.msg)
            setHasError(true)
            setEditMode(false)
            return
        }

        sessionStorage.setItem("users", JSON.stringify(users.obj_arr))
        sessionStorage.setItem("agent", JSON.stringify(agent))
        setUsers(users.obj_arr)
        setAgent(agent)
        setShowEditUser(false)
        setEditMode(false)
    }

    const handleShowCreateUser = () => {
        setShowCreateUser(true)
    }

    const handleCloseCreateUser = () => {
        setShowCreateUser(false)
        setUsers(JSON.parse(sessionStorage.getItem("users")))
        setAgent(JSON.parse(sessionStorage.getItem("agent")))
    }

    const handlePageChange = (page) => {
        setCurrentPage(page)
    }

    const handleCloseVerifyDelete = () => {
        setShowVerifyDelete(false)
    }

    const handleCloseVerifyReset = () => {
        setShowVerifyReset(false)
    }

    const handleCloseEditUser = () => {
        setUsers(JSON.parse(sessionStorage.getItem("users")))
        setAgent(JSON.parse(sessionStorage.getItem("agent")))
        setShowEditUser(false)
    }

    const handleShowEditUser = (item) => {
        setSelectedUser(item)
        setShowEditUser(true)
    }

    const handleSelect = (option) => {
        setSelection(option)
        setRowsPerPage(option.value)
    }

    const handleShowSwitchCountries = () => {
        setShowSwitchCountries(true)
    }

    const handleCloseSwitchCountries = () => {
        setShowSwitchCountries(false)
    }

    const itemsPerRowOptions = [
        { label: 10, value: 10 },
        { label: 20, value: 20 },
        { label: 30, value: 30 },
    ]

    return (
        <div className='panel_body'>
            <UsageStats activeUsers={agent.active_users} totalUsers={agent.total_users} remainingUsers={agent.max_users - agent.total_users} dataUsage={gbOrTb(agent.used_traffic)} remainingData={gbOrTb(b2gb(agent.volume))} allocableData={gbOrTb(agent.allocatable_data)} lifetime_volume={gbOrTb(b2gb(agent.lifetime_volume))} business_mode={agent.business_mode} />
            <div className="container flex items-center justify-between   column-reverse items-end gap-16">
                <Search value={searchedUsers} onChange={setSearchedUsers} />
                <span style={{ display: "flex", gap: "0.5rem" }} className='items-center'>
                    <Button onClick={refreshItems} className="outlined refresh-icon"><RefreshIcon /></Button>
                    <Button onClick={handleShowSwitchCountries} className="outlined" disabled={agentInfo.country.split(",").length <= 1}>Switch Countries</Button>
                    <Button onClick={handleShowCreateUser} className="create-user-button primary">Create User</Button>
                </span>
            </div>

            <CreateUser
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClose={handleCloseCreateUser}
                showForm={showCreateUser}
                items={users}
            />

            <SwitchCountries onClose={handleCloseSwitchCountries} showModal={showSwitchCountries} />

            {refresh && <div className='loading_gif_container'> <CircularProgress /> </div>}
            {!refresh && <UsersTable
                items={users}
                currentItems={users}
                onCreateItem={handleShowCreateUser}
                onEditItem={handleShowEditUser}
            />}

            <div className='users-page__footer'>
                <span style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <Dropdown options={itemsPerRowOptions} value={selection} onChange={handleSelect}>Items per page</Dropdown>
                    <span style={{ fontSize: "0.75rem", color: "var(--dark-clr-200)", alignSelf: "start", marginTop: "0.7rem" }}>Items per page</span>
                </span>
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    handlePageChange={handlePageChange}
                />
            </div>

            <EditUser
                onClose={handleCloseEditUser}
                showForm={showEditUser}
                item={selectedUser}
                onDeleteItem={handleDeleteUser}
                onPowerItem={handlePowerUser}
                onResetItem={handleResetUser}
                onEditItem={handleEditUser}
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

            <VerifyReset
                onClose={handleCloseVerifyReset}
                showForm={showVerifyReset}
                onDeleteItem={handleVerifyReset}
                resetMode={resetMode}
            />
        </div >

    )
}

export default UsersPage