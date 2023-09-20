import React, { useState } from 'react'
import axios from 'axios'

import Button from '../../components/Button'
import styles from "./AdminSettingsPage.module.css"
import ErrorCard from '../../components/ErrorCard'
import OkCard from '../../components/OkCard'
import Modal from '../../components/Modal'
import { AnimatePresence } from 'framer-motion'
import LeadingIcon from '../../components/LeadingIcon'

import { ReactComponent as DeleteIcon } from '../../assets/svg/delete.svg'
import { ReactComponent as XMarkIcon } from '../../assets/svg/x-mark.svg'

const admins = [
    {
        username: "Soheil",
        id: 1
    },
    {
        username: "Soheil",
        id: 2
    },
    {
        username: "Soheil",
        id: 3
    },
    {
        username: "Soheil",
        id: 4
    },
    {
        username: "Soheil",
        id: 5
    },
    {
        username: "Soheil",
        id: 6
    },
]

const AdminSettingsPage = () => {
    const [error_msg, setError_msg] = useState("Passwords dont match")
    const [hasError, setHasError] = useState(false)
    const [ok_msg, setOk_msg] = useState("Credentials changed")
    const [hasOk, setHasOk] = useState(false)
    const [saveMode, setSaveMode] = useState(false)
    const [createMode, setCreateMode] = useState(false)
    const [showDeleteModal, setShowDeleteModal] = useState(false)

    const changeCrendtials = async (e) => {
        e.preventDefault()
        setSaveMode(true)
        const username = document.getElementById("username").value
        const password = document.getElementById("password").value
        const password2 = document.getElementById("password2").value


        if (!password || !password2 || !username) {
            setError_msg("Please fill all the fields")
            setHasError(true)
            setSaveMode(false)
        } else if (password !== password2) {
            setError_msg("Passwords don't match")
            setHasError(true)
            setSaveMode(false)
        }
        else {
            const access_token = sessionStorage.getItem("access_token")
            const res = await axios.post("/edit_self", { username, password, access_token })

            if (res.data.status === "ERR") {
                setError_msg(res.data.msg || "BAD REQUEST")
                setHasError(true)
                setSaveMode(false)
            }

            else {
                setHasOk(true)
                document.getElementById("username").value = ""
                document.getElementById("password").value = ""
                document.getElementById("password2").value = ""
                setSaveMode(false)
            }
            setSaveMode(false)
        }
        setSaveMode(false)
    }

    const createAdmin = (e) => {
        e.preventDefault()
        setCreateMode(true)
        console.log("creating admin")
        setCreateMode(false)
    }

    const handleDeleteAdmin = (id) => {
        setShowDeleteModal(true)
        console.log("deleting admin with id: " + id)
    }


    return (
        <>
            <section>
                <h2 style={{ marginBottom: "1rem" }}>Change Credentials</h2>
                <form autoComplete='off' className="settings-page flex flex-col" style={{ padding: "0 1rem" }}>
                    <div className="modal__form__group">
                        <label className="modal__form__label" htmlFor="username">Username</label>
                        <input autoComplete='new-username' className="modal__form__input" type="text" id="username" name="username" />
                    </div>
                    <div className={`flex gap-16 ${styles['flex-col']}`}>
                        <div className="modal__form__group">
                            <label className="modal__form__label" htmlFor="password">New Password</label>
                            <input autoComplete='new-password' className="modal__form__input" type="password" id="password" name="password" />
                        </div>
                        <div className="modal__form__group">
                            <label className="modal__form__label" htmlFor="password">Repeat New Password</label>
                            <input autoComplete='new-password' className="modal__form__input" type="password" id="password2" name="password" />
                        </div>
                    </div>
                    <footer className="settings-page__footer">
                        <Button onClick={(e) => changeCrendtials(e)} className="primary" disabled={saveMode}>{saveMode ? "Saving..." : "Save"}</Button>
                    </footer>
                </form>
            </section>

            <section>
                <h2 style={{ marginBottom: "1rem" }}>Create Admin</h2>
                <main className={`flex gap-col-1 ${styles['flex-col']}`}>
                    <div className='w-full'>
                        <form autoComplete='off' className="settings-page" style={{ padding: "0 1rem" }}>
                            <div className="modal__form__group">
                                <label className="modal__form__label" htmlFor="username">Username</label>
                                <input autoComplete='new-username' className="modal__form__input" type="text" id="username" name="username" />
                            </div>
                            <div className="flex gap-16">
                                <div className="modal__form__group">
                                    <label className="modal__form__label" htmlFor="password">Password</label>
                                    <input autoComplete='new-password' className="modal__form__input" type="password" id="password" name="password" />
                                </div>
                            </div>
                            <footer className="settings-page__footer">
                                <Button onClick={(e) => createAdmin(e)} className="primary" disabled={createMode}>{saveMode ? "Creating..." : "Create"}</Button>
                            </footer>
                        </form>
                    </div>

                    <div className={`flex flex-col w-full gap-1.5 ${styles['admin-section']}`}>
                        <h3>Admins</h3>
                        <div className={`flex flex-col w-full gap-1.5 ${styles.admins}`}>
                            {admins.map((admin) => (
                                <div className={`flex items-center justify-between ${styles.admin}`} key={admin.id}>
                                    <div>{admin.username}</div>
                                    <Button className='ghosted' onClick={() => handleDeleteAdmin(admin.id)}><DeleteIcon /></Button>
                                </div>
                            ))}
                        </div>
                    </div>
                </main>
            </section >

            <AnimatePresence>
                {showDeleteModal &&
                    <Modal
                        onClose={() => setShowDeleteModal(false)}
                        width={"30rem"}
                    >
                        <header className="modal__header">
                            <LeadingIcon>
                                <DeleteIcon />
                            </LeadingIcon>
                            <h1 className="modal__title">Delete admin</h1>
                            <div className="close-icon" onClick={() => setShowDeleteModal(false)}>
                                <XMarkIcon />
                            </div>
                        </header>
                        <footer className='flex gap-1.5'>
                            <Button className="outlined w-full" onClick={() => setShowDeleteModal(false)}>Cancel</Button>
                            <Button className="primary w-full">Delete</Button>
                        </footer>
                    </Modal>
                }
            </AnimatePresence>

            <ErrorCard
                hasError={hasError}
                setHasError={setHasError}
                errorTitle="ERROR"
                errorMessage={error_msg}
            />

            <OkCard
                hasError={hasOk}
                setHasError={setHasOk}
                errorTitle="DONE"
                errorMessage={ok_msg}
            />
        </>
    )
}

export default AdminSettingsPage