import React, { useState } from 'react';

import Button from '../../components/Button';
import { ReactComponent as ChevronDownIcon } from '../../assets/svg/chevron-down.svg';

const LogsList = ({ logs }) => {
    const [expandedId, setExpandedId] = useState(null);

    const handleClick = (id) => {
        setExpandedId((prevId) => (prevId === id ? null : id));
    };

    return (
        <ul className='logs'>
            {logs.map((log) => (
                <li className='log' key={log.id}>
                    <div
                        className={`log__text ${expandedId === log.id ? 'expanded' : ''}`}
                        style={{ maxHeight: expandedId === log.id ? '7.5rem' : '2.5rem' }}
                    >
                        {log.logText}
                        <span className='chevron-icon' style={{ alignSelf: 'center', marginLeft: '0.25rem' }}>
                            <Button className='ghosted' onClick={() => handleClick(log.id)}>
                                <ChevronDownIcon />
                            </Button>
                        </span>
                    </div>
                    <div className='log__date'>{log.logDate}</div>
                </li>
            ))}
        </ul>
    );
};

export default LogsList;
