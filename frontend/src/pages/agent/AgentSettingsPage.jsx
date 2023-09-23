import React, { useState, useEffect, useCallback } from 'react'
import axios from 'axios'

import Button from '../../components/Button'
import styles from "./AgentSettingsPage.module.css"
import ErrorCard from '../../components/ErrorCard'
import OkCard from '../../components/OkCard'
import Modal from '../../components/Modal'
import { AnimatePresence } from 'framer-motion'
import LeadingIcon from '../../components/LeadingIcon'

import { ReactComponent as DeleteIcon } from '../../assets/svg/delete.svg'
import { ReactComponent as XMarkIcon } from '../../assets/svg/x-mark.svg'
import { ReactComponent as EditIcon } from '../../assets/svg/edit.svg'
import { ReactComponent as SpinnerIcon } from '../../assets/svg/spinner.svg'

const AdminSettingsPage = () => {
    const [error_msg, setError_msg] = useState("Passwords dont match")
    const [hasError, setHasError] = useState(false)
    const [ok_msg, setOk_msg] = useState("Credentials changed")
    const [hasOk, setHasOk] = useState(false)
    const [saveMode, setSaveMode] = useState(false)
    const [createMode, setCreateMode] = useState(false)
    const [deleteMode, setDeleteMode] = useState(false)
    const [editMode, setEditMode] = useState(false)
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [showEditModal, setShowEditModal] = useState(false)
    const [selectedAdminToDelete, setSelectedAdminToDelete] = useState(null)
    const [selectedAdminToEdit, setSelectedAdminToEdit] = useState(null)
    const [admins, setAdmins] = useState([])
    const [isLoadingAdmins, setIsLoadingAdmins] = useState(false)


    const access_token = sessionStorage.getItem("access_token")

    const changeCrendtials = async (e) => {
        e.preventDefault()
        setSaveMode(true)
        const username = document.getElementById("username").value
        const password = document.getElementById("password").value
        const password2 = document.getElementById("password2").value


        if (!password || !password2 || !username) {
            setSaveMode(true)
            setError_msg("Please fill all the fields")
        } else if (password !== password2) {
            setSaveMode(true)
            setError_msg("Passwords dont match")
        }
        else {
            const access_token = sessionStorage.getItem("access_token")
            var res = await axios.post("/edit_self", { username, password, access_token })

            if (res.data.status === "ERR") {
                setError_msg(res.data.msg || "BAD REQUEST")
                setHasError(true)
            }

            else {
                setHasOk(true)
                document.getElementById("username").value = ""
                document.getElementById("password").value = ""
                document.getElementById("password2").value = ""
            }
            setSaveMode(false)
        }
        setSaveMode(false)
    }

    const createAdmin = (e) => {
        e.preventDefault()

        const username = document.getElementById("create-username").value
        const password = document.getElementById("create-password").value
        const createAdmin = async () => {
            setCreateMode(true)
            const res = (await axios.post("/add_sub_account", { access_token, username, password })).data
            if (res.status === "ERR") {
                setError_msg(res.msg || "BAD REQUEST")
                setHasError(true)
                setCreateMode(false)
            } else {
                getAdmins()
                document.getElementById("create-username").value = ""
                document.getElementById("create-password").value = ""
                setCreateMode(false)
            }
        }
        createAdmin()
    }

    const editAdmin = (e) => {
        e.preventDefault()

        const username = document.getElementById("edit-username").value
        const password = document.getElementById("edit-password").value
        const editAdmin = async () => {
            setEditMode(true)
            const res = (await axios.post("/edit_sub_account", { access_token, sub_account_id: selectedAdminToEdit.id, username, password })).data
            if (res.status === "ERR") {
                setError_msg(res.msg || "BAD REQUEST")
                setHasError(true)
                setEditMode(false)
            } else {
                getAdmins()
                setShowEditModal(false)
                document.getElementById("edit-username").value = ""
                document.getElementById("edit-password").value = ""
                setEditMode(false)
            }
        }
        editAdmin()
    }

    const handleShowDeleteModal = (id) => {
        setShowDeleteModal(true)
        setSelectedAdminToDelete(id)
    }

    const handleShowEditModal = (admin) => {
        setShowEditModal(true)
        setSelectedAdminToEdit(admin)
    }

    const handleDeleteAdmin = async (id) => {
        setDeleteMode(true)
        const res = (await axios.post("/delete_sub_account", { access_token, sub_account_id: id })).data
        if (res.status === "ERR") {
            setError_msg(res.msg || "BAD REQUEST")
            setHasError(true)
            setDeleteMode(false)
        } else {
            getAdmins()
            setDeleteMode(false)
            setShowDeleteModal(false)
        }
    }

    const getAdmins = useCallback(async () => {
        setIsLoadingAdmins(true)
        const res = (await axios.post("/get_sub_accounts", { access_token })).data
        if (res.status === "ERR") {
            setError_msg(res.msg || "BAD REQUEST")
            setHasError(true)
            setIsLoadingAdmins(false)
            return
        } else {
            setHasError(false)
        }

        setIsLoadingAdmins(false)
        setAdmins(res)
    }, [access_token])

    useEffect(() => {
        getAdmins()
    }, [getAdmins])


    return (
        <>
            <section className={`${styles['change-credentials-section']}`} style={{ marginBottom: "1rem" }}>
                <h2 style={{ marginBottom: "1rem" }}>Change Credentials</h2>
                <form autoComplete='off' className="settings-page flex flex-col gap-2.5" style={{ padding: "0 1rem" }}>
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
                    <footer className="settings-page__footer flex justify-end">
                        <Button onClick={(e) => changeCrendtials(e)} className="primary" disabled={saveMode}>{saveMode ? "Saving..." : "Save"}</Button>
                    </footer>
                </form>
            </section>

            <section className={`${styles['create-admin-section']}`}>
                <h2 style={{ marginBottom: "1rem" }}>Create Admin</h2>
                <main className={`flex gap-col-1 ${styles['flex-col']}`}>
                    <div className='w-full'>
                        <form autoComplete='off' className="settings-page flex flex-col gap-2" style={{ padding: "0 1rem" }}>
                            <div className="modal__form__group">
                                <label className="modal__form__label" htmlFor="username">Username</label>
                                <input autoComplete='new-username' className="modal__form__input" type="text" id="create-username" name="username" />
                            </div>
                            <div className="flex gap-16">
                                <div className="modal__form__group">
                                    <label className="modal__form__label" htmlFor="password">Password</label>
                                    <input autoComplete='new-password' className="modal__form__input" type="password" id="create-password" name="password" />
                                </div>
                            </div>
                            <footer className="settings-page__footer flex justify-end">
                                <Button onClick={(e) => createAdmin(e)} className="primary" disabled={createMode}>{createMode ? "Creating..." : "Create"}</Button>
                            </footer>
                        </form>
                    </div>

                    {admins.length ?
                        <div className={`flex flex-col w-full gap-1.5 ${styles['admin-section']}`}>
                            <h3 className='flex items-center gap-1'>
                                Admins {isLoadingAdmins && <span className="flex items-center spinner"><SpinnerIcon /></span>}
                            </h3>
                            <div className={`flex flex-col w-full gap-1.5 ${styles.admins}`}>
                                {admins.map((admin) => (
                                    <div className={`${styles.admin}`} key={admin.id}>
                                        <div style={{ marginRight: "auto" }}>{admin.username}</div>
                                        <Button className='ghosted' onClick={() => handleShowEditModal(admin)}><EditIcon /></Button>
                                        <Button className='ghosted' onClick={() => handleShowDeleteModal(admin.id)}><DeleteIcon /></Button>
                                    </div>
                                ))}
                            </div>
                        </div> : null}
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
                            <Button className="primary w-full" onClick={() => handleDeleteAdmin(selectedAdminToDelete)} disabled={deleteMode}>{deleteMode ? "Deleting..." : "Delete"}</Button>
                        </footer>
                    </Modal>
                }
            </AnimatePresence>

            <AnimatePresence>
                {showEditModal &&
                    <Modal
                        onClose={() => setShowEditModal(false)}
                        width={"30rem"}
                    >
                        <header className="modal__header">
                            <LeadingIcon>
                                <EditIcon />
                            </LeadingIcon>
                            <h1 className="modal__title">Edit admin</h1>
                            <div className="close-icon" onClick={() => setShowEditModal(false)}>
                                <XMarkIcon />
                            </div>
                        </header>
                        <main style={{ marginBottom: "1rem" }}>
                            <form autoComplete='off' className="settings-page flex flex-col gap-2">
                                <div className="modal__form__group">
                                    <label className="modal__form__label" htmlFor="username">Username</label>
                                    <input autoComplete='new-username' className="modal__form__input" type="text" id="edit-username" name="username" defaultValue={selectedAdminToEdit.username} />
                                </div>
                                <div className="flex gap-16">
                                    <div className="modal__form__group">
                                        <label className="modal__form__label" htmlFor="password">Password</label>
                                        <input autoComplete='new-password' className="modal__form__input" type="text" id="edit-password" name="password" defaultValue={selectedAdminToEdit.password} />
                                    </div>
                                </div>
                            </form>
                        </main>
                        <footer className="flex gap-1 justify-end">
                            <Button className="outlined" onClick={() => setShowEditModal(false)}>Cancel</Button>
                            <Button onClick={(e) => editAdmin(e)} className="primary" disabled={editMode}>{editMode ? "Editing..." : "Edit"}</Button>
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