import React from 'react';

import Modal from '../Modal';
import { motion, AnimatePresence } from 'framer-motion';
import LeadingIcon from '../LeadingIcon';
import { ReactComponent as XMarkIcon } from '../../assets/svg/x-mark.svg';
import FormField from '../form/FormField';
import Button from '../Button';

const Form = ({ onClose, showForm, title, iconComponent, formFields, primaryButtons, secondaryButtons, onSubmit, item }) => {
    return (
        <AnimatePresence>
            {showForm && (
                <Modal onClose={onClose}>
                    <header className="modal__header">
                        <LeadingIcon>
                            {iconComponent}
                        </LeadingIcon>
                        <h1 className="modal__title">{title}</h1>
                        <div className="close-icon" onClick={onClose}>
                            <XMarkIcon />
                        </div>
                    </header>
                    <main className="modal__body">
                        <form className="modal__form">
                            {formFields.map((field, index) => (
                                <FormField
                                    key={index}
                                    label={field.label}
                                    type={field.type}
                                    id={field.id}
                                    name={field.name}
                                    animateDelay={index * 0.1}
                                    defaultValue={item ? item[field.id] : ""}
                                />
                            ))}
                        </form>
                    </main>
                    <motion.footer className="modal__footer" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                        <div style={{ marginRight: "auto", display: "flex" }}>
                            {secondaryButtons?.map((button, index) => (
                                <Button
                                    key={index}
                                    className={button.className}
                                    onClick={button.onClick}
                                >
                                    {button.icon}
                                    {/* {button.label} */}
                                </Button>
                            ))}
                        </div>
                        {primaryButtons.map((button, index) => (
                            <Button
                                key={index}
                                className={button.className}
                                onClick={button.onClick}
                            >
                                {button.label}
                            </Button>
                        ))}
                    </motion.footer>
                </Modal>
            )}
        </AnimatePresence>
    );
};

export default Form;
