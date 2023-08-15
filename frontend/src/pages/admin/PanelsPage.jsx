import React, { useState, useEffect } from 'react'
import axios from 'axios'

import Search from '../../components/Search'
import Button from '../../components/Button'
import PanelsTable from '../../components/admin/PanelsTable'
import CreatePanel from '../../components/admin/CreatePanel'
import PanelStats from '../../components/admin/PanelStats'
import { ReactComponent as RefreshIcon } from '../../assets/svg/refresh.svg'
import EditPanel from '../../components/admin/EditPanel'
import VerifyDelete from '../../components/admin/VerifyDelete'
import './PanelsPage.css'
import "../../components/LoadingGif.css"
import ErrorCard from '../../components/ErrorCard'
import CircularProgress from '../../components/CircularProgress'
import gbOrTb from "../../utils/gbOrTb"

const PanelsPage = () => {
    const [showCreatePanel, setShowCreatePanel] = useState(false)
    const [hasError, setHasError] = useState(false)
    const [error_msg, setError_msg] = useState("")
    const [showEditPanel, setShowEditPanel] = useState(false)
    const [showVerifyDelete, setShowVerifyDelete] = useState(false)
    const [panels, setPanels] = useState([])
    const [selectedPanel, setSelectedPanel] = useState(null)
    const [refresh, setRefresh] = useState(false)
    const [searchedPanels, setSearchedPanels] = useState("")
    const [editMode, setEditMode] = useState(false)
    const [deleteMode, setDeleteMode] = useState(false)

    useEffect(() => {
        setPanels((JSON.parse(sessionStorage.getItem("panels"))).filter((item) => {
            return item["panel_name"].toLowerCase().includes(searchedPanels.toLowerCase())
        }))
    }, [searchedPanels])

    const handleDeletePanel = async (e, panel_id) => {
        setShowVerifyDelete(true)
    }

    const refreshItems = async () => {
        setRefresh(true)
        const access_token = sessionStorage.getItem("access_token")
        axios.post("/get_panels", { access_token }).then(res => {

            if (res.data.status === "ERR") {
                setError_msg(res.data.msg)
                setHasError(true)
                return
            }

            sessionStorage.setItem("panels", JSON.stringify(res.data))
            setPanels(res.data)
            setRefresh(false)
        })
    }

    const handleVerifyDelete = async (e, panel_id) => {
        e.stopPropagation()
        setDeleteMode(true)
        panel_id = selectedPanel.id
        const access_token = sessionStorage.getItem("access_token")
        var req_res = await axios.post("/delete_panel", { access_token, panel_id })
        if (req_res.data.status == "ERR") {
            setError_msg(req_res.data.msg)
            setHasError(true)
            setDeleteMode(false)
            return
        }
        let panels = (await axios.post("/get_panels", { access_token })).data
        if (panels.status == "ERR") {
            setError_msg(panels.msg)
            setHasError(true)
            setDeleteMode(false)
            return
        }
        sessionStorage.setItem("panels", JSON.stringify(panels))
        setPanels(panels)
        setShowEditPanel(false)
        setShowVerifyDelete(false)
        setDeleteMode(false)
    }

    const handlePowerPanel = async (panel_id, disabled) => {

        const access_token = sessionStorage.getItem("access_token")
        var req_res
        if (disabled) req_res = await axios.post("/enable_panel", { access_token, panel_id })
        else req_res = await axios.post("/disable_panel", { access_token, panel_id })
        if (req_res.data.status == "ERR") {
            setError_msg(req_res.data.msg)
            setHasError(true)
            return
        }
        var panels = (await axios.post("/get_panels", { access_token })).data
        if (panels.status == "ERR") {
            setError_msg(panels.msg)
            setHasError(true)
            return
        }
        sessionStorage.setItem("panels", JSON.stringify(panels))
        setPanels(panels)
        var slctd = panels.find(panel => panel.id === panel_id)
        setSelectedPanel(slctd)
        //setShowEditPanel(false)

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

    const handleEditPanel = async (panel_id, panel_name, panel_username, panel_password, panel_url, panel_user_max_count, panel_traffic) => {
        setEditMode(true)
        const access_token = sessionStorage.getItem("access_token")
        var res = await axios.post("/edit_panel", { panel_id, panel_name, panel_username, panel_password, panel_url, panel_user_max_count, panel_traffic, access_token })
        if (res.data.status === "ERR") {
            setError_msg(res.data.msg)
            setHasError(true)
            setEditMode(false)
            return
        }
        var panels = (await axios.post("/get_panels", { access_token })).data
        if (panels.status === "ERR") {
            setError_msg(panels.msg)
            setHasError(true)
            setEditMode(false)
            return
        }
        sessionStorage.setItem("panels", JSON.stringify(panels))
        setPanels(panels)
        setShowEditPanel(false)
        setEditMode(false)
    }
    var total_panel_count = panels.length
    var total_active_panel_count = panels.filter(panel => panel.disable == 0).length
    var total_data_usage = parseFloat(panels.reduce((acc, panel) => acc + panel.panel_data_usage, 0)).toFixed(2)
    var country_list = [...new Set(panels.map(panel => panel.panel_country))]
    sessionStorage.setItem("country_list", JSON.stringify(country_list))

    return (
        <div className='admin_panels_body'>
            <PanelStats dataUsage={gbOrTb(total_data_usage)} activeUsers={total_active_panel_count} totalUsers={total_panel_count} />
            <div className="container flex items-center justify-between   column-reverse items-end gap-16">
                <Search value={searchedPanels} onChange={setSearchedPanels} />
                <span style={{ display: "flex", gap: "0.5rem" }} className='items-center'>
                    <Button onClick={refreshItems} className="outlined refresh"><RefreshIcon /></Button>
                    <Button onClick={handleShowCreatePanel} className="create-user-button primary">Create Panel</Button>
                </span>
            </div>

            <CreatePanel
                onClose={handleCloseCreatePanel}
                showForm={showCreatePanel}
            />

            <EditPanel
                item={selectedPanel}
                onClose={handleCloseEditPanel}
                showForm={showEditPanel}
                onDeleteItem={handleDeletePanel}
                onPowerItem={handlePowerPanel}
                onEditItem={handleEditPanel}
                editMode={editMode}
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
                deleteMode={deleteMode}
            />

            {refresh && <div className='loading_gif_container'> <CircularProgress /> </div>}

            {!refresh && <PanelsTable
                items={panels}
                itemsPerPage={10}
                currentItems={panels}
                onEditItem={handleShowEditPanel}
                onCreateItem={handleShowCreatePanel}
            />}

        </div>
    )
}

export default PanelsPage