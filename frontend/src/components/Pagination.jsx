import React from "react";

import Button from "./Button";
import { ReactComponent as ArrowLeftIcon } from "../assets/arrow-left.svg"
import { ReactComponent as ArrowRightIcon } from "../assets/arrow-right.svg";
import "./Pagination.css"

const Pagination = ({ currentPage, totalPages, handlePageChange }) => {
    const pageNumbers = [];

    for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
    }

    return (
        <div className="pagination">
            <Button
                className={`transparent pagination-left-btn ${currentPage === 1 ? "disabled" : ""}`}
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
            >
                <ArrowLeftIcon />
                <span style={{ marginLeft: "5px" }}>Previous</span>
            </Button>
            {pageNumbers.map((number) => (
                <Button
                    key={number}
                    className={`transparent pagination-btn ${number === currentPage ? "active" : ""}`}
                    onClick={() => handlePageChange(number)}
                >
                    {number}
                </Button>
            ))}
            <Button
                className={`transparent pagination-right-btn ${currentPage === totalPages ? "disabled" : ""}`}
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
            >
                <span style={{ marginRight: "5px" }}>Next</span>
                <ArrowRightIcon />
            </Button>
        </div>
    );
};

export default Pagination;
