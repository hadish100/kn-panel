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
    const [showCreatePanel, setShowCreatePanel] = useState(false)
    const [showEditPanel, setShowEditPanel] = useState(false)

    var panels = JSON.parse(sessionStorage.getItem("panels"));

    const handleCreatePanel = () => {
        setShowCreatePanel(true)
    }

    const handleCloseCreatePanel = () => {
        setShowCreatePanel(false)
    }

    const handleCloseEditPanel = () => {
        setShowEditPanel(false)
    }

    return (
        <div className='admin_panels_body'>
            <UsageStats dataUsage="201.3 TB" activeUsers={500} totalUsers={900} />
            <div className="container flex items-center justify-between   column-reverse items-end gap-16">
                <Search />
                <span style={{ display: "flex", gap: "0.5rem" }} className='items-center'>
                    <Button className="outlined refresh"><RefreshIcon /></Button>
                    <Button onClick={handleCreatePanel} className="create-user-button primary">Create Panel</Button>
                </span>
            </div>

            <AnimatePresence>
                {showCreatePanel && <AddPanelForm
                    onClose={handleCloseCreatePanel}
                />}
            </AnimatePresence>

            <EditPanelForm onClose={handleCloseEditPanel} showFrom={showEditPanel} />

            <PanelsTable
                items={panels}
                itemsPerPage={10}
                currentItems={panels}
                onEditItem={setShowEditPanel}
                onCreateItem={handleCreatePanel}
            />
        </div>
    )
}

export default PanelsPage