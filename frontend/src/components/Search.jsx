import React, { useState } from "react";

import "./Search.css";

const Search = () => {
    const [search, setSearch] = useState("");

    const handleSearch = (e) => {
        setSearch(e.target.value);
    };

    return (
        <div className="search">
            <div className="search__icon">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 -2 24 24" stroke-width="1.65" stroke="currentColor" aria-hidden="true" class="css-1o363pe"><path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"></path></svg>
            </div>
            <input
                type="text"
                placeholder="Search"
                value={search}
                onChange={handleSearch}
            />
            {
                search.length > 0 &&
                <div className="search__icon icon-button">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="-3 -6 30 30" stroke-width="1.65" stroke="currentColor" aria-hidden="true" focusable="false" class="css-1o363pe"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"></path></svg>
                </div>
            }
        </div>
    );
}

export default Search;