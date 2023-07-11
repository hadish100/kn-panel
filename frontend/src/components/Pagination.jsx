import React from "react";
import Button from "./Button";
import { ReactComponent as ArrowLeftIcon } from "../assets/arrow-left.svg";
import { ReactComponent as ArrowRightIcon } from "../assets/arrow-right.svg";
import "./Pagination.css";

const Pagination = ({ currentPage, totalPages, handlePageChange }) => {
    const maxVisiblePages = 3; // Maximum number of page numbers to display
    const pageNumbers = [];

    let startPage = 1;
    let endPage = totalPages;

    if (totalPages > maxVisiblePages) {
        const halfVisiblePages = Math.floor(maxVisiblePages / 2);

        if (currentPage <= halfVisiblePages) {
            endPage = maxVisiblePages;
        } else if (currentPage >= totalPages - halfVisiblePages) {
            startPage = totalPages - maxVisiblePages + 1;
        } else {
            startPage = currentPage - halfVisiblePages;
            endPage = currentPage + halfVisiblePages;
        }
    }

    for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
    }

    return (
        <div className="pagination">
            <Button
                className={`transparent pagination-left-btn ${currentPage === 1 ? "disabled" : ""
                    }`}
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
            >
                <ArrowLeftIcon />
                <span style={{ marginLeft: "5px" }}>Previous</span>
            </Button>
            {startPage > 1 && (
                <>
                    <Button
                        className="transparent pagination-btn"
                        onClick={() => handlePageChange(1)}
                    >
                        1
                    </Button>
                    {startPage > 2 && <span className="ellipsis">
                        <Button className="transparent pagination-btn">...</Button>
                    </span>}
                </>
            )}
            {pageNumbers.map((number) => (
                <Button
                    key={number}
                    className={`transparent pagination-btn ${number === currentPage ? "active" : ""
                        }`}
                    onClick={() => handlePageChange(number)}
                >
                    {number}
                </Button>
            ))}
            {endPage < totalPages && (
                <>
                    {endPage < totalPages - 1 && <span className="ellipsis">
                        <Button className="transparent pagination-btn">...</Button>
                    </span>}
                    <Button
                        className="transparent pagination-btn"
                        onClick={() => handlePageChange(totalPages)}
                    >
                        {totalPages}
                    </Button>
                </>
            )}
            <Button
                className={`transparent pagination-right-btn ${currentPage === totalPages ? "disabled" : ""
                    }`}
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
