import React, { useEffect, useState } from 'react'
import { LineChart } from '@mui/x-charts/LineChart'

import ErrorCard from '../../components/ErrorCard'
import LeadingIcon from '../../components/LeadingIcon'
import Dropdown from '../../components/Dropdown'

import axios from 'axios'

import { ReactComponent as GraphBarIcon } from "../../assets/svg/graph-bar.svg"
import { ReactComponent as UsersIcon } from "../../assets/svg/users.svg"
import { ReactComponent as PersonIcon } from "../../assets/svg/person.svg"
import { ReactComponent as PeopleIcon } from "../../assets/svg/people.svg"
import { ReactComponent as PanelIcon } from "../../assets/svg/panel.svg"
import { ReactComponent as DataCenterIcon } from "../../assets/svg/data-center.svg"
import gbOrTb from "../../utils/gbOrTb"

import '../../components/form/inputs/FileInput.css'
import "../../components/agent/UsageStats.css"
import styles from "./AdminHomePage.module.css"

const valueFormatter = (date) =>
    date.getHours() === 0
        ? date.toLocaleDateString('fr-FR', {
            month: '2-digit',
            day: '2-digit',
        })
        : date.toLocaleTimeString('fr-FR', {
            hour: '2-digit',
        })

const xAxisOptions = [
    { label: '1 week', value: 7 },
    { label: '1 month', value: 30 },
]

var panels = JSON.parse(sessionStorage.getItem("panels"));
var agents = JSON.parse(sessionStorage.getItem("agents"));


var home_data_obj =
{
    active_agents: [agents.filter(agent => agent.disable == "0").length , agents.length],
    active_panels: [panels.filter(panel => panel.disable == "0").length , panels.length],
    active_panel_users: [panels.reduce((acc, panel) => acc + panel.active_users,0) , panels.reduce((acc, panel) => acc + panel.total_users,0)],
    active_agent_users: [agents.reduce((acc, panel) => acc + panel.active_users,0) , agents.reduce((acc, panel) => acc + panel.total_users,0)],
    total_panel_usage: panels.reduce((acc, panel) => acc + panel.panel_data_usage,0),
    total_agent_data_usage: agents.reduce((acc, agent) => acc + agent.used_traffic,0),
};

const templateColor2 = ["#e41a1c", "#377eb8", "#4daf4a", "#984ea3", "#ff7f00", "#ffff33", "#a65628", "#f781bf", "#999999"]

