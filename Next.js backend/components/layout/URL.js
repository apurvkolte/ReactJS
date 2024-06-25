import React, { useRef, useState, useEffect } from 'react';
import {
  InstantSearch,
  Hits,
  SearchBox,
  RefinementList,
  Pagination,
  Highlight,
} from 'react-instantsearch-dom';
import algoliasearch from 'algoliasearch';
import qs from 'qs';

const DEBOUNCE_TIME = 400;
const searchClient = algoliasearch(
  'undefined',
  'undefined'
);

// `createUrl`, `searchStateToUrl`, and `urlToSearchState`

export function URL({ location, history }) {
  const createURL = state => `?${qs.stringify(state)}`;

  const searchStateToUrl = searchState =>
    searchState ? createURL(searchState) : '';

  const urlToSearchState = ({ search }) => qs.parse(search.slice(1));

  const [searchState, setSearchState] = useState(urlToSearchState(location));
  const debouncedSetStateRef = useRef(null);

  function onSearchStateChange(updatedSearchState) {
    clearTimeout(debouncedSetStateRef.current);

    debouncedSetStateRef.current = setTimeout(() => {
      history.push(searchStateToUrl(updatedSearchState));
    }, DEBOUNCE_TIME);

    setSearchState(updatedSearchState);
  }

  useEffect(() => {
    setSearchState(urlToSearchState(location));
  }, [location]);

  return (
    <div className="container">
      <InstantSearch
        searchClient={searchClient}
        indexName="instant_search"
        searchState={searchState}
        onSearchStateChange={onSearchStateChange}
        createURL={createURL}
      >
        <div className="search-panel">
          <div className="search-panel__filters">
            <RefinementList attribute="brand" />
          </div>

          <div className="search-panel__results">
            <SearchBox className="searchbox" placeholder="Search" />
            <Hits hitComponent={Hit} />

            <div className="pagination">
              <Pagination />
            </div>
          </div>
        </div>
      </InstantSearch>
    </div>
  );
}

function Hit({ hit }) {
  return (
    <div>
      <Highlight attribute="name" hit={hit} />
    </div>
  );
}
