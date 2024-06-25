import React, { useState, useContext, Fragment } from 'react';
import { BsExclamationCircle } from 'react-icons/bs';
import useDocTitle from '../../hooks/useDocTitle';
import FilterBar from '../../components/filters/FilterBar';
import ProductCard from '../../components/product/ProductCard';
import Services from '../../components/common/Services';
import filtersContext from '../../contexts/filters/filtersContext';
import EmptyView from '../../components/common/EmptyView';

import ReactPaginate from 'react-paginate';

const AllProducts = () => {

    useDocTitle('All Products');

    const { allProducts, productImages, updatedProducts } = useContext(filtersContext);

    const pData = Object.keys(updatedProducts).length === 0 ? allProducts : updatedProducts

    const items = pData

    function Items({ currentItems }) {
        return (
            <div className="wrapper products_wrapper">
                {
                    currentItems && currentItems.map((product) =>
                        <ProductCard key={product.id} product={product} productImages={productImages} />
                    )
                }
            </div>
        );
    }

    function PaginatedItems({ itemsPerPage }) {
        // Here we use item offsets; we could also use page offsets
        // following the API or data you're working with.
        const [itemOffset, setItemOffset] = useState(0);

        // Simulate fetching items from another resources.
        // (This could be items from props; or items loaded in a local state
        // from an API endpoint with useEffect and useState)
        const endOffset = itemOffset + itemsPerPage;
        // console.log(`Loading items from ${itemOffset} to ${endOffset}`);
        const currentItems = items.slice(itemOffset, endOffset);
        const pageCount = Math.ceil(items.length / itemsPerPage);

        // Invoke when user click to request another page.
        const handlePageClick = (event) => {
            const newOffset = (event.selected * itemsPerPage) % items.length;
            // console.log(
            //     `User requested page number ${event.selected}, which is offset ${newOffset}`
            // );
            setItemOffset(newOffset);
        };
        return (
            <Fragment>
                <Items currentItems={currentItems} />
                <ReactPaginate
                    breakLabel="..."
                    nextLabel="Next"
                    onPageChange={handlePageClick}
                    pageRangeDisplayed={5}
                    pageCount={pageCount}
                    previousLabel="Prev"
                    renderOnZeroPageCount={null}
                    breakClassName={'page-item'}
                    breakLinkClassName={'page-link'}
                    containerClassName={'pagination'}
                    pageClassName={'page-item'}
                    pageLinkClassName={'page-link'}
                    previousClassName={'page-item'}
                    previousLinkClassName={'page-link'}
                    nextClassName={'page-item'}
                    nextLinkClassName={'page-link'}
                    activeClassName={'active'}
                />
            </Fragment>
        );
    }


    return (
        <>
            <section id="all_products" className="section bg-poster">
                <FilterBar />

                <div className="container">
                    {
                        pData && pData.length ? (
                            <>
                                <PaginatedItems itemsPerPage={16} />
                            </>
                        ) : (
                            <EmptyView
                                icon={<BsExclamationCircle />}
                                msg="No Results Found"
                            />
                        )
                    }
                </div>
            </section>

            <Services />boat oyo snadel mobik
        </>
    );
};

export default AllProducts;