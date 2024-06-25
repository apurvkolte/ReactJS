import React, { useEffect, useState, useMemo } from "react";
import dynamic from "next/dynamic";
import Seo from "../../components/common/seo";
import Loading from "../../components/layout/Loader";

const ProductDetails = dynamic(() => import("../../components/productDetails"), {
    ssr: false,
    loading: () => <Loading />,
});

const ProductDetailsPage = () => {
    const MemoizedProductDetails = useMemo(() => <ProductDetails />, []);
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    return (
        <>
            <Seo pageTitle="Products" />
            {isClient && MemoizedProductDetails}
        </>
    );
};

export default ProductDetailsPage;
