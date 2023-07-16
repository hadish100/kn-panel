import React, { useState } from 'react'
import Search from '../../components/Search'
import Button from '../../components/Button'
import AdminPanelsTable from '../../components/admin/AgentsTable'
import AdminUsageStats from '../../components/admin/UsageStats'
import AddPanelForm from '../../components/admin/AgentForm'
import { AnimatePresence } from 'framer-motion'
import { ReactComponent as RefreshIcon } from '../../assets/svg/refresh.svg'
import './AgentsPage.css'

let users = [
    {
        id: 1,
        status: 1,
        name: "hamed",
        dataUsage: "3520 GB",
        remainingData: "1000 GB",
        allocatableData: "150 GB",
        prefix: "GAN",
        activeUsers: "200 / 400",
        country: "NL"
    },
    {
        id: 2,
        status: 0,
        name: "smart",
        dataUsage: "2000 GB",
        remainingData: "300 GB",
        allocatableData: "200 GB",
        prefix: "SMART",
        activeUsers: "300 / 500",
        country: "DE"
    },
    {
        id: 3,
        status: 1,
        name: "asghar",
        dataUsage: "2500 GB",
        remainingData: "100 GB",
        allocatableData: "30 GB",
        prefix: "TEST",
        activeUsers: "12 / 100",
        country: "DE"
    }]

const AgetnsPage = () => {
    const [showModal, setShowModal] = useState(false)

    const handleClick2 = () => {
        setShowModal(true)
    }

    const handleClose = () => {
        setShowModal(false)
    }

    return (
        <>
            <div className='admin_panels_body'>
                <AdminUsageStats dataUsage="8020 GB" activeUsers={512} totalUsers={1000} />
                <div className="container flex items-center justify-between   column-reverse items-end gap-16">
                    <Search />
                    <span style={{ display: "flex", gap: "0.5rem" }} className='items-center'>
                        <Button className="transparent refresh"><RefreshIcon /></Button>
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

                <AdminPanelsTable users={users} rowsPerPage={10} currentRows={users} />

            </div>
        </>
    )
}

export default AgetnsPage