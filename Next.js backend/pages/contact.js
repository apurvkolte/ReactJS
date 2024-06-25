import { Fragment } from "react";
import dynamic from "next/dynamic";
import Seo from "../components/common/seo";
import Contact from "../components/contact";
import Services from '../components/common/Services';

const index = () => {
    return (
        <Fragment>
            <Seo pageTitle="Contact US" />
            <Contact />
            <Services />
        </Fragment>
    );
};

export default dynamic(() => Promise.resolve(index), { ssr: false });
