import React from 'react';

import Modal from '../Modal';
import { motion, AnimatePresence } from 'framer-motion';
import LeadingIcon from '../LeadingIcon';
import { ReactComponent as XMarkIcon } from '../../assets/svg/x-mark.svg';
import FormField from '../form/FormField';
import Button from '../Button';

const Form = ({ onClose, showForm, title, iconComponent, formFields, primaryButtons, secondaryButtons, onSubmit, item }) => {

    function b2gb(x) {
        return parseInt(x / (2 ** 10) ** 3)
    }

    const formHeader = (
        <header className="modal__header">
            <LeadingIcon>
                {iconComponent}
            </LeadingIcon>
            <h1 className="modal__title">{title}</h1>
            <div className="close-icon" onClick={onClose}>
                <XMarkIcon />
            </div>
        </header>
    )

    const formFooter = (
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
    )

    return (
        <AnimatePresence>
            {showForm && (
                <Modal onClose={onClose}>
                    {formHeader}
                    <main className="modal__body">
                        <form className="modal__form">
                            {formFields.map((group, rowIndex) => (
                                <div key={rowIndex} className="flex gap-16">
                                    {Array.isArray(group) ? group.map((field, index) => (
                                        <FormField
                                            key={index}
                                            label={field.label}
                                            type={field.type}
                                            id={field.id}
                                            name={field.name}
                                            animateDelay={rowIndex * 0.1}
                                            defaultValue={
                                                item ?
                                                    (field.id === "volume" ? b2gb(item[field.id]) :
                                                        (field.id === "password" ? "" : item[field.id]))
                                                    : ""
                                            }
                                            disabled={field.disabled}
                                        />
                                    )) : (
                                        <FormField
                                            key={rowIndex}
                                            label={group.label}
                                            type={group.type}
                                            id={group.id}
                                            name={group.name}
                                            animateDelay={rowIndex * 0.1}
                                            defaultValue={
                                                item ?
                                                    (group.id === "volume" ? b2gb(item[group.id]) :
                                                        (group.id === "password" ? "" : item[group.id]))
                                                    : ""
                                            }
                                            disabled={group.disabled}
                                        />
                                    )}
                                </div>
                            ))}
                        </form>
                    </main>
                    {formFooter}
                </Modal>
            )}
        </AnimatePresence>
    );
};

export default Form;