const AdminHomePage = () => {
    const [error_msg, setError_msg] = useState("")
    const [hasError, setHasError] = useState(false)
    const [xAxisDays1, setXAxisDays1] = useState(xAxisOptions[0])
    const [xAxisDays2, setXAxisDays2] = useState(xAxisOptions[0])
    const [xAxisDays3, setXAxisDays3] = useState(xAxisOptions[0])
    const [total_users_creation, setTotal_users_creation] = useState([0,0,0,0,0,0,0]);
    const [total_users_edit, setTotal_users_edit] = useState([0,0,0,0,0,0,0]);
    const [total_users_delete, setTotal_users_delete] = useState([0,0,0,0,0,0,0]);
    const [total_allocated_data_of_business_agents, setTotal_allocated_data_of_business_agents] = useState([0,0,0,0,0,0,0]);
    const [total_data_usage_of_business_agents, setTotal_data_usage_of_business_agents] = useState([0,0,0,0,0,0,0]);
    const [total_allocated_data_of_normal_agents, setTotal_allocated_data_of_normal_agents] = useState([0,0,0,0,0,0,0]);
    const [total_data_usage_of_normal_agents, setTotal_data_usage_of_normal_agents] = useState([0,0,0,0,0,0,0]);

    const get_user_data = async (date_from,date_to) => 
    {
        var access_token = sessionStorage.getItem("access_token");

        const res = await axios.post("/graph/get_user_data", 
        {
            date_from,date_to,access_token
        });

        if (res.data.status === "ERR") 
        {
            setError_msg(res.data.msg)
            setHasError(true)
            return
        }

        setTotal_users_creation(res.data.total_user_creation.map(x=>x.count));
        setTotal_users_edit(res.data.total_user_edition.map(x=>x.count));
        setTotal_users_delete(res.data.total_user_deletion.map(x=>x.count));


    }

    const get_agent_data = async (date_from,date_to,business_mode) => 
    {
        var access_token = sessionStorage.getItem("access_token");

        const res = await axios.post("/graph/get_agent_data", 
        {
            date_from,date_to,access_token,business_mode
        });

        if (res.data.status === "ERR") 
        {
            setError_msg(res.data.msg)
            setHasError(true)
            return
        }

        console.log(res.data);
        if(business_mode==0)
        {
            setTotal_allocated_data_of_normal_agents(res.data.total_allocated_data.map(x=>x.volume))
            setTotal_data_usage_of_normal_agents(res.data.total_data_usage.map(x=>x.volume))
        }

        else
        {
            setTotal_allocated_data_of_business_agents(res.data.total_allocated_data.map(x=>x.volume))
            setTotal_data_usage_of_business_agents(res.data.total_data_usage.map(x=>x.volume))
        }
    }


    const get_date_range = (day_count) =>
    {
        var end_of_today = new Date();
        end_of_today.setHours(23, 59, 59, 999);
        var end_of_today_timestamp = Math.floor(end_of_today.getTime() / 1000);

        var start_date = new Date(Date.now()-(day_count-1)*24*60*60*1000)
        start_date.setHours(0, 0, 0, 0);
        var start_date_timestamp = Math.floor(start_date.getTime() / 1000);

        return [start_date_timestamp,end_of_today_timestamp];
    }



    // rendering data for charts

    function generateDateRange(startDate, numDays) {
        const dateData = []
        let currentDate = new Date(startDate)

        for (let i = 0; i < numDays; i++) {
            dateData.push(new Date(currentDate))
            currentDate.setDate(currentDate.getDate() + 1)
        }

        return dateData
    }

    const totalUserCreation = total_users_creation;
    const totalUserEdits = total_users_edit
    const totalUserDelete = total_users_delete

    const totalAllocatedDataOfBusinessAgents = total_allocated_data_of_business_agents
    const totalDataUsageOfBusinessAgents = total_data_usage_of_business_agents

    const totalAllocatedDataOfNormalAgents = total_allocated_data_of_normal_agents
    const totalDataUsageOfNormalAgents = total_data_usage_of_normal_agents

    const today = new Date()

    const daysPastFromToday1 = new Date(today)
    daysPastFromToday1.setHours(0, 0, 0, 0)
    daysPastFromToday1.setDate(today.getDate() - (xAxisDays1.value - 1))
    const daysPastFromToday2 = new Date(today)
    daysPastFromToday2.setHours(0, 0, 0, 0)
    daysPastFromToday2.setDate(today.getDate() - (xAxisDays2.value - 1))
    const daysPastFromToday3 = new Date(today)
    daysPastFromToday3.setHours(0, 0, 0, 0)
    daysPastFromToday3.setDate(today.getDate() - (xAxisDays3.value - 1))

    const timeData1 = generateDateRange(daysPastFromToday1, xAxisDays1.value)
    const timeData2 = generateDateRange(daysPastFromToday2, xAxisDays2.value)
    const timeData3 = generateDateRange(daysPastFromToday3, xAxisDays3.value)



    useEffect(() => 
    {

        var day_count = xAxisDays1.value;

        setTotal_users_creation(new Array(day_count).fill(0));
        setTotal_users_edit(new Array(day_count).fill(0));
        setTotal_users_delete(new Array(day_count).fill(0));

        var date_range = get_date_range(day_count);
        get_user_data(date_range[0],date_range[1]);

    }, [xAxisDays1])

    useEffect(() => 
    {

        var day_count = xAxisDays3.value;

        setTotal_allocated_data_of_normal_agents(new Array(day_count).fill(0))
        setTotal_data_usage_of_normal_agents(new Array(day_count).fill(0))

        var date_range = get_date_range(day_count);
        get_agent_data(date_range[0],date_range[1],0);

    }, [xAxisDays3])

    useEffect(() =>
    {
        var day_count = xAxisDays2.value;

        setTotal_allocated_data_of_business_agents(new Array(day_count).fill(0))
        setTotal_data_usage_of_business_agents(new Array(day_count).fill(0))

        var date_range = get_date_range(day_count);
        get_agent_data(date_range[0],date_range[1],1);

    }, [xAxisDays2])

    const config1 = {
        series: [
            { data: totalUserCreation },
            { data: totalUserEdits },
            { data: totalUserDelete },
        ],
        height: 300,
    }
    const config2 = {
        series: [
            { data: totalAllocatedDataOfBusinessAgents },
            { data: totalDataUsageOfBusinessAgents },
        ],
        height: 300,
    }
    const config3 = {
        series: [
            { data: totalAllocatedDataOfNormalAgents },
            { data: totalDataUsageOfNormalAgents },
        ],
        height: 300,
    }

    const xAxisCommon1 = {
        data: [...timeData1],
        scaleType: 'time',
        valueFormatter,
    }
    const xAxisCommon2 = {
        data: [...timeData2],
        scaleType: 'time',
        valueFormatter,
    }
    const xAxisCommon3 = {
        data: [...timeData3],
        scaleType: 'time',
        valueFormatter,
    }

    return (
        <>
            <div className="usage-stats">
                <div className="flex">
                    <div className="usage-stats__item">
                        <LeadingIcon>
                            <PersonIcon />
                        </LeadingIcon>
                        <div className="usage-stats__item__label">Active Agents</div>
                        <div className="usage-stats__item__value"><span>{home_data_obj.active_agents[0]}</span>{" / " + home_data_obj.active_agents[1]}</div>
                    </div>
                    <div className="usage-stats__item">
                        <LeadingIcon>
                            <GraphBarIcon />
                        </LeadingIcon>
                        <div className="usage-stats__item__label">Total Agent Data Usage</div>
                        <div className="usage-stats__item__value"><span>{gbOrTb(home_data_obj.total_agent_data_usage)}</span></div>
                    </div>
                </div>
                <div className="flex">
                    <div className="usage-stats__item">
                        <LeadingIcon>
                            <UsersIcon />
                        </LeadingIcon>
                        <div className="usage-stats__item__label">Active Panel Users</div>
                        <div className="usage-stats__item__value"><span>{home_data_obj.active_panel_users[0]}</span>{" / " + home_data_obj.active_panel_users[1]}</div>
                    </div>
                    <div className="usage-stats__item">
                        <LeadingIcon>
                            <DataCenterIcon />
                        </LeadingIcon>
                        <div className="usage-stats__item__label">Total Panel Usage</div>
                        <div className="usage-stats__item__value"><span>{gbOrTb(home_data_obj.total_panel_usage)}</span></div>
                    </div>
                </div>
                <div className="flex">
                    <div className="usage-stats__item">
                        <LeadingIcon>
                            <PeopleIcon />
                        </LeadingIcon>
                        <div className="usage-stats__item__label">Active Agent users</div>
                        <div className="usage-stats__item__value"><span>{home_data_obj.active_agent_users[0]}</span>{" / " + home_data_obj.active_agent_users[1]}</div>
                    </div>
                    <div className="usage-stats__item">
                        <LeadingIcon>
                            <PanelIcon />
                        </LeadingIcon>
                        <div className="usage-stats__item__label">Active Panels</div>
                        <div className="usage-stats__item__value"><span>{home_data_obj.active_panels[0]}</span>{" / " + home_data_obj.active_panels[1]}</div>
                    </div>
                </div>
            </div>

            <div className='flex flex-col' style={{ marginTop: "1.25rem" }}>
                <div style={{ alignSelf: "end" }} className='flex'>
                    <Dropdown options={xAxisOptions} value={xAxisDays1} onChange={setXAxisDays1} overlap={true} />
                </div>
                <LineChart
                    // colors={templateColor1}
                    xAxis={[
                        {
                            ...xAxisCommon1,
                            tickMinStep: 3600 * 1000 * 24, // min step: 24h
                        },
                    ]}
                    {...config1}
                />
                <div className={`flex gap-2.5 justify-center ${styles['charts-subinfo']}`}>
                    <div className='flex gap-1' style={{ fontSize: ".875rem" }}><div style={{ backgroundColor: "#02B2AF", minWidth: ".875rem", height: ".875rem", borderRadius: ".25rem" }}></div>Total User Creation</div>
                    <div className='flex gap-1' style={{ fontSize: ".875rem" }}><div style={{ backgroundColor: "#2E96FF", minWidth: ".875rem", height: ".875rem", borderRadius: ".25rem" }}></div>Total User Edit</div>
                    <div className='flex gap-1' style={{ fontSize: ".875rem" }}><div style={{ backgroundColor: "#B800D8", minWidth: ".875rem", height: ".875rem", borderRadius: ".25rem" }}></div>Total User Delete</div>
                </div>
            </div>

            <div className='flex flex-col' style={{ marginTop: "1.25rem" }}>
                <div style={{ alignSelf: "end" }} className='flex'>
                    <Dropdown options={xAxisOptions} value={xAxisDays2} onChange={setXAxisDays2} overlap={true} />
                </div>
                <LineChart
                    colors={templateColor2}
                    xAxis={[
                        {
                            ...xAxisCommon2,
                            tickMinStep: 3600 * 1000 * 24, // min step: 24h
                        },
                    ]}
                    {...config2}
                />
                <div className={`flex gap-2.5 justify-center ${styles['charts-subinfo']}`}>
                    <div className='flex gap-1' style={{ fontSize: ".875rem" }}><div style={{ backgroundColor: "#e41a1c", minWidth: ".875rem", height: ".875rem", borderRadius: ".25rem" }}></div>Total Allocated Data Of Business Agents</div>
                    <div className='flex gap-1' style={{ fontSize: ".875rem" }}><div style={{ backgroundColor: "#377eb8", minWidth: ".875rem", height: ".875rem", borderRadius: ".25rem" }}></div>Total Data Usage Of Business Agents</div>
                </div>
            </div>

            <div className='flex flex-col' style={{ marginTop: "1.25rem" }}>
                <div style={{ alignSelf: "end" }} className='flex'>
                    <Dropdown options={xAxisOptions} value={xAxisDays3} onChange={setXAxisDays3} overlap={true} />
                </div>
                <LineChart
                    colors={templateColor2}
                    xAxis={[
                        {
                            ...xAxisCommon3,
                            tickMinStep: 3600 * 1000 * 24, // min step: 24h
                        },
                    ]}
                    {...config3}
                />
                <div className={`flex gap-2.5 justify-center ${styles['charts-subinfo']}`}>
                    <div className='flex gap-1' style={{ fontSize: ".875rem" }}><div style={{ backgroundColor: "#e41a1c", minWidth: ".875rem", height: ".875rem", borderRadius: ".25rem" }}></div>Total Allocated Data Of Normal Agents</div>
                    <div className='flex gap-1' style={{ fontSize: ".875rem" }}><div style={{ backgroundColor: "#377eb8", minWidth: ".875rem", height: ".875rem", borderRadius: ".25rem" }}></div>Total Data Usage Of Normal Agents</div>
                </div>
            </div>

            <ErrorCard
                hasError={hasError}
                setHasError={setHasError}
                errorTitle="ERROR"
                errorMessage={error_msg}
            />
        </>

    )
}

export default AdminHomePage