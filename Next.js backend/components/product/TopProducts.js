import React, { Fragment, useEffect, useState } from 'react';
import Link from 'next/link';
import { BsArrowRight } from 'react-icons/bs';
import useActive from '../../hooks/useActive';
import ProductCard from './ProductCard';


const TopProducts = (props) => {
    var productsALL = props.products;
    const [products, setProducts] = useState(props.products)
    const { activeClass, handleActive } = useActive(0);
    const productsCategory = [
        'All',
        ...new Set(productsALL.map(item => item.category))
    ];

    useEffect(() => {

    }, [productsCategory])

    // handling product's filtering
    const handleProducts = (category, i) => {
        if (category === 'All') {
            setProducts(props.products);
            handleActive(i);
            return;
        }

        const filteredProducts = props.products.filter(item => item.category === category);
        setProducts(filteredProducts);
        handleActive(i);
    };


    return (
        <Fragment>
            <div className="products_filter_tabs">
                <ul className="tabs">
                    {
                        productsCategory.map((item, i) => (
                            <li
                                key={i}
                                className={`tabs_item ${activeClass(i)}`}
                                onClick={() => handleProducts(item, i)}
                            >
                                {item}
                            </li>
                        ))
                    }
                </ul>
            </div>
            <div className="wrapper products_wrapper bg-poster">
                {Object.keys(products)?.length != 0 ? (
                    products.slice(0, 15).map((product) =>
                        <ProductCard key={product.id} product={product} />
                    )
                ) : (
                    productsALL.slice(0, 15).map((product) =>
                        <ProductCard key={product.id} product={product} />
                    )
                )

                }

                <div className="card products_card browse_card">
                    <Link href="/all-products">
                        <a>Browse All <br /> Products <BsArrowRight /></a>
                    </Link>
                </div>
            </div>
        </Fragment>
    );
};

export default TopProducts;