import React, { useState, useEffect, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getProducts, allCategory } from '../../redux/actions/productActions';
import SectionsHead from '../../components/common/SectionsHead';
import Services from '../../components/common/Services';
import { debounce } from 'lodash';

// Lazy load components
const CategorySlider = dynamic(() => import('../../components/sliders/CategorySlider'));
const HeroSlider = dynamic(() => import('../../components/sliders/HeroSlider'));
// const MainSlider = dynamic(() => import('../../components/sliders/MainSlider'));
const FeaturedSlider = dynamic(() => import('../../components/sliders/FeaturedSlider'));
const TopProducts = dynamic(() => import('../../components/product/TopProducts'));

const Index = () => {
    const router = useRouter();
    const [currentPage, setcurrentPage] = useState(1);
    const [discountPrice, setDiscountPrice] = useState([1, 1000000]);
    const [categoryName, setCategoryName] = useState('');
    const [sort, setSort] = useState('');
    const [rating, setRating] = useState(0);

    const dispatch = useDispatch();
    const { loading, products, error, productsTop } = useSelector(state => state.products);
    const { category } = useSelector(state => state.allCategory);
    const keyword = router.query.keyword;


    // Memoize the filter criteria to prevent unnecessary re-renders
    const filterCriteria = useMemo(() => ({
        keyword, currentPage, discountPrice, categoryName, rating, sort
    }), [keyword, currentPage, discountPrice, categoryName, rating, sort]);

    // Debounce function to avoid excessive dispatch calls
    const debouncedGetProducts = useMemo(() => debounce((criteria) => {
        dispatch(getProducts());
    }, 300), [dispatch]);

    useEffect(() => {
        if (error) {
            toast.error(error);
        }

        debouncedGetProducts(filterCriteria);
    }, [filterCriteria, debouncedGetProducts, error]);

    useEffect(() => {
        dispatch(allCategory());
    }, [dispatch]);

    // Memoize components and variables
    const categorySlider = useMemo(() => <CategorySlider />, []);
    // const mainSlider = useMemo(() => <MainSlider />, []);
    const featuredSlider = useMemo(() => (
        <FeaturedSlider productsTop={productsTop} />
    ), [productsTop]);
    const topProducts = useMemo(() => (
        products && <TopProducts products={products} />
    ), [products]);
    const heroSlider = useMemo(() => (
        products && <HeroSlider products={products} />
    ), [products]);

    return (
        <main>
            <section>
                <center className='category'>
                    {categorySlider}
                </center>
            </section>

            <section id="hero">
                {heroSlider}
            </section>

            {/* <section className='main'>
            {mainSlider}
        </section> */}

            <section id="featured" className="section">
                <div className="container">
                    <SectionsHead heading="Trending Products" />
                    {featuredSlider}
                </div>
            </section>

            <section id="products" className="section bg-poster">
                <div className="container">
                    <SectionsHead heading="Featured Products" />
                    {topProducts}
                </div>
            </section>
            <Services />
            <ToastContainer />
        </main>
    );
}

export default Index;
