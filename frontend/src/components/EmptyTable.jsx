import React from 'react'

import Button from './Button'
import { ReactComponent as EmptyTableIcon } from '../assets/svg/empty-table.svg'
import './EmptyTable.css'

const EmptyTable = ({ tableType, colSpan, onCreateButton }) => {
    return (
        <td colSpan={colSpan}>
            <div className="empty-table">
                <EmptyTableIcon />
                <h6>There is no {tableType} added to the system</h6>
                <Button onClick={onCreateButton} className="primary">Create {tableType}</Button>
            </div>
        </td>
    )
}

export default EmptyTable