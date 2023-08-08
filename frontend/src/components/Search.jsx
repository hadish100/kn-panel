import React from "react";

import "./Search.css";
import { ReactComponent as XMarkIcon } from "../assets/svg/x-mark.svg";
import { ReactComponent as SearchIcon } from "../assets/svg/search.svg";

const Search = ({ value, onChange }) => {
    const handleChnage = (e) => {
        onChange(e.target.value);
    }

    return (
        <div className="search-wrapper">
            <div className="search">
                <div className="search__icon">
                    <SearchIcon />
                </div>
                <input
                    type="text"
                    placeholder="Search"
                    value={value}
                    onChange={handleChnage}
                />
                {
                    value.length > 0 &&
                    <div onClick={() => { onChange("") }} className="search__icon icon-button">
                        <XMarkIcon />
                    </div>
                }
            </div>
        </div>
    );
}

export default Search;