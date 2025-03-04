import React from "react"

import EmptyTable from "../EmptyTable"
import "./PanelsTable.css"
import gbOrTb from "../../utils/gbOrTb"
const show_url = (str) =>
{
    str = str.replace(/^https?:\/\//, '');
    str = str.replace(/:\d+$/, '');
    return (<span className="panel_url_span">{str}</span>)
}

const render_panel_type = (panel_type) => 
{
    if(!panel_type || panel_type === "MZ")
    {
        return (<span className="panel_type_span panel_type_MZ">MZ</span>)
    }

    if(panel_type === "AMN")
    {
        return (<span className="panel_type_span panel_type_AMN">AMN</span>)
    }
}

const AdminPanelsTable = ({ items, itemsPerPage, currentItems, onEditItem, onCreateItem }) => {
    return (
        <div className="wrapper" style={{ overflowX: "auto" }}>
            <table className="panels-table">
                <thead className="panels-table__header">
                    <tr className="panels-table__header__row">
                        <th>Name</th>
                        <th>Status</th>
                        <th>Data Usage</th>
                        <th>Traffic</th>
                        <th>Active Users</th>
                        <th>capacity</th>
                        <th>Country</th>
                    </tr>
                </thead>
                <tbody className="panels-table__body">
                    {items.length === 0
                        ? <EmptyTable tableType={"panel"} colSpan={7} onCreateButton={onCreateItem} />
                        : currentItems.map((item) => (
                            <tr onClick={() => onEditItem(item)} key={item.id}>
                                <td>{item.panel_name} <br></br> <span className='panelUrl' >{render_panel_type(item.panel_type) } {show_url(item.panel_url)} </span> </td>
                                <td>
                                    <span className={`status ${item.disable ? "limited2" : "active"}`} >
                                        {item.disable ? "Disabled" : "Active"}
                                    </span>
                                </td>
                                <td className={item.panel_data_usage>item.panel_traffic?"panel_table_alarm_text":""}>{gbOrTb(item.panel_data_usage)}</td>
                                <td>{gbOrTb(item.panel_traffic)}</td>
                                <td className={item.active_users>item.panel_user_max_count?"panel_table_alarm_text":""} >{item.active_users + " / " + item.total_users}</td>
                                <td >{item.panel_user_max_count}</td>
                                <td>{item.panel_country}</td>
                            </tr>
                        ))}
                </tbody>
            </table>
        </div>
    )
}



export default AdminPanelsTable