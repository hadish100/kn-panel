import React, { useState } from 'react'
import Search from '../../components/Search'
import Button from '../../components/Button'
import PanelsTable from '../../components/admin/PanelsTable'
import PanelForm from '../../components/admin/PanelForm'
import UsageStats from '../../components/admin/UsageStats'
import { AnimatePresence } from 'framer-motion'
import { ReactComponent as RefreshIcon } from '../../assets/svg/refresh.svg'
import './PanelsPage.css'

let users = [
    {
        id: 1,
        status: 1,
        name: "ir1",
        dataUsage: "1300 GB",
        activeUsers: "200 / 300",
        capacity: "400",
        traffic: "7000 GB",
        country: "NL"
    },
    {
        id: 2,
        status: 0,
        name: "v1",
        dataUsage: "200 TB",
        activeUsers: "300 / 400",
        capacity: "500",
        traffic: "500 TB",
        country: "DE"
    }]

const PanelsPage = () => {
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
                <UsageStats dataUsage="201.3 TB" activeUsers={500} totalUsers={900} />
                <div className="container flex items-center justify-between   column-reverse items-end gap-16">
                    <Search />
                    <span style={{ display: "flex", gap: "0.5rem" }} className='items-center'>
                        <Button className="transparent refresh"><RefreshIcon /></Button>
                        <Button onClick={handleClick2} className="create-user-button primary">Add Panel</Button>
                    </span>
                </div>

                <AnimatePresence>
                    {showModal && <PanelForm
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        handleClose={handleClose}
                    />}
                </AnimatePresence>

                <PanelsTable users={users} rowsPerPage={10} currentRows={users} />

            </div>
        </>
    )
}

export default PanelsPage