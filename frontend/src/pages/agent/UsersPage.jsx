import React, { useState } from 'react'

import UsageStats from '../../components/agent/UsageStats'
import UsersTable from '../../components/agent/UsersTable'
import Button from '../../components/Button'
import CreateUserForm from '../../components/agent/CreateUserForm'
import Search from '../../components/Search'
import { AnimatePresence } from 'framer-motion'
import { ReactComponent as RefreshIcon } from '../../assets/svg/refresh.svg'
import './UsersPage.css'
import Pagination from '../../components/Pagination'
import Dropdown from '../../components/Dropdown'
import EditUserForm from '../../components/agent/EditUserForm'

// var users =
//     [
//         {
//             id: 1,
//             username: "TEST1",
//             isActive: false,
//             expireTime: {
//                 days: 15,
//                 hours: 12,
//                 minutes: 42
//             },
//             dataUsage: 1024785,
//             totalData: 2006753,
//             subscriptionLink: "https://www.google.com",
//             config: "loreamasndlasdobobllb32o39232o2b39g9gib21neo1hn//a/sd/454/"
//         }, 
//         {
//             id: 2,
//             username: "TEST2",
//             isActive: true,
//             expireTime: {
//                 days: 24,
//                 hours: 24,
//                 minutes: 32
//             },
//             dataUsage: 350766210,
//             totalData: 2008976720,
//             subscriptionLink: "https://www.google.com",
//             config: "loreamasndlasdobobllb32o39232o2b39g9gib21neo1hn//a/sd/454/"
//         },
//         {
//             id: 3,
//             username: "TEST3",
//             isActive: true,
//             expireTime: {
//                 days: 11,
//                 hours: 24,
//                 minutes: 32
//             },
//             dataUsage: 3008976720,
//             totalData: 3008976720,
//             subscriptionLink: "https://www.google.com",
//             config: "loreamasndlasdobobllb32o39232o2b39g9gib21neo1hn//a/sd/454/"
//         }];

const UsersPage = () => {
    const [showCreateModal, setShowCreateModal] = useState(false)
    const [showEditModal, setShowEditModal] = useState(false)
    const [rowsPerPage, setRowsPerPage] = useState(10)
    const [selection, setSelection] = useState(null)
    const [currentPage, setCurrentPage] = useState(1)

      var { users } = JSON.parse(sessionStorage.getItem("users"));
        users.reverse();
    console.log(users)
 
    const handleClick = () => {
        setShowCreateModal(true)
        console.log(currentRows.length)
    }

    const handleClose = () => {
        setShowCreateModal(false)
    }

    const handlePageChange = (page) => {
        setCurrentPage(page)
    }

    const handleCloseEditModal = () => {
        setShowEditModal(false)
    }

    const LastRowIndex = currentPage * rowsPerPage
    const FirstRowIndex = LastRowIndex - rowsPerPage
    console.log(FirstRowIndex,LastRowIndex)
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
            <UsageStats activeUsers={10} totalUsers={549} dataUsage="1 GB" remainingData="198 GB" allocableData="1 TB" />
            <div className="container flex items-center justify-between   column-reverse items-end gap-16">
                <Search />
                <span style={{ display: "flex", gap: "0.5rem" }} className='items-center'>
                    <Button className="outlined refresh-icon"><RefreshIcon /></Button>
                    <Button onClick={handleClick} className="create-user-button primary">Create User</Button>
                </span>
            </div>
            <AnimatePresence>
                {showCreateModal && <CreateUserForm
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    handleClose={handleClose}
                />}
            </AnimatePresence>
            <UsersTable currentRows={currentRows} setShowEditModal={setShowEditModal} />
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
            <EditUserForm handleClose={handleCloseEditModal} showModal={showEditModal} />
        </div >

    )
}

export default UsersPage