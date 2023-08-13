import React from 'react'

import { ReactComponent as DeleteIcon } from "../../assets/svg/delete2.svg"
import { ReactComponent as XMarkIcon } from '../../assets/svg/x-mark.svg';
import { AnimatePresence } from 'framer-motion';
import LeadingIcon from '../LeadingIcon';
import Modal from '../Modal';
import Button from '../Button';

const VerifyDelete = ({ onClose, showForm, onDeleteItem, deleteMode }) => {
    return (
        <AnimatePresence>
            {showForm && (
                <Modal onClose={onClose} width={"30rem"} alignItems={"center"}>
                    <header className="modal__header">
                        <LeadingIcon>
                            <DeleteIcon />
                        </LeadingIcon>
                        <h1 className="modal__title">Confirm Delete</h1>
                        <div className="close-icon" onClick={onClose}>
                            <XMarkIcon />
                        </div>
                    </header>
                    <footer className="modal__footer">
                        <Button className="outlined wide_btn" onClick={onClose} > Cancel </Button>
                        <Button className="primary wide_btn" onClick={onDeleteItem} disabled={deleteMode}> {deleteMode ? "Deleting..." : "Delete"} </Button>
                    </footer>
                </Modal>
            )}
        </AnimatePresence>
    )
}

export default VerifyDelete