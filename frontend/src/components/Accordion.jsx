import React from 'react'

import "./Accordion.css"

const Accordion = ({ children, id }) => {
    return (
        <div className="accordion">
            {children}
        </div>
    )
}

export default Accordion