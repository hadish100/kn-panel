import React, { useState } from "react"

import "./UsersTable.css"
import ProgressBar from "./ProgressBar";
import SubscriptionSection from "./SubscriptionSection";
import Search from "./Search";
import Button from "./Button";
import Modal from "./Modal";
import LeadingIcon from "./LeadingIcon";
import { ReactComponent as AddUserIcon } from "../assets/add-user.svg";

const UsersTable = ({ users }) => {

    const checkExpireTime = (isActive, expireTime) => {
        if (isActive) {
            if (expireTime.days !== 0) {
                return `Expires in ${expireTime.days} days`;
            } else {
                return `Expires in ${expireTime.hours} hours, ${expireTime.minutes} minutes`;
            }
        } else {
            if (expireTime.days !== 0) {
                return `Expired ${expireTime.days} days ago`;
            } else {
                return `Expired ${expireTime.hours} hours, ${expireTime.minutes} minutes ago`;
            }
        }
    };

    const checkStatus = (dataUsage, totalData, isActive) => {
        if (dataUsage >= totalData) {
            return "limited";
        } else if (isActive) {
            return "active";
        } else {
            return "expired";
        }
    };

    const [showModal, setShowModal] = useState(false)

    const handleClick = () => {
        setShowModal(true)
    }

    const handleClose = () => {
        setShowModal(false)
    }

    const modal = <Modal onClose={handleClose} >
        <header className="modal__header">
            <LeadingIcon>
                <AddUserIcon />
            </LeadingIcon>
            <h1 className="modal__title">Create new user</h1>
        </header>
        <main className="modal__body">
            <form className="modal__form">
                <div className="modal__form__group">
                    <label className="modal__form__label" htmlFor="username">Username</label>
                    <input className="modal__form__input" type="text" id="username" name="username" />
                </div>
                <div className="modal__form__group">
                    <label className="modal__form__label" htmlFor="dataLimit">Data Limit</label>
                    <input className="modal__form__input" type="number" id="dataLimit" name="dataLimit" />
                </div>
                <div className="modal__form__group">
                    <label className="modal__form__label" htmlFor="daysToExpire">Days To Expire</label>
                    <input className="modal__form__input" type="number" id="daysToExpire" name="daysToExpire" />
                </div>
            </form>
        </main>
        <footer className="modal__footer">
            <Button onClick={handleClose}>Cancel</Button>
            <Button onClick={handleClose}>Create User</Button>
        </footer>
    </Modal>



    return (
        <>
            <div className="flex" style={{ justifyContent: "flex-end", alignItems: "center" }}>
                <Search />
                <Button onClick={handleClick} className="create-user-button">Create User</Button>
            </div >
            {showModal && modal}
            <div className="wrapper">
                <table className="users-table">
                    <thead className="users-table__header">
                        <tr className="users-table__header__row">
                            <th className="first">Username</th>
                            <th>Status</th>
                            <th>Data Usage</th>
                            <th className="last"></th>
                        </tr>
                    </thead>
                    <tbody className="users-table__body">
                        {users.map((user) => (
                            <tr key={user.id}>
                                <td style={{ width: "25vw" }}>{user.username}</td>
                                <td>
                                    <span className={checkStatus(user.dataUsage, user.totalData, user.isActive)}>
                                        {checkStatus(user.dataUsage, user.totalData, user.isActive)}
                                    </span>
                                    <span className="expire-time">
                                        {checkExpireTime(user.isActive, user.expireTime)}
                                    </span>
                                </td>
                                <td>
                                    <ProgressBar dataUsage={user.dataUsage} totalData={user.totalData} status={checkStatus(user.dataUsage, user.totalData, user.isActive)} />
                                </td>
                                <td>
                                    {<SubscriptionSection subscriptioLink={user.subscriptioLink} config={user.config} />}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    )
}

export default UsersTable