import React from 'react'

import Button from '../../components/Button'
import "./AdminSettingsPage.css"

const AdminSettingsPage = () => {
    return (
        <div className="settings-page">
            <div className="modal__form__group">
                <label className="modal__form__label" htmlFor="username">Username</label>
                <input className="modal__form__input" type="text" id="username" name="username" />
            </div>
            <div className="flex gap-16">
                <div className="modal__form__group">
                    <label className="modal__form__label" htmlFor="password">New Password</label>
                    <input className="modal__form__input" type="password" id="password" name="password" />
                </div>
                <div className="modal__form__group">
                    <label className="modal__form__label" htmlFor="password">Repeat New Password</label>
                    <input className="modal__form__input" type="password" id="password" name="password" />
                </div>
            </div>
            <footer className="settings-page__footer">
                <Button className="primary">Save</Button>
            </footer>
        </div>
    )
}

export default AdminSettingsPage