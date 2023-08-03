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
import loadingGif from '../../assets/loading.gif'
import "../../components/LoadingGif.css"
import ErrorCard from '../../components/ErrorCard';

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
    const [users, setUsers] = useState([])
    const [refresh, setRefresh] = useState(false);


    useEffect(() => {
        const users = JSON.parse(sessionStorage.getItem("users"));
        setUsers(users)
    }, [])

    const [agent, setAgent] = useState(JSON.parse(sessionStorage.getItem("agent")));

    const b2gb = (bytes) => {
        return (bytes / (2 ** 10) ** 3).toFixed(2);
    }

    const handleDeleteUser = async (e, username) => {
        setShowVerifyDelete(true)
    }


    const refreshItems = async () => {
        setRefresh(true);
        const access_token = sessionStorage.getItem("access_token");

        var agent = (await axios.post("/get_agent", { access_token })).data
        if (agent.status == "ERR") {
            setError_msg(agent.msg)
            setHasError(true)
            return;
        }
        sessionStorage.setItem("agent", JSON.stringify(agent))
        setAgent(agent)
        axios.post("/get_users", { access_token }).then(res => {
            if (res.data.status == "ERR") {
                setError_msg(res.data.msg)
                setHasError(true)
                return;
            }
            sessionStorage.setItem("users", JSON.stringify(res.data));
            setUsers(res.data);
            setRefresh(false);
        });
    }

    const handleVerifyDelete = async (e, username) => {
        e.stopPropagation();
        username = selectedUser.username;
        const access_token = sessionStorage.getItem("access_token");
        var req_res = await axios.post("/delete_user", { access_token, username });
        if (req_res.data.status == "ERR") {
            setError_msg(req_res.data.msg)
            setHasError(true)
            return;
        }
        let users = (await axios.post("/get_users", { access_token })).data;
        if (users.status == "ERR") {
            setError_msg(users.msg)
            setHasError(true)
            return;
        }
        var agent = (await axios.post("/get_agent", { access_token })).data
        if (agent.status == "ERR") {
            setError_msg(agent.msg)
            setHasError(true)
            return;
        }
        sessionStorage.setItem("agent", JSON.stringify(agent))
        setAgent(agent)
        sessionStorage.setItem("users", JSON.stringify(users))
        setUsers(users)
        setShowVerifyDelete(false)
        setShowEditUser(false)
    }

    async function handlePowerUser(e, user_id, status) {
        e.stopPropagation();
        console.log(status)
        const access_token = sessionStorage.getItem("access_token");
        var req_res;
        if (status == "active") req_res = await axios.post("/disable_user", { access_token, user_id });
        else req_res = await axios.post("/enable_user", { access_token, user_id });
        if (req_res.data.status == "ERR") {
            setError_msg(req_res.data.msg)
            setHasError(true)
            return;
        }
        var users = (await axios.post("/get_users", { access_token })).data;
        if (users.status == "ERR") {
            setError_msg(users.msg)
            setHasError(true)
            return;
        }
        var agent = (await axios.post("/get_agent", { access_token })).data
        if (agent.status == "ERR") {
            setError_msg(agent.msg)
            setHasError(true)
            return;
        }
        sessionStorage.setItem("agent", JSON.stringify(agent))
        setAgent(agent)
        var slctd = users.find(user => user.id === user_id);
        setSelectedUser(slctd)
        sessionStorage.setItem("users", JSON.stringify(users));
        setUsers(users);
    }

    const handleEditUser = async (user_id, data_limit, expire, country) => {
        const access_token = sessionStorage.getItem("access_token");
        var req_res = await axios.post("/edit_user", { access_token, user_id, data_limit, expire, country });
        if (req_res.data.status == "ERR") {
            setError_msg(req_res.data.msg)
            setHasError(true)
            return;
        }

        let users = (await axios.post("/get_users", { access_token })).data;
        if (users.status == "ERR") {
            setError_msg(users.msg)
            setHasError(true)
            return;
        }
        let agent = (await axios.post("/get_agent", { access_token })).data;
        if (agent.status == "ERR") {
            setError_msg(agent.msg)
            setHasError(true)
            return;
        }
        console.log("###");
        console.log(agent);
        console.log("###");
        sessionStorage.setItem("users", JSON.stringify(users))
        sessionStorage.setItem("agent", JSON.stringify(agent))
        setUsers(users)
        setAgent(agent)
        setShowEditUser(false)
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

    const handleCloseEditUser = () => {
        setUsers(JSON.parse(sessionStorage.getItem("users")))
        setAgent(JSON.parse(sessionStorage.getItem("agent")))
        setShowEditUser(false)
    }

    const handleShowEditUser = (item) => {
        setSelectedUser(item)
        setShowEditUser(true)
    }

    const LastRowIndex = currentPage * rowsPerPage
    const FirstRowIndex = LastRowIndex - rowsPerPage
    const currentRows = users.slice(FirstRowIndex, LastRowIndex)

    const totalPages = Math.ceil(users.length / rowsPerPage)

    const handleSelect = (option) => {
        setSelection(option)
        setRowsPerPage(option.value)
    }

    const itemsPerRowOptions = [
        { label: 10, value: 10 },
        { label: 20, value: 20 },
        { label: 30, value: 30 },
    ]

    return (

        <div className='panel_body'>
            <UsageStats activeUsers={agent.active_users} totalUsers={agent.total_users} dataUsage={agent.used_traffic + " GB"} remainingData={agent.volume + " GB"} allocableData={agent.allocatable_data + " GB"} />
            <div className="container flex items-center justify-between   column-reverse items-end gap-16">
                <Search items={users} setItems={setUsers} mode="3" />
                <span style={{ display: "flex", gap: "0.5rem" }} className='items-center'>
                    <Button onClick={refreshItems} className="outlined refresh-icon"><RefreshIcon /></Button>
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

            {refresh && <div className='loading_gif_container'> <img src={loadingGif} className='loading_gif' /> </div>}
            {!refresh && <UsersTable
                items={users}
                currentItems={currentRows}
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
                onEditItem={handleEditUser}
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
            />
        </div >

    )
}

export default UsersPage