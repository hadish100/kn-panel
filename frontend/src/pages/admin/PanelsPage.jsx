import React, { useState, useEffect } from 'react'
import axios from 'axios'

import Search from '../../components/Search'
import Button from '../../components/Button'
import PanelsTable from '../../components/admin/PanelsTable'
import CreatePanel from '../../components/admin/CreatePanel'
import UsageStats from '../../components/admin/UsageStats'
import { AnimatePresence } from 'framer-motion'
import { ReactComponent as RefreshIcon } from '../../assets/svg/refresh.svg'
import EditPanel from '../../components/admin/EditPanel'
import './PanelsPage.css'


const PanelsPage = () => {
    const [showCreatePanel, setShowCreatePanel] = useState(false)
    const [showEditPanel, setShowEditPanel] = useState(false)
    const [panels, setPanels] = useState([])
    const [selectedPanel, setSelectedPanel] = useState(null)

    useEffect(() => {
        setPanels(JSON.parse(sessionStorage.getItem("panels")))
    }, [])

    const handleDeletePanel = async (e, panel_id) => {
        e.stopPropagation();
        const access_token = sessionStorage.getItem("access_token");
        await axios.post("/delete_panel", { access_token, panel_id });
        let panels = (await axios.post("/get_panels", { access_token })).data;
        sessionStorage.setItem("panels", JSON.stringify(panels))
        setPanels(panels)
        setShowEditPanel(false)
    }

    const handlePowerPanel = async (panel_id,disabled) => {

        const access_token = sessionStorage.getItem("access_token");
        console.log(disabled) 
        if(disabled) await axios.post("/enable_panel", { access_token, panel_id });
        else await axios.post("/disable_panel", { access_token, panel_id });
        var panels = (await axios.post("/get_panels", { access_token })).data;
        sessionStorage.setItem("panels", JSON.stringify(panels));
        setPanels(panels)
        setShowEditPanel(false)
        console.log(panels);

    }

    const handleShowCreatePanel = () => {
        setShowCreatePanel(true)
    }

    const handleCloseCreatePanel = () => {
        setShowCreatePanel(false)
    }

    const handleCloseEditPanel = () => {
        setShowEditPanel(false)
    }

    const handleShowEditPanel = (item) => {
        setSelectedPanel(item)
        setShowEditPanel(true)
    }

    return (
        <div className='admin_panels_body'>
            <UsageStats dataUsage="201.3 TB" activeUsers={500} totalUsers={900} />
            <div className="container flex items-center justify-between   column-reverse items-end gap-16">
                <Search />
                <span style={{ display: "flex", gap: "0.5rem" }} className='items-center'>
                    <Button className="outlined refresh"><RefreshIcon /></Button>
                    <Button onClick={handleShowCreatePanel} className="create-user-button primary">Create Panel</Button>
                </span>
            </div>

            <AnimatePresence>
                {showCreatePanel && <CreatePanel
                    onClose={handleCloseCreatePanel}
                />}
            </AnimatePresence>

            <EditPanel
                item={selectedPanel}
                onClose={handleCloseEditPanel}
                showForm={showEditPanel}
                onDeleteItem={handleDeletePanel}
                onPowerItem={handlePowerPanel}
            />

            <PanelsTable
                items={panels}
                itemsPerPage={10}
                currentItems={panels}
                onEditItem={handleShowEditPanel}
                onCreateItem={handleShowCreatePanel}
            />
        </div>
    )
}

export default PanelsPage