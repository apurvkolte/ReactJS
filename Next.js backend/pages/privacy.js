import dynamic from "next/dynamic";
import Seo from "../components/common/seo";
import { Fragment } from "react";

// Dynamically import the Policy component
const Policy = dynamic(() => import("../components/policy"));

const Index = () => {
    return (
        <Fragment>
            <Seo pageTitle="Shipping Policy" />
            <Policy />
        </Fragment>
    );
};

export default Index;
