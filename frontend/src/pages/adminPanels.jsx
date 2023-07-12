import React from 'react'
import Navbar2 from '../components/Navbar2'
import Search from '../components/Search'
import Button from '../components/Button'
import { ReactComponent as RefreshIcon } from '../assets/refresh.svg'
import './adminPanels.css'

function handleClick()
{

}




const AdminPanels = () => {
    return (
        <>
        <div className='admin_panels_body'>
        <Navbar2 />
        <div className="container flex items-center justify-between   column-reverse items-end gap-16">
        <Search />
        <span style={{ display: "flex", gap: "0.5rem" }} className='items-center'>
            <Button className="transparent refresh"><RefreshIcon /></Button>
            <Button onClick={handleClick} className="create-user-button primary">Add Panel</Button>
        </span>
        </div>

        </div>
        </>
    )
}

export default AdminPanels