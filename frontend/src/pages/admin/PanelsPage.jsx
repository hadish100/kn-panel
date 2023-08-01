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
import VerifyDelete from '../../components/admin/VerifyDelete'
import './PanelsPage.css'
import loadingGif from '../../assets/loading.gif'
import "../../components/LoadingGif.css"


const PanelsPage = () => {
    const [showCreatePanel, setShowCreatePanel] = useState(false)
    const [showEditPanel, setShowEditPanel] = useState(false)
    const [showVerifyDelete, setShowVerifyDelete] = useState(false)
    const [panels, setPanels] = useState([])
    const [selectedPanel, setSelectedPanel] = useState(null)
    const [refresh, setRefresh] = useState(false);


    useEffect(() => {
        setPanels(JSON.parse(sessionStorage.getItem("panels")))
    }, [])

    const handleDeletePanel = async (e, panel_id) => {
        setShowVerifyDelete(true)
    }

    const refreshItems = async () => {
        setRefresh(true);
        const access_token = sessionStorage.getItem("access_token");
        axios.post("/get_panels",{access_token}).then(res => 
        {
            sessionStorage.setItem("panels", JSON.stringify(res.data));
            setRefresh(false);
        });
    }

    const handleVerifyDelete = async (e, panel_id) => {
        e.stopPropagation();
        panel_id = selectedPanel.id;
        const access_token = sessionStorage.getItem("access_token");
        await axios.post("/delete_panel", { access_token, panel_id });
        let panels = (await axios.post("/get_panels", { access_token })).data;
        sessionStorage.setItem("panels", JSON.stringify(panels))
        setPanels(panels)
        setShowEditPanel(false)
        setShowVerifyDelete(false)
    }

    const handlePowerPanel = async (panel_id,disabled) => {

        const access_token = sessionStorage.getItem("access_token");
        console.log(disabled) 
        if(disabled) await axios.post("/enable_panel", { access_token, panel_id });
        else await axios.post("/disable_panel", { access_token, panel_id });
        var panels = (await axios.post("/get_panels", { access_token })).data;
        sessionStorage.setItem("panels", JSON.stringify(panels));
        setPanels(panels)
        var slctd = panels.find(panel => panel.id === panel_id);
        setSelectedPanel(slctd)
        //setShowEditPanel(false)
        console.log(panels);

    }

    const handleShowCreatePanel = () => {
        setShowCreatePanel(true)
    }

    const handleCloseCreatePanel = () => {
        setShowCreatePanel(false)
        setPanels(JSON.parse(sessionStorage.getItem("panels")))
    }

    const handleCloseVerifyDelete = () => {
        setShowVerifyDelete(false)
    }

    const handleCloseEditPanel = () => {
        setShowEditPanel(false)
    }

    const handleShowEditPanel = (item) => {
        setSelectedPanel(item)
        setShowEditPanel(true)
    }

    const handleEditPanel = async (panel_id,panel_name,panel_username,panel_password,panel_url,panel_user_max_count,panel_traffic) => {

        const access_token = sessionStorage.getItem("access_token");
        var res = await axios.post("/edit_panel", { panel_id,panel_name,panel_username,panel_password,panel_url,panel_user_max_count,panel_traffic,access_token });
        console.log(res.data)
        var panels = (await axios.post("/get_panels", { access_token })).data;
        sessionStorage.setItem("panels", JSON.stringify(panels));
        setPanels(panels)
        setShowEditPanel(false)

    }
    console.log(panels);
    var total_active_users = panels.reduce((acc , panel) => acc + panel.active_users,0);
    var total_total_users = panels.reduce((acc , panel) => acc + panel.total_users,0);
    var total_data_usage = parseFloat(panels.reduce((acc , panel) => acc + panel.panel_data_usage,0)).toFixed(2);

    return (
        <div className='admin_panels_body'>
            <UsageStats dataUsage={total_data_usage + " GB"} activeUsers={total_active_users} totalUsers={total_total_users} />
            <div className="container flex items-center justify-between   column-reverse items-end gap-16">
                <Search items={panels} setItems={setPanels} mode="1" />
                <span style={{ display: "flex", gap: "0.5rem" }} className='items-center'>
                    <Button onClick={refreshItems} className="outlined refresh"><RefreshIcon /></Button>
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
                onEditItem={handleEditPanel}
            />

            <VerifyDelete
                onClose={handleCloseVerifyDelete}
                showForm={showVerifyDelete}
                onDeleteItem={handleVerifyDelete}
            />

{refresh && <div className='loading_gif_container'> <img src={loadingGif} className='loading_gif' /> </div>}

{!refresh &&      <PanelsTable
                items={panels}
                itemsPerPage={10}
                currentItems={panels}
                onEditItem={handleShowEditPanel}
                onCreateItem={handleShowCreatePanel}
            /> }

        </div>
    )
}

export default PanelsPage