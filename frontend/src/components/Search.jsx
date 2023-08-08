import React, { useState,useEffect  } from "react";

import "./Search.css";
import { ReactComponent as XMarkIcon } from "../assets/svg/x-mark.svg";
import { ReactComponent as SearchIcon } from "../assets/svg/search.svg";

const Search = ({items,setItems,mode}) => {
    const [search, setSearch] = useState("");
    const item_name = mode=="1"?"panels":mode=="2"?"agents":"users";
    const property = mode=="1"?"panel_name":mode=="2"?"name":"username";


    useEffect(() => {if (search === "") setItems(JSON.parse(sessionStorage.getItem(item_name)));},[search]);

    const handleSearch = (e) => {
        var val = e.target.value;
        if(!val) setItems(JSON.parse(sessionStorage.getItem(item_name)));
        else
        {
            setItems((JSON.parse(sessionStorage.getItem(item_name))).filter((item) => {
                return item[property].toLowerCase().includes(val.toLowerCase())
            }));
        }

        setSearch(val);
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