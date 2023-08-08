import React from 'react';

const LogsList = ({ logs }) => {
    const timestamp_to_date = (timestamp) => {
        const date = new Date(timestamp * 1000);
        return date.toLocaleString();
    }

    return (
        <ul className='logs'>
            {logs.map((log) => (
                <li className='log' key={log.id}>
                    <div className="log__text">
                        <p>
                            <span style={{ fontSize: "1.2rem", fontWeight: 600, marginRight: ".2rem" }}>
                                {log.msg.split(" ")[0]}
                            </span>
                            {log.msg.split(" ").slice(1).join(" ")}
                        </p>
                    </div>
                    <div className='log__date'>{timestamp_to_date(log.time)}</div>
                </li>
            ))}
        </ul>
    );
};

export default LogsList;