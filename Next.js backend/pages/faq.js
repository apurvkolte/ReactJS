import dynamic from "next/dynamic";
import Seo from "../components/common/seo";
import { Fragment } from "react";

// Dynamically import the Faq component
const Faq = dynamic(() => import("../components/faq"));

const Index = () => {
    return (
        <Fragment>
            <Seo pageTitle="Faq" />
            <Faq />
        </Fragment>
    );
};

export default Index
