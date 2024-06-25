import React, { Fragment, useState, useEffect, useMemo } from 'react';
import dynamic from 'next/dynamic';
import Seo from "../components/common/seo";
import Loading from '../components/layout/Loader';

// Memoized dynamic import of HomeMain component
const HomeMain = dynamic(() => import("../components/home"), {
    loading: () => <Loading />,
    ssr: false
});

const HomePage = () => {
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    // Memoize the component to avoid re-rendering
    const mainComponent = useMemo(() => <HomeMain />, []);

    return (
        <Fragment>
            <Seo pageTitle="SGSRO" />
            {isClient && mainComponent}
        </Fragment>
    );
};

export default HomePage;
