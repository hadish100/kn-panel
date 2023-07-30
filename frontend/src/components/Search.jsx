import React, { useState } from "react";

import "./Search.css";
import { ReactComponent as XMarkIcon } from "../assets/svg/x-mark.svg";
import { ReactComponent as SearchIcon } from "../assets/svg/search.svg";

const Search = ({items,setItems,mode}) => {
    const [search, setSearch] = useState("");
    const item_name = mode=="1"?"panels":mode=="2"?"agents":"users";

    const handleSearch = (e) => {
        var val = e.target.value; 
        if(!val) setItems(JSON.parse(sessionStorage.getItem(item_name)));
        var property = mode=="1"?"panel_name":mode=="2"?"name":"username";
        setSearch(val);
        setItems(items.filter((item) => {
            return item[property].toLowerCase().startsWith(val.toLowerCase())
        }));
    };

    return (
        <div className="search-wrapper">
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
        </div>
    );
}

export default Search;