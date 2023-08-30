import React from 'react';

const parse_log = (log) =>
{
    var words = log.split(" ");
    words = words.map((word) => {
        if (word.startsWith("!")) {
          return `<span style="font-weight: 600">${word.replace("!","")}</span>`;
        }
        return word;
      });

    return words.join(" ");
}

const LogsList = ({ logs }) => {
    const timestamp_to_date = (timestamp) => {
        const date = new Date(timestamp * 1000);
        return date.toLocaleString("en-US",{ hourCycle: 'h23' }).replace(", "," - ");
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
                            <span dangerouslySetInnerHTML={{ __html: parse_log(log.msg.split(" ").slice(1).join(" ")) }} />
                        </p>
                    </div>
                    <div className='log__date'>{timestamp_to_date(log.time)}</div>
                </li>
            ))}
        </ul>
    );
};

export default LogsList;