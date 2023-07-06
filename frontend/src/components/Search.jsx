import React, { useState } from "react";

import "./Search.css";
import { ReactComponent as XMarkIcon } from "../assets/x-mark.svg";
import { ReactComponent as SearchIcon } from "../assets/search.svg";

const Search = () => {
    const [search, setSearch] = useState("");

    const handleSearch = (e) => {
        setSearch(e.target.value);
    };

    return (
        <div className="search">
            <div className="search__icon">
                <SearchIcon />
            </div>
            <input
                type="text"
                placeholder="Search"
                value={search}
                onChange={handleSearch}
            />
            {
                search.length > 0 &&
                <div onClick={() => { setSearch("") }} className="search__icon icon-button">
                    <XMarkIcon />
                </div>
            }
        </div>
    );
}

export default Search;