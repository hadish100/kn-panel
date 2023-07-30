import React, { useState, useEffect } from 'react'
import axios from 'axios'

import UsageStats from '../../components/agent/UsageStats'
import UsersTable from '../../components/agent/UsersTable'
import Button from '../../components/Button'
import CreateUser from '../../components/agent/CreateUser'
import Search from '../../components/Search'
import { AnimatePresence } from 'framer-motion'
import { ReactComponent as RefreshIcon } from '../../assets/svg/refresh.svg'
import './UsersPage.css'
import Pagination from '../../components/Pagination'
import Dropdown from '../../components/Dropdown'
import EditUser from '../../components/agent/EditUser'
import VerifyDelete from '../../components/admin/VerifyDelete'
import loadingGif from '../../assets/loading.gif'
import "../../components/LoadingGif.css"


const UsersPage = () => {
    const [showCreateUser, setShowCreateUser] = useState(false)
    const [showEditUser, setShowEditUser] = useState(false)
    const [rowsPerPage, setRowsPerPage] = useState(10)
    const [selection, setSelection] = useState(null)
    const [currentPage, setCurrentPage] = useState(1)
    const [selectedUser, setSelectedUser] = useState(null)
    const [showVerifyDelete, setShowVerifyDelete] = useState(false)
    const [users, setUsers] = useState([])
    const [refresh, setRefresh] = useState(false);


    useEffect(() => {
        const { users } = JSON.parse(sessionStorage.getItem("users"));
        setUsers(users)
    }, [])

    var agent = JSON.parse(sessionStorage.getItem("agent"));

    const b2gb = (bytes) => {
        return (bytes / (2 ** 10) ** 3).toFixed(1);
    }

    const handleDeleteUser = async (e, username) => {
        setShowEditUser(true)
    }

    
    const refreshItems = async () => {
        setRefresh(true);
        const access_token = sessionStorage.getItem("access_token");
        axios.post("/get_users",{access_token}).then(res => 
        {
            sessionStorage.setItem("users", JSON.stringify(res.data));
            setRefresh(false);
        });
    }

    const handleVerifyDelete = async (e, username) => {
        e.stopPropagation();
        username = selectedUser.username;
        const access_token = sessionStorage.getItem("access_token");
        await axios.post("/delete_user", { access_token, username });
        let { users } = (await axios.post("/get_users", { access_token })).data;
        sessionStorage.setItem("users", JSON.stringify(users))
        setUsers(users)
        setShowVerifyDelete(false)
        setShowEditUser(false)
    }

    const handleShowCreateUser = () => {
        setShowCreateUser(true)
    }

    const handleCloseCreateUser = () => {
        setShowCreateUser(false)
        setUsers(JSON.parse(sessionStorage.getItem("users")).users)
    }

    const handlePageChange = (page) => {
        setCurrentPage(page)
    }

    const handleCloseVerifyDelete = () => {
        setShowVerifyDelete(false)
    }

    const handleCloseEditUser = () => {
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
            <UsageStats activeUsers={agent.active_user} totalUsers={agent.total_users} dataUsage={b2gb(agent.used_traffic) + " GB"} remainingData={b2gb(agent.volume) + " GB"} allocableData={b2gb(agent.weight_dividable
            ) + " GB"} />
            <div className="container flex items-center justify-between   column-reverse items-end gap-16">
            <Search items={users} setItems={setUsers} mode="3" />
                <span style={{ display: "flex", gap: "0.5rem" }} className='items-center'>
                    <Button onClick={refreshItems} className="outlined refresh-icon"><RefreshIcon /></Button>
                    <Button onClick={handleShowCreateUser} className="create-user-button primary">Create User</Button>
                </span>
            </div>
            <AnimatePresence>
                {showCreateUser && <CreateUser
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClose={handleCloseCreateUser}
                    showForm={showCreateUser}
                    items={users} 
                />} 
            </AnimatePresence>

            {refresh && <div className='loading_gif_container'> <img src={loadingGif} className='loading_gif' /> </div>}
       {!refresh  &&   <UsersTable
                items={users}
                currentItems={currentRows}
                onCreateItem={handleShowCreateUser}
                onEditItem={handleShowEditUser}
            /> }
            <div className='users-page__footer'>
                <span style={{ display: "flex" }}>
                    <Dropdown options={itemsPerRowOptions} value={selection} onChange={handleSelect}>Items per page</Dropdown>
                    <span style={{ fontSize: "0.75rem", color: "var(--dark-clr-200)", marginLeft: "0.5rem", marginTop: "0.5rem" }}>Items per page</span>
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