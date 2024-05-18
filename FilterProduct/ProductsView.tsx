// react
import { ReactNode, useEffect, useState } from 'react';



// application
import Filters16Svg from '../../svg/filters-16.svg';
import LayoutGrid16x16Svg from '../../svg/layout-grid-16x16.svg';
import LayoutGridWithDetails16x16Svg from '../../svg/layout-grid-with-details-16x16.svg';
import LayoutList16x16Svg from '../../svg/layout-list-16x16.svg';
import Pagination from '../shared/Pagination';
import ProductCard from '../shared/ProductCard';

import { useDispatch, useSelector } from 'react-redux'



function ProductsView() {


    const dispatch = useDispatch();

    const { loading, products, error, productsCount, productImages, resPerPage, filteredProductsCount, productsTop } = useSelector(state => state.productsOld)
    const { selectedCategory } = useSelector(state => state.categoryfilter);
    const { minPrice, maxPrice } = useSelector(state => state.priceFilter);




    const fetchProducts = () => {
        dispatch(getProducts());
    };


    useEffect(() => {
        fetchProducts();
    }, [dispatch, selectedCategory]);


    const [productsToShow, setProductsToShow] = useState(6); // default to 6 products
    const [sortOption, setSortOption] = useState('default');
    const [currentPage, setCurrentPage] = useState(1);

    const handleProductsToShowChange = (e) => {
        setProductsToShow(Number(e.target.value));
        setCurrentPage(1);
    };

    const handleSortOptionChange = (e) => {
        setSortOption(e.target.value);
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };


    const applyFiltersAndSort = (products) => {
        let filteredProducts = [...products];

        // Apply category filter
        if (selectedCategory !== null) {
            filteredProducts = filteredProducts.filter(item => item.category === selectedCategory);
        }

        // Apply price filters
        if (minPrice !== '') {
            filteredProducts = filteredProducts.filter(item => item.sale_price >= minPrice);
        }

        if (maxPrice !== '') {
            filteredProducts = filteredProducts.filter(item => item.sale_price <= maxPrice);
        }

        // Apply sorting
        if (sortOption === 'name_asc') {
            filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
        } else if (sortOption === 'name_desc') {
            filteredProducts.sort((a, b) => b.name.localeCompare(a.name));
        }

        return filteredProducts;
    };

    const filteredAndSortedProducts = applyFiltersAndSort(products);

    const startIdx = (currentPage - 1) * productsToShow;
    const endIdx = Math.min(startIdx + productsToShow, filteredAndSortedProducts.length);

    // Products to display on the current page
    const currentProducts = filteredAndSortedProducts.slice(startIdx, endIdx);

    const totalPages = Math.ceil(filteredAndSortedProducts.length / productsToShow);


    ;


    return (
        <>
            <div className="products-view__content">
                <div className="products-view__options">


                    <div className="view-options__legend">
                        {`Showing ${startIdx + 1}—${endIdx} of ${filteredAndSortedProducts.length} products`}
                    </div>
                    <div className="view-options__divider" />
                    <div className="view-options__control">
                        <label htmlFor="view-options-sort">Sort By</label>
                        <div>
                            <select
                                id="view-options-sort"
                                className="form-control form-control-sm"
                                value={sortOption}
                                onChange={handleSortOptionChange}
                            >
                                <option value="default">Default</option>
                                <option value="name_asc">Name (A-Z)</option>
                                <option value="name_desc">Name (Z-A)</option>
                            </select>
                        </div>
                    </div>
                    <div className="view-options__control">
                        <label htmlFor="view-options-limit">Show</label>
                        <div>
                            <select
                                id="view-options-limit"
                                className="form-control form-control-sm"
                                value={productsToShow}
                                onChange={handleProductsToShowChange}
                            >
                                <option value="6">6</option>
                                <option value="12">12</option>
                                <option value="18">18</option>
                                <option value="24">24</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div
                    className="products-view__list products-list"
                    data-layout={layout !== 'list' ? grid : layout}
                    data-with-features={layout === 'grid-with-features' ? 'true' : 'false'}
                >
                    <div className="products-list__body">
                        {productImages && currentProducts.map((product, i) => (
                            <div key={product.id} className="products-list__item">
                                <ProductCard product={product} productImages={productImages} />
                            </div>
                        ))}
                    </div>
                </div>

                <div className="products-view__pagination">
                    <Pagination
                        current={currentPage}
                        siblings={2}
                        total={totalPages}
                        onPageChange={handlePageChange}
                    />
                </div>
            </div>
        </>
    );
}

export default ProductsView;
