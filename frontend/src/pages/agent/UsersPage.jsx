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



const UsersPage = () => {
    const [showModal, setShowModal] = useState(false)
    const [rowsPerPage, setRowsPerPage] = useState(10)
    const [selection, setSelection] = useState(null)
    const [currentPage, setCurrentPage] = useState(1)

    var users = JSON.parse(sessionStorage.getItem("users"));

    const handleClick = () => {
        setShowModal(true)
        console.log(currentRows.length)
    }

    const handleClose = () => {
        setShowModal(false)
    }

    const handlePageChange = (page) => {
        setCurrentPage(page)
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
            <UsageStats activeUsers={10} totalUsers={549} dataUsage="1 GB" remainingData="198 GB" allocableData="1 TB" />
            <div className="container flex items-center justify-between   column-reverse items-end gap-16">
                <Search />
                <span style={{ display: "flex", gap: "0.5rem" }} className='items-center'>
                    <Button className="outlined refresh-icon"><RefreshIcon /></Button>
                    <Button onClick={handleClick} className="create-user-button primary">Create User</Button>
                </span>
            </div>
            <AnimatePresence>
                {showModal && <CreateUserForm
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    handleClose={handleClose}
                />}
            </AnimatePresence>
            <UsersTable users={users} rowsPerPage={rowsPerPage} currentRows={currentRows} />
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
        </div >

    )
}

export default UsersPage