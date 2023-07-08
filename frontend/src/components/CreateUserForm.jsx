import React from 'react'

import Modal from "./Modal";
import LeadingIcon from "./LeadingIcon";
import Button from "./Button";
import { ReactComponent as AddUserIcon } from "../assets/add-user.svg";
import { ReactComponent as XMarkIcon } from "../assets/x-mark.svg";

const CreateUserForm = ({ handleClose }) => {
    return (
        <Modal onClose={handleClose} >
            <header className="modal__header">
                <LeadingIcon>
                    <AddUserIcon />
                </LeadingIcon>
                <h1 className="modal__title">Create new user</h1>
                <div className="close-icon" onClick={handleClose}>
                    <XMarkIcon />
                </div>
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
                <Button className={"transparent"} onClick={handleClose}>Cancel</Button>
                <Button className={"primary"} onClick={handleClose}>Create User</Button>
            </footer>
        </Modal>
    )
}

export default CreateUserForm