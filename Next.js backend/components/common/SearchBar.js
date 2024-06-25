import React, { useContext, useRef } from 'react';
import Link from 'next/link'
import commonContext from '../../contexts/common/commonContext';
import useOutsideClose from '../../hooks/useOutsideClose';
import useScrollDisable from '../../hooks/useScrollDisable';
import filtersContext from '../../contexts/filters/filtersContext';
import { Buffer } from 'buffer';
// import { AiOutlineSearch } from 'react-icons/ai';


const SearchBar = () => {

    const { isSearchOpen, toggleSearch, searchResults, setSearchResults } = useContext(commonContext);
    const { allProducts } = useContext(filtersContext);

    const searchRef = useRef();

    // closing the SearchBar
    const closeSearch = () => {
        toggleSearch(false);
        setSearchResults([]);
    };

    useOutsideClose(searchRef, closeSearch);

    useScrollDisable(isSearchOpen);


    // handling Search
    const handleSearching = (e) => {
        const searchedTerm = e.target.value.toLowerCase().trim();

        const updatedSearchResults = allProducts.filter(item => item.name.toLowerCase().includes(searchedTerm));

        searchedTerm === '' ? setSearchResults([]) : setSearchResults(updatedSearchResults);
    };


    return (
        <div id="searchbar">
            <div ref={searchRef}>
                <div className="search_box">
                    <input
                        type="search"
                        className="input_field serachinput"
                        placeholder="Search for product..."
                        onChange={handleSearching}
                    />
                    {/* <div className="search_action nav_actions">
                            <button type="button"><AiOutlineSearch /></button>
                            <div className="tooltip">Search</div>
                        </div> */}
                    {/* <button
                            type="button"
                            className="btn"
                            disabled={searchResults.length === 0}
                        >
                            <AiOutlineSearch />
                        </button> */}
                </div>

                {
                    searchResults.length !== 0 && (
                        <div className="search_results">
                            {
                                searchResults.map(item => {
                                    const { id, name, path } = item;
                                    const EID = Buffer.from(`${id}`, 'binary').toString('base64')

                                    return (
                                        <Link
                                            href={`/product-details/${EID}?${encodeURIComponent(name)}`}
                                            onClick={closeSearch}
                                            key={id}
                                        >
                                            {name}
                                        </Link>
                                    );
                                })
                            }
                        </div>
                    )
                }
            </div>

        </div>
    );
};

export default SearchBar;