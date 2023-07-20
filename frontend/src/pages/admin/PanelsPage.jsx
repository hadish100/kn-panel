import React, { useState } from 'react'

import Search from '../../components/Search'
import Button from '../../components/Button'
import PanelsTable from '../../components/admin/PanelsTable'
import AddPanelForm from '../../components/admin/AddPanelForm'
import UsageStats from '../../components/admin/UsageStats'
import { AnimatePresence } from 'framer-motion'
import { ReactComponent as RefreshIcon } from '../../assets/svg/refresh.svg'
import EditPanelForm from '../../components/admin/EditPanelForm'
import './PanelsPage.css'


const PanelsPage = () => {
    const [showAddModal, setShowAddModal] = useState(false)
    const [showEditModal, setShowEditModal] = useState(false)

    var panels = JSON.parse(sessionStorage.getItem("panels"));

    const handleClick = () => {
        setShowAddModal(true)
    }

    const handleCloseAddModal = () => {
        setShowAddModal(false)
    }

    const handleCloseEditModal = () => {
        setShowEditModal(false)
    }

    return (
        <div className='admin_panels_body'>
            <UsageStats dataUsage="201.3 TB" activeUsers={500} totalUsers={900} />
            <div className="container flex items-center justify-between   column-reverse items-end gap-16">
                <Search />
                <span style={{ display: "flex", gap: "0.5rem" }} className='items-center'>
                    <Button className="outlined refresh"><RefreshIcon /></Button>
                    <Button onClick={handleClick} className="create-user-button primary">Add Panel</Button>
                </span>
            </div>

            <AnimatePresence>
                {showAddModal && <AddPanelForm
                    handleClose={handleCloseAddModal}
                />}
            </AnimatePresence>

            <EditPanelForm handleClose={handleCloseEditModal} showModal={showEditModal} />

            <PanelsTable users={panels} rowsPerPage={10} currentRows={panels} setShowEditModal={setShowEditModal} />
        </div>
    )
}

export default PanelsPage