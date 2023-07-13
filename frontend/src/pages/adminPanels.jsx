import React , { useState } from 'react'
import Navbar2 from '../components/Navbar2'
import Search from '../components/Search'
import Button from '../components/Button'
import AdminPanelsTable from '../components/AdminPanelsTable'
import AddPanelForm from '../components/AddPanelForm'
import AdminUsageStats from '../components/AdminUsageStats'
import { AnimatePresence } from 'framer-motion'
import { ReactComponent as RefreshIcon } from '../assets/refresh.svg'
import './adminPanels.css'



let users = [
    {
        id: 1,
        status:1,
        name: "ir1",
        dataUsage:"1300 GB",
        activeUsers:"200 / 300",
        capacity:"400",
        country:"NL"
    },
    {
        id: 2,
        status:0,
        name: "v1",
        dataUsage:"200 TB",
        activeUsers:"300 / 400",
        capacity:"500",
        country:"DE"
    }]

const AdminPanels = () => {

    function handleClick()
    {
    
    }
    
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
        <Navbar2 />
        <AdminUsageStats dataUsage="201.3 TB" activeUsers={500} totalUsers={900} />
        <div className="container flex items-center justify-between   column-reverse items-end gap-16">
        <Search />
        <span style={{ display: "flex", gap: "0.5rem" }} className='items-center'>
            <Button className="transparent refresh"><RefreshIcon /></Button>
            <Button onClick={handleClick2} className="create-user-button primary">Add Panel</Button>
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

export default AdminPanels